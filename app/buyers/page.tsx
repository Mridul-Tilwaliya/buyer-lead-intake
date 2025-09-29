// app/buyers/page.tsx
import { Suspense } from 'react'
import { BuyerList } from '@/components/buyers/buyer-list'
import { BuyerFilters } from '@/components/buyers/buyer-filters'
import { CreateBuyerButton } from '@/components/buyers/create-buyer-button'
import { ImportExportButtons } from '@/components/buyers/import-export-buttons'

interface BuyersPageProps {
  searchParams: {
    page?: string
    search?: string
    city?: string
    propertyType?: string
    status?: string
    timeline?: string
  }
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Buyer Leads</h1>
        <div className="flex gap-2">
          <ImportExportButtons />
          <CreateBuyerButton />
        </div>
      </div>

      <BuyerFilters searchParams={searchParams} />
      
      <Suspense fallback={<BuyerListSkeleton />}>
        <BuyerList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function BuyerListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse bg-muted h-20 rounded-lg" />
      ))}
    </div>
  )
}