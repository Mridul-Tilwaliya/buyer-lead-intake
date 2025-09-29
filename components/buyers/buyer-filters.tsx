// components/buyers/buyer-filters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { debounce } from '@/lib/utils'
import { useEffect, useState } from 'react'

const cities = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] as const
const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] as const
const statusOptions = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] as const
const timelines = ['0–3m', '3–6m', '>6m', 'Exploring'] as const

interface BuyerFiltersProps {
  searchParams: {
    search?: string
    city?: string
    propertyType?: string
    status?: string
    timeline?: string
  }
}

export function BuyerFilters({ searchParams }: BuyerFiltersProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [search, setSearch] = useState(searchParams.search || '')

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(params)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.delete('page') // Reset to first page when filtering
    router.push(`/buyers?${newParams.toString()}`)
  }

  const debouncedSearch = debounce((value: string) => {
    updateParam('search', value)
  }, 300)

  useEffect(() => {
    debouncedSearch(search)
  }, [search])

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/50">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Name, phone, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Select
          value={searchParams.city || ''}
          onValueChange={(value) => updateParam('city', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All cities</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyType">Property Type</Label>
        <Select
          value={searchParams.propertyType || ''}
          onValueChange={(value) => updateParam('propertyType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            {propertyTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={searchParams.status || ''}
          onValueChange={(value) => updateParam('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statusOptions.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeline">Timeline</Label>
        <Select
          value={searchParams.timeline || ''}
          onValueChange={(value) => updateParam('timeline', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All timelines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All timelines</SelectItem>
            {timelines.map(timeline => (
              <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}