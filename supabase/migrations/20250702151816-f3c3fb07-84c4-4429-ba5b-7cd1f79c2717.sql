
-- Create a table for feedback messages in the chatroom
CREATE TABLE public.feedback_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'barber')),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.feedback_messages ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to read feedback messages (public chatroom)
CREATE POLICY "Everyone can view feedback messages" 
  ON public.feedback_messages 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to insert messages
CREATE POLICY "Authenticated users can create feedback messages" 
  ON public.feedback_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own messages
CREATE POLICY "Users can update their own feedback messages" 
  ON public.feedback_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own messages
CREATE POLICY "Users can delete their own feedback messages" 
  ON public.feedback_messages 
  FOR DELETE 
  USING (auth.uid() = user_id);
