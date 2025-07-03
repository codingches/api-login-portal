
-- Create photo_gallery table for barber photo galleries
CREATE TABLE public.photo_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on photo_gallery
ALTER TABLE public.photo_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for photo_gallery
CREATE POLICY "Everyone can view photos" 
  ON public.photo_gallery 
  FOR SELECT 
  USING (true);

CREATE POLICY "Barbers can manage their photos" 
  ON public.photo_gallery 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM barber_profiles 
    WHERE barber_profiles.id = photo_gallery.barber_id 
    AND barber_profiles.user_id = auth.uid()
  ));

-- Create push_notifications table for user notifications
CREATE TABLE public.push_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on push_notifications
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for push_notifications
CREATE POLICY "Users can view their notifications" 
  ON public.push_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" 
  ON public.push_notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow system to insert notifications
CREATE POLICY "System can insert notifications" 
  ON public.push_notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Add average_rating and total_bookings to barber_profiles for the BarberGrid component
ALTER TABLE public.barber_profiles 
ADD COLUMN average_rating DECIMAL(3,2),
ADD COLUMN total_bookings INTEGER DEFAULT 0;
