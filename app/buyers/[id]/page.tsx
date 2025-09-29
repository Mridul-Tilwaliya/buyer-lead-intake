// app/buyers/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BuyerForm } from '@/components/buyers/buyer-form'
import { insertBuyerSchema, type InsertBuyer } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { ArrowLeft, History, Save } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

interface BuyerHistory {
  id: string
  changedBy: string
  changedAt: string
  diff: Record<string, { old: any; new: any }>
  user: { email: string }
}

export default function BuyerPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [buyer, setBuyer] = useState<any>(null)
  const [history, setHistory] = useState<BuyerHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchBuyer()
      fetchHistory()
    }
  }, [params.id])

  const fetchBuyer = async () => {
    try {
      const response = await fetch(`/api/buyers/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch buyer')
      const data = await response.json()
      setBuyer(data)
    } catch (err) {
      setError('Failed to load buyer')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/buyers/${params.id}/history`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (err) {
      console.error('Failed to load history')
    }
  }

  const handleSubmit = async (data: InsertBuyer) => {
    if (!user) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/buyers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, updatedAt: buyer.updatedAt }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update buyer')
      }

      const updatedBuyer = await response.json()
      setBuyer(updatedBuyer)
      fetchHistory() // Refresh history
      router.push('/buyers')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container mx-auto py-6">Loading...</div>
  if (error) return <div className="container mx-auto py-6 text-destructive">{error}</div>
  if (!buyer) return <div className="container mx-auto py-6">Buyer not found</div>

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Buyer</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BuyerForm
            initialData={buyer}
            onSubmit={handleSubmit}
            isSubmitting={saving}
          />
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <History className="h-4 w-4" />
              Recent Changes
            </h3>
            <div className="space-y-3">
              {history.slice(0, 5).map((record) => (
                <div key={record.id} className="text-sm border-l-2 pl-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{record.user.email}</span>
                    <span className="text-muted-foreground">
                      {new Date(record.changedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {Object.entries(record.diff).map(([field, changes]) => (
                    <div key={field} className="text-xs text-muted-foreground">
                      {field}: {JSON.stringify(changes.old)} → {JSON.stringify(changes.new)}
                    </div>
                  ))}
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-sm text-muted-foreground">No changes recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}