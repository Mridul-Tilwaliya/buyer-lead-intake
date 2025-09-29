// app/api/buyers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { buyers, buyerHistory } from '@/lib/db/schema'
import { and, eq, like, or, sql } from 'drizzle-orm'
import { insertBuyerSchema } from '@/lib/db/schema'

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map()

function rateLimit(userId: string, limit = 10, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs
  const requests = rateLimitMap.get(userId) || []
  const validRequests = requests.filter((time: number) => time > windowStart)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(userId, validRequests)
  return true
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    if (!rateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validatedData = insertBuyerSchema.parse(body)

    const [buyer] = await db
      .insert(buyers)
      .values({
        ...validatedData,
        ownerId: user.id,
      })
      .returning()

    // Create history entry
    await db.insert(buyerHistory).values({
      buyerId: buyer.id,
      changedBy: user.id,
      diff: { created: true },
    })

    return NextResponse.json(buyer)
  } catch (error) {
    console.error('Error creating buyer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const city = searchParams.get('city')
    const propertyType = searchParams.get('propertyType')
    const status = searchParams.get('status')
    const timeline = searchParams.get('timeline')
    const limit = 10
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []
    
    if (search) {
      conditions.push(
        or(
          like(buyers.fullName, `%${search}%`),
          like(buyers.phone, `%${search}%`),
          like(buyers.email, `%${search}%`)
        )
      )
    }
    
    if (city) conditions.push(eq(buyers.city, city as any))
    if (propertyType) conditions.push(eq(buyers.propertyType, propertyType as any))
    if (status) conditions.push(eq(buyers.status, status as any))
    if (timeline) conditions.push(eq(buyers.timeline, timeline as any))

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [buyersData, totalCount] = await Promise.all([
      db
        .select()
        .from(buyers)
        .where(where)
        .orderBy(buyers.updatedAt)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(buyers)
        .where(where),
    ])

    return NextResponse.json({
      buyers: buyersData,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching buyers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}