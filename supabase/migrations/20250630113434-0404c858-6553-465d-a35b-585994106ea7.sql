
-- Add bank account information to barber profiles
ALTER TABLE public.barber_profiles 
ADD COLUMN bank_account_number TEXT,
ADD COLUMN bank_routing_number TEXT,
ADD COLUMN bank_account_verified BOOLEAN DEFAULT false,
ADD COLUMN stripe_account_id TEXT;

-- Create a table for real-time payments
CREATE TABLE public.real_time_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  barber_id UUID REFERENCES barber_profiles(id),
  booking_id UUID REFERENCES bookings(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create a table for client acquisition suggestions tracking
CREATE TABLE public.barber_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barber_profiles(id),
  suggestion_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.real_time_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barber_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS policies for real_time_payments
CREATE POLICY "Barbers can view their payments" ON public.real_time_payments
  FOR SELECT USING (
    barber_id IN (
      SELECT id FROM barber_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their payments" ON public.real_time_payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Insert payments" ON public.real_time_payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Update payments" ON public.real_time_payments
  FOR UPDATE USING (true);

-- RLS policies for barber_suggestions
CREATE POLICY "Barbers can view their suggestions" ON public.barber_suggestions
  FOR SELECT USING (
    barber_id IN (
      SELECT id FROM barber_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Insert suggestions" ON public.barber_suggestions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Update suggestions" ON public.barber_suggestions
  FOR UPDATE USING (
    barber_id IN (
      SELECT id FROM barber_profiles WHERE user_id = auth.uid()
    )
  );

-- Insert default suggestions for all existing barbers
INSERT INTO public.barber_suggestions (barber_id, suggestion_type, title, description, priority)
SELECT 
  id,
  'profile_optimization',
  'Complete Your Profile',
  'Add professional photos and detailed service descriptions to attract more clients',
  1
FROM barber_profiles
WHERE id NOT IN (SELECT barber_id FROM barber_suggestions WHERE suggestion_type = 'profile_optimization');

INSERT INTO public.barber_suggestions (barber_id, suggestion_type, title, description, priority)
SELECT 
  id,
  'social_media',
  'Promote on Social Media',
  'Share your work on Instagram and TikTok to reach younger clients',
  2
FROM barber_profiles
WHERE id NOT IN (SELECT barber_id FROM barber_suggestions WHERE suggestion_type = 'social_media');

INSERT INTO public.barber_suggestions (barber_id, suggestion_type, title, description, priority)
SELECT 
  id,
  'pricing_strategy',
  'Optimize Your Pricing',
  'Review competitor pricing and adjust your rates to stay competitive',
  3
FROM barber_profiles
WHERE id NOT IN (SELECT barber_id FROM barber_suggestions WHERE suggestion_type = 'pricing_strategy');

INSERT INTO public.barber_suggestions (barber_id, suggestion_type, title, description, priority)
SELECT 
  id,
  'availability',
  'Expand Your Hours',
  'Consider offering evening or weekend appointments to accommodate more clients',
  2
FROM barber_profiles
WHERE id NOT IN (SELECT barber_id FROM barber_suggestions WHERE suggestion_type = 'availability');

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_real_time_payments_updated_at
  BEFORE UPDATE ON public.real_time_payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_barber_suggestions_updated_at
  BEFORE UPDATE ON public.barber_suggestions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
