
-- Create barber_profiles table to store barber information
CREATE TABLE public.barber_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  location TEXT NOT NULL,
  specialty TEXT NOT NULL,
  pricing TEXT NOT NULL,
  x_handle TEXT,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table for future booking functionality
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  barber_id UUID REFERENCES public.barber_profiles(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  service_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.barber_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for barber_profiles
CREATE POLICY "Barbers can view their own profile" ON public.barber_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Barbers can insert their own profile" ON public.barber_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Barbers can update their own profile" ON public.barber_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view active barber profiles" ON public.barber_profiles
  FOR SELECT USING (status = 'active');

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Barbers can view bookings for their profile" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.barber_profiles 
      WHERE barber_profiles.id = bookings.barber_id 
      AND barber_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Barbers can update bookings for their profile" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.barber_profiles 
      WHERE barber_profiles.id = bookings.barber_id 
      AND barber_profiles.user_id = auth.uid()
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_barber_profiles_updated_at
  BEFORE UPDATE ON public.barber_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
