-- Live Booking Queue System
CREATE TABLE public.booking_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  service_type TEXT NOT NULL,
  estimated_wait_time INTEGER NOT NULL DEFAULT 30,
  queue_position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Instant Messaging Hub
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(barber_id, client_id)
);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.typing_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_typing BOOLEAN NOT NULL DEFAULT false,
  last_typed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Live Barber Status Tracker
CREATE TABLE public.barber_live_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'break', 'traveling', 'offline')),
  current_client TEXT,
  estimated_finish_time TIMESTAMP WITH TIME ZONE,
  last_location_lat NUMERIC,
  last_location_lng NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Dynamic Pricing System
CREATE TABLE public.dynamic_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  base_price INTEGER NOT NULL,
  surge_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  demand_level TEXT NOT NULL DEFAULT 'normal' CHECK (demand_level IN ('low', 'normal', 'high', 'peak')),
  effective_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Live Location Tracking
CREATE TABLE public.barber_live_location (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE UNIQUE,
  current_lat NUMERIC NOT NULL,
  current_lng NUMERIC NOT NULL,
  destination_lat NUMERIC,
  destination_lng NUMERIC,
  eta_minutes INTEGER,
  is_en_route BOOLEAN NOT NULL DEFAULT false,
  client_id UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-Time Analytics
CREATE TABLE public.real_time_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('daily_earnings', 'weekly_bookings', 'rating_change', 'queue_length')),
  metric_value NUMERIC NOT NULL,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  hour_recorded INTEGER NOT NULL DEFAULT EXTRACT(hour FROM now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Emergency Broadcasts
CREATE TABLE public.emergency_broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  broadcast_type TEXT NOT NULL CHECK (broadcast_type IN ('cancellation', 'delay', 'emergency', 'weather', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  affected_area TEXT,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Live Competition Tracker
CREATE TABLE public.nearby_barber_tracker (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area_name TEXT NOT NULL,
  barber_id UUID REFERENCES barber_profiles(id) ON DELETE CASCADE,
  distance_km NUMERIC NOT NULL,
  current_queue_length INTEGER NOT NULL DEFAULT 0,
  average_wait_time INTEGER NOT NULL DEFAULT 30,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(area_name, barber_id)
);

-- Enable Row Level Security
ALTER TABLE public.booking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barber_live_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barber_live_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nearby_barber_tracker ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Booking Queue
CREATE POLICY "Barbers can manage their queue" ON public.booking_queue
  FOR ALL USING (barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Everyone can view queue" ON public.booking_queue
  FOR SELECT USING (true);

-- RLS Policies for Chat
CREATE POLICY "Users can view their conversations" ON public.chat_conversations
  FOR SELECT USING (client_id = auth.uid() OR barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (client_id = auth.uid() OR barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their messages" ON public.chat_messages
  FOR SELECT USING (conversation_id IN (SELECT id FROM chat_conversations WHERE client_id = auth.uid() OR barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their messages" ON public.chat_messages
  FOR UPDATE USING (sender_id = auth.uid());

-- RLS Policies for Typing Indicators
CREATE POLICY "Users can view typing in their conversations" ON public.typing_indicators
  FOR SELECT USING (conversation_id IN (SELECT id FROM chat_conversations WHERE client_id = auth.uid() OR barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can update their typing status" ON public.typing_indicators
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for Barber Status
CREATE POLICY "Everyone can view barber status" ON public.barber_live_status
  FOR SELECT USING (true);

CREATE POLICY "Barbers can update their status" ON public.barber_live_status
  FOR ALL USING (barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid()));

-- RLS Policies for Dynamic Pricing
CREATE POLICY "Everyone can view pricing" ON public.dynamic_pricing
  FOR SELECT USING (true);

CREATE POLICY "Barbers can manage their pricing" ON public.dynamic_pricing
  FOR ALL USING (barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid()));

-- RLS Policies for Location Tracking
CREATE POLICY "Clients can view their barber location" ON public.barber_live_location
  FOR SELECT USING (client_id = auth.uid() OR barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Barbers can update their location" ON public.barber_live_location
  FOR ALL USING (barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid()));

-- RLS Policies for Analytics
CREATE POLICY "Barbers can view their analytics" ON public.real_time_analytics
  FOR SELECT USING (barber_id IN (SELECT id FROM barber_profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can insert analytics" ON public.real_time_analytics
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Emergency Broadcasts
CREATE POLICY "Everyone can view active broadcasts" ON public.emergency_broadcasts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authorized users can create broadcasts" ON public.emergency_broadcasts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for Competition Tracker
CREATE POLICY "Everyone can view nearby barbers" ON public.nearby_barber_tracker
  FOR SELECT USING (true);

CREATE POLICY "System can update tracker" ON public.nearby_barber_tracker
  FOR ALL USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_booking_queue_updated_at
  BEFORE UPDATE ON public.booking_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_barber_live_status_updated_at
  BEFORE UPDATE ON public.barber_live_status
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_dynamic_pricing_updated_at
  BEFORE UPDATE ON public.dynamic_pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_barber_live_location_updated_at
  BEFORE UPDATE ON public.barber_live_location
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for all tables
ALTER TABLE public.booking_queue REPLICA IDENTITY FULL;
ALTER TABLE public.chat_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.typing_indicators REPLICA IDENTITY FULL;
ALTER TABLE public.barber_live_status REPLICA IDENTITY FULL;
ALTER TABLE public.dynamic_pricing REPLICA IDENTITY FULL;
ALTER TABLE public.barber_live_location REPLICA IDENTITY FULL;
ALTER TABLE public.real_time_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.emergency_broadcasts REPLICA IDENTITY FULL;
ALTER TABLE public.nearby_barber_tracker REPLICA IDENTITY FULL;