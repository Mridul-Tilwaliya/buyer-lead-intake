// components/buyers/buyer-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { insertBuyerSchema, type InsertBuyer } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BuyerFormProps {
  initialData?: Partial<InsertBuyer>
  onSubmit: (data: InsertBuyer) => Promise<void>
  isSubmitting?: boolean
}

const cities = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] as const
const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] as const
const bhkOptions = ['1', '2', '3', '4', 'Studio'] as const
const purposes = ['Buy', 'Rent'] as const
const timelines = ['0–3m', '3–6m', '>6m', 'Exploring'] as const
const sources = ['Website', 'Referral', 'Walk-in', 'Call', 'Other'] as const
const statusOptions = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] as const

export function BuyerForm({ initialData, onSubmit, isSubmitting = false }: BuyerFormProps) {
  const [selectedPropertyType, setSelectedPropertyType] = useState(initialData?.propertyType || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InsertBuyer>({
    resolver: zodResolver(insertBuyerSchema),
    defaultValues: initialData,
  })

  const watchedPropertyType = watch('propertyType')

  const handleFormSubmit = async (data: InsertBuyer) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="Enter full name"
            aria-invalid={errors.fullName ? 'true' : 'false'}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive" role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="Enter 10-15 digit phone number"
            aria-invalid={errors.phone ? 'true' : 'false'}
          />
          {errors.phone && (
            <p className="text-sm text-destructive" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter email address"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className="text-sm text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Select onValueChange={(value) => setValue('city', value as any)} defaultValue={initialData?.city}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-sm text-destructive" role="alert">
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type *</Label>
          <Select 
            onValueChange={(value) => {
              setValue('propertyType', value as any)
              setSelectedPropertyType(value)
            }} 
            defaultValue={initialData?.propertyType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-sm text-destructive" role="alert">
              {errors.propertyType.message}
            </p>
          )}
        </div>

        {(watchedPropertyType === 'Apartment' || watchedPropertyType === 'Villa') && (
          <div className="space-y-2">
            <Label htmlFor="bhk">BHK *</Label>
            <Select onValueChange={(value) => setValue('bhk', value as any)} defaultValue={initialData?.bhk}>
              <SelectTrigger>
                <SelectValue placeholder="Select BHK" />
              </SelectTrigger>
              <SelectContent>
                {bhkOptions.map((bhk) => (
                  <SelectItem key={bhk} value={bhk}>
                    {bhk} {bhk === 'Studio' ? '' : 'BHK'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bhk && (
              <p className="text-sm text-destructive" role="alert">
                {errors.bhk.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose *</Label>
          <Select onValueChange={(value) => setValue('purpose', value as any)} defaultValue={initialData?.purpose}>
            <SelectTrigger>
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              {purposes.map((purpose) => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline *</Label>
          <Select onValueChange={(value) => setValue('timeline', value as any)} defaultValue={initialData?.timeline}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelines.map((timeline) => (
                <SelectItem key={timeline} value={timeline}>
                  {timeline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source *</Label>
          <Select onValueChange={(value) => setValue('source', value as any)} defaultValue={initialData?.source}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {initialData && (
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={initialData?.status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="budgetMin">Budget Min (INR)</Label>
          <Input
            id="budgetMin"
            type="number"
            {...register('budgetMin', { valueAsNumber: true })}
            placeholder="Minimum budget"
          />
          {errors.budgetMin && (
            <p className="text-sm text-destructive" role="alert">
              {errors.budgetMin.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetMax">Budget Max (INR)</Label>
          <Input
            id="budgetMax"
            type="number"
            {...register('budgetMax', { valueAsNumber: true })}
            placeholder="Maximum budget"
          />
          {errors.budgetMax && (
            <p className="text-sm text-destructive" role="alert">
              {errors.budgetMax.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Additional notes (max 1000 characters)"
        />
        {errors.notes && (
          <p className="text-sm text-destructive" role="alert">
            {errors.notes.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialData ? 'Update Buyer' : 'Create Buyer'}
      </Button>
    </form>
  )
}