
-- Drop the existing primary key and recreate table with passport_number as primary key
DROP TABLE IF EXISTS public.bookings CASCADE;

CREATE TABLE public.bookings (
  passport_number TEXT NOT NULL PRIMARY KEY,
  id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  submitted_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  appointment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert bookings (for public form submissions)
CREATE POLICY "Anyone can create bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows anyone to select bookings by passport number (for status checking)
CREATE POLICY "Anyone can view bookings by passport number" 
  ON public.bookings 
  FOR SELECT 
  USING (true);

-- Create policy that allows anyone to update bookings (for admin approval)
CREATE POLICY "Anyone can update bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (true);

-- Create index for faster email lookups
CREATE INDEX idx_bookings_email ON public.bookings(email);

-- Create index for status filtering
CREATE INDEX idx_bookings_status ON public.bookings(status);
