// app/api/buyers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { buyers, buyerHistory } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { updateBuyerSchema } from '@/lib/db/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [buyer] = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, params.id))

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    return NextResponse.json(buyer)
  } catch (error) {
    console.error('Error fetching buyer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateBuyerSchema.parse(body)

    // Check if buyer exists and user owns it
    const [existingBuyer] = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, params.id))

    if (!existingBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    if (existingBuyer.ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check for concurrent modification
    if (new Date(validatedData.updatedAt).getTime() !== new Date(existingBuyer.updatedAt).getTime()) {
      return NextResponse.json(
        { error: 'Record changed, please refresh' },
        { status: 409 }
      )
    }

    const [updatedBuyer] = await db
      .update(buyers)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(buyers.id, params.id))
      .returning()

    // Create history entry
    const diff: Record<string, { old: any; new: any }> = {}
    Object.keys(validatedData).forEach(key => {
      if (key !== 'id' && key !== 'updatedAt' && existingBuyer[key as keyof typeof existingBuyer] !== validatedData[key as keyof typeof validatedData]) {
        diff[key] = {
          old: existingBuyer[key as keyof typeof existingBuyer],
          new: validatedData[key as keyof typeof validatedData],
        }
      }
    })

    if (Object.keys(diff).length > 0) {
      await db.insert(buyerHistory).values({
        buyerId: params.id,
        changedBy: user.id,
        diff,
      })
    }

    return NextResponse.json(updatedBuyer)
  } catch (error) {
    console.error('Error updating buyer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}