
-- Enable RLS on barber_profiles table if not already enabled
ALTER TABLE public.barber_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active barber profiles
CREATE POLICY "Allow public read access to active barbers" 
  ON public.barber_profiles 
  FOR SELECT 
  USING (status = 'active');
