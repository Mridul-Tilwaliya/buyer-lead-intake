-- migrations/0000_initial_schema.sql
CREATE TYPE city AS ENUM ('Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other');
CREATE TYPE property_type AS ENUM ('Apartment', 'Villa', 'Plot', 'Office', 'Retail');
CREATE TYPE bhk AS ENUM ('1', '2', '3', '4', 'Studio');
CREATE TYPE purpose AS ENUM ('Buy', 'Rent');
CREATE TYPE timeline AS ENUM ('0–3m', '3–6m', '>6m', 'Exploring');
CREATE TYPE source AS ENUM ('Website', 'Referral', 'Walk-in', 'Call', 'Other');
CREATE TYPE status AS ENUM ('New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (length(full_name) >= 2 AND length(full_name) <= 80),
  email TEXT CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT NOT NULL CHECK (phone ~ '^\d{10,15}$'),
  city city NOT NULL,
  property_type property_type NOT NULL,
  bhk bhk,
  purpose purpose NOT NULL,
  budget_min INTEGER CHECK (budget_min > 0),
  budget_max INTEGER CHECK (budget_max > 0),
  timeline timeline NOT NULL,
  source source NOT NULL,
  status status NOT NULL DEFAULT 'New',
  notes TEXT CHECK (length(notes) <= 1000),
  tags TEXT[],
  owner_id UUID NOT NULL REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CHECK (budget_max IS NULL OR budget_min IS NULL OR budget_max >= budget_min),
  CHECK (property_type NOT IN ('Apartment', 'Villa') OR bhk IS NOT NULL)
);

CREATE TABLE buyer_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  diff JSONB NOT NULL
);

CREATE INDEX idx_buyers_owner_id ON buyers(owner_id);
CREATE INDEX idx_buyers_status ON buyers(status);
CREATE INDEX idx_buyers_city ON buyers(city);
CREATE INDEX idx_buyers_updated_at ON buyers(updated_at);
CREATE INDEX idx_buyer_history_buyer_id ON buyer_history(buyer_id);