// components/buyers/buyer-list.tsx - MISSING IMPLEMENTATION
'use client'

import { useState, useEffect } from 'react'
import { Buyer } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Edit, Phone, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'

interface BuyerListProps {
  searchParams: {
    page?: string
    search?: string
    city?: string
    propertyType?: string
    status?: string
    timeline?: string
  }
}

export function BuyerList({ searchParams }: BuyerListProps) {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const params = new URLSearchParams()
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })

        const response = await fetch(`/api/buyers?${params}`)
        const data = await response.json()
        
        setBuyers(data.buyers)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Error fetching buyers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBuyers()
  }, [searchParams])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {buyers.map((buyer) => (
        <div key={buyer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{buyer.fullName}</h3>
                <Badge variant={buyer.status === 'New' ? 'default' : 'secondary'}>
                  {buyer.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {buyer.phone}
                </span>
                {buyer.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {buyer.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {buyer.timeline}
                </span>
              </div>

              <div className="flex gap-3 text-sm">
                <span>{buyer.city}</span>
                <span>•</span>
                <span>{buyer.propertyType}</span>
                {buyer.bhk && (
                  <>
                    <span>•</span>
                    <span>{buyer.bhk} BHK</span>
                  </>
                )}
              </div>

              {(buyer.budgetMin || buyer.budgetMax) && (
                <div className="text-sm">
                  Budget: {formatCurrency(buyer.budgetMin || 0)} - {formatCurrency(buyer.budgetMax || 0)}
                </div>
              )}
            </div>

            <Button asChild size="sm">
              <Link href={`/buyers/${buyer.id}`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
          </div>

          {buyer.tags && buyer.tags.length > 0 && (
            <div className="flex gap-1 mt-3">
              {buyer.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button 
          disabled={pagination.page === 1}
          onClick={() => {/* Handle prev page */}}
        >
          Previous
        </Button>
        
        <span className="text-sm">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        
        <Button 
          disabled={pagination.page === pagination.totalPages}
          onClick={() => {/* Handle next page */}}
        >
          Next
        </Button>
      </div>
    </div>
  )
}