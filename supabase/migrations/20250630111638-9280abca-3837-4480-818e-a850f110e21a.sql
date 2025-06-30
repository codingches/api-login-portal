
-- Add verification badge system
ALTER TABLE public.barber_profiles 
ADD COLUMN is_verified BOOLEAN DEFAULT false,
ADD COLUMN verification_paid_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN address TEXT;

-- Update barber_services table for more detailed pricing
ALTER TABLE public.barber_services 
ADD COLUMN onsite_price INTEGER,
ADD COLUMN home_service_price INTEGER,
ADD COLUMN home_service_available BOOLEAN DEFAULT false;

-- Create client rewards table
CREATE TABLE public.client_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_bookings INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT 'bronze',
  discount_percentage INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create verification payments table
CREATE TABLE public.verification_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL DEFAULT 200, -- $2.00 in cents
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.client_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_rewards
CREATE POLICY "Users can view their own rewards" 
  ON public.client_rewards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" 
  ON public.client_rewards 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Insert rewards for authenticated users" 
  ON public.client_rewards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for verification_payments
CREATE POLICY "Barbers can view their verification payments" 
  ON public.verification_payments 
  FOR SELECT 
  USING (
    barber_id IN (
      SELECT id FROM barber_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Insert verification payments" 
  ON public.verification_payments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Update verification payments" 
  ON public.verification_payments 
  FOR UPDATE 
  USING (true);

-- Create trigger to update client rewards when booking is completed
CREATE OR REPLACE FUNCTION public.update_client_rewards()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  booking_amount INTEGER := 50; -- Default amount if not specified
  user_rewards RECORD;
  new_tier TEXT;
  new_discount INTEGER;
BEGIN
  -- Get or create user rewards record
  INSERT INTO public.client_rewards (user_id, total_bookings, total_spent)
  VALUES (NEW.user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update booking count and spent amount
  UPDATE public.client_rewards 
  SET 
    total_bookings = total_bookings + 1,
    total_spent = total_spent + booking_amount,
    points_earned = points_earned + 10,
    updated_at = now()
  WHERE user_id = NEW.user_id
  RETURNING * INTO user_rewards;
  
  -- Calculate new tier and discount
  IF user_rewards.total_bookings >= 20 THEN
    new_tier := 'platinum';
    new_discount := 20;
  ELSIF user_rewards.total_bookings >= 10 THEN
    new_tier := 'gold';
    new_discount := 15;
  ELSIF user_rewards.total_bookings >= 5 THEN
    new_tier := 'silver';
    new_discount := 10;
  ELSE
    new_tier := 'bronze';
    new_discount := 5;
  END IF;
  
  -- Update tier and discount
  UPDATE public.client_rewards 
  SET 
    current_tier = new_tier,
    discount_percentage = new_discount
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for completed bookings
CREATE TRIGGER on_booking_completed
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION public.update_client_rewards();

-- Add updated_at trigger for new tables
CREATE TRIGGER handle_updated_at_client_rewards
  BEFORE UPDATE ON public.client_rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_verification_payments
  BEFORE UPDATE ON public.verification_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
