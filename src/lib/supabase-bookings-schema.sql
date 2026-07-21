-- ==========================================
-- MILA HAIR STUDIO - SUPABASE BOOKINGS SCHEMA
-- ==========================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enum Type for Booking Status
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'completed', 'cancelled');
    END IF;
END $$;

-- 2. Create Table: bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  total_payment INTEGER DEFAULT 0, -- Diisi oleh Admin saat status diubah menjadi 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for high performance queries
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for demonstration & admin operations
CREATE POLICY "Allow public read access on bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on bookings" ON bookings FOR UPDATE USING (true);

-- Sample Initial Data Seed (Dummy bookings for testing Admin Dashboard)
INSERT INTO bookings (customer_name, customer_phone, service_name, booking_date, booking_time, status, total_payment) 
VALUES
  ('Aurelia Cantika', '08123456789', 'Signature Milla Haircut & Blow', CURRENT_DATE, '14:00:00', 'completed', 350000),
  ('Dian Sastrowardoyo', '081122334455', 'Premium Keratin Blowout Smooth', CURRENT_DATE, '10:00:00', 'completed', 1200000),
  ('Budi Santoso', '081987654321', 'Detoxifying Clay Scalp Ritual', CURRENT_DATE, '11:00:00', 'accepted', 0),
  ('Siti Nurhaliza', '081345678901', 'Balayage Korean Color & Gloss', CURRENT_DATE + INTERVAL '1 day', '13:00:00', 'pending', 0),
  ('Raisa Andriana', '081299887766', 'Luxe Hair Spa & Hair Mask', CURRENT_DATE - INTERVAL '1 day', '15:00:00', 'completed', 450000)
ON CONFLICT DO NOTHING;
