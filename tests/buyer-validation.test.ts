// tests/buyer-validation.test.ts
import { insertBuyerSchema } from '@/lib/db/schema'

describe('Buyer Validation', () => {
  it('should validate correct buyer data', () => {
    const validBuyer = {
      fullName: 'John Doe',
      phone: '1234567890',
      city: 'Chandigarh',
      propertyType: 'Apartment',
      bhk: '2',
      purpose: 'Buy',
      timeline: '0–3m',
      source: 'Website',
    }

    expect(() => insertBuyerSchema.parse(validBuyer)).not.toThrow()
  })

  it('should require BHK for apartment and villa', () => {
    const invalidBuyer = {
      fullName: 'John Doe',
      phone: '1234567890',
      city: 'Chandigarh',
      propertyType: 'Apartment',
      purpose: 'Buy',
      timeline: '0–3m',
      source: 'Website',
    }

    expect(() => insertBuyerSchema.parse(invalidBuyer)).toThrow('BHK is required')
  })

  it('should validate budget range', () => {
    const invalidBudget = {
      fullName: 'John Doe',
      phone: '1234567890',
      city: 'Chandigarh',
      propertyType: 'Plot',
      purpose: 'Buy',
      timeline: '0–3m',
      source: 'Website',
      budgetMin: 1000000,
      budgetMax: 500000,
    }

    expect(() => insertBuyerSchema.parse(invalidBudget)).toThrow('Budget max must be greater')
  })
})