// scripts/seed-db.ts
import { db } from '../lib/db';
import { buyers, users } from '../lib/db/schema';

async function seed() {
  console.log('Seeding database...');

  // Create sample users
  const sampleUsers = await db.insert(users).values([
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: 'admin',
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'agent@example.com',
      fullName: 'Real Estate Agent',
      role: 'user',
    },
  ]).returning();

  // Create sample buyers
  await db.insert(buyers).values([
    {
      fullName: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '9876543210',
      city: 'Chandigarh',
      propertyType: 'Apartment',
      bhk: '3',
      purpose: 'Buy',
      budgetMin: 5000000,
      budgetMax: 7500000,
      timeline: '0–3m',
      source: 'Website',
      status: 'New',
      ownerId: sampleUsers[0].id,
      tags: ['premium', 'urgent'],
    },
    {
      fullName: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '9876543211',
      city: 'Mohali',
      propertyType: 'Villa',
      bhk: '4',
      purpose: 'Rent',
      budgetMin: 35000,
      budgetMax: 50000,
      timeline: '3–6m',
      source: 'Referral',
      status: 'Contacted',
      ownerId: sampleUsers[1].id,
      tags: ['family', 'gated-community'],
    },
  ]);

  console.log('Database seeded successfully!');
}

seed().catch(console.error);