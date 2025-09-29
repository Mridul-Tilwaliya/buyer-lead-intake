// app/buyers/new/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { BuyerForm } from '@/components/buyers/buyer-form'
import { insertBuyerSchema, type InsertBuyer } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function NewBuyerPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: InsertBuyer) => {
    setSaving(true)
    setError('')
    
    try {
      const response = await fetch('/api/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create buyer')
      }

      router.push('/buyers')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Buyer</h1>
      </div>

      {error && (
        <div className="p-4 text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      )}

      <BuyerForm onSubmit={handleSubmit} isSubmitting={saving} />
    </div>
  )
}