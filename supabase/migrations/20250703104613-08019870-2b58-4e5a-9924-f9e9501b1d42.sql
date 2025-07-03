
-- Create reviews table for the Review & Rating System
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  barber_id UUID REFERENCES public.barber_profiles(id) NOT NULL,
  booking_id UUID REFERENCES public.bookings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[], -- Array of photo URLs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create photo_gallery table for barber portfolios
CREATE TABLE public.photo_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID REFERENCES public.barber_profiles(id) NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  category TEXT, -- 'before', 'after', 'general'
  is_before_after BOOLEAN DEFAULT false,
  before_photo_id UUID REFERENCES public.photo_gallery(id), -- Link to before photo if this is an after photo
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointment_reminders table
CREATE TABLE public.appointment_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) NOT NULL,
  reminder_type TEXT NOT NULL, -- 'sms', 'email', 'push'
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create push_notifications table
CREATE TABLE public.push_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'booking', 'reminder', 'message', 'payment'
  data JSONB, -- Additional data for the notification
  read_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voice_chat_sessions table for Voice Chat Integration
CREATE TABLE public.voice_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  barber_id UUID REFERENCES public.barber_profiles(id),
  session_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'ended'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Add location columns to barber_profiles if not already present
ALTER TABLE public.barber_profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add language preference to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Add analytics columns to barber_profiles
ALTER TABLE public.barber_profiles 
ADD COLUMN IF NOT EXISTS total_revenue DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_bookings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0;

-- Enable Row Level Security on new tables
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Users can view all reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for photo_gallery
CREATE POLICY "Everyone can view photo gallery" ON public.photo_gallery FOR SELECT USING (true);
CREATE POLICY "Barbers can manage their own photos" ON public.photo_gallery FOR ALL 
  USING (barber_id IN (SELECT id FROM public.barber_profiles WHERE user_id = auth.uid()));

-- RLS Policies for appointment_reminders
CREATE POLICY "Users can view their appointment reminders" ON public.appointment_reminders FOR SELECT 
  USING (booking_id IN (SELECT id FROM public.bookings WHERE user_id = auth.uid() OR barber_id IN (SELECT id FROM public.barber_profiles WHERE user_id = auth.uid())));
CREATE POLICY "System can manage reminders" ON public.appointment_reminders FOR ALL USING (true);

-- RLS Policies for push_notifications
CREATE POLICY "Users can view their own notifications" ON public.push_notifications FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.push_notifications FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.push_notifications FOR INSERT WITH CHECK (true);

-- RLS Policies for voice_chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON public.voice_chat_sessions FOR SELECT 
  USING (auth.uid() = user_id OR barber_id IN (SELECT id FROM public.barber_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create chat sessions" ON public.voice_chat_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON public.voice_chat_sessions FOR UPDATE 
  USING (auth.uid() = user_id OR barber_id IN (SELECT id FROM public.barber_profiles WHERE user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_reviews_barber_id ON public.reviews(barber_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_photo_gallery_barber_id ON public.photo_gallery(barber_id);
CREATE INDEX idx_appointment_reminders_booking_id ON public.appointment_reminders(booking_id);
CREATE INDEX idx_appointment_reminders_reminder_time ON public.appointment_reminders(reminder_time);
CREATE INDEX idx_push_notifications_user_id ON public.push_notifications(user_id);
CREATE INDEX idx_voice_chat_sessions_user_id ON public.voice_chat_sessions(user_id);
CREATE INDEX idx_barber_profiles_location ON public.barber_profiles(latitude, longitude);

-- Create function to update barber analytics
CREATE OR REPLACE FUNCTION update_barber_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update analytics when a booking is completed or a review is added
  IF TG_TABLE_NAME = 'bookings' AND NEW.status = 'completed' THEN
    UPDATE public.barber_profiles 
    SET total_bookings = total_bookings + 1
    WHERE id = NEW.barber_id;
  ELSIF TG_TABLE_NAME = 'reviews' THEN
    UPDATE public.barber_profiles 
    SET average_rating = (
      SELECT AVG(rating) 
      FROM public.reviews 
      WHERE barber_id = NEW.barber_id
    )
    WHERE id = NEW.barber_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for analytics updates
CREATE TRIGGER update_barber_analytics_on_booking
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION update_barber_analytics();

CREATE TRIGGER update_barber_analytics_on_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_barber_analytics();
