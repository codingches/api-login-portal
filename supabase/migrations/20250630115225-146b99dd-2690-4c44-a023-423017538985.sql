
-- Create a storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true);

-- Create RLS policies for the profile pictures bucket
CREATE POLICY "Anyone can view profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add profile picture URL columns to existing tables
ALTER TABLE barber_profiles ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create a delete account function that handles cleanup
CREATE OR REPLACE FUNCTION delete_user_account(user_id_to_delete UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete user's profile pictures from storage
  DELETE FROM storage.objects 
  WHERE bucket_id = 'profile-pictures' 
  AND name LIKE user_id_to_delete::text || '/%';
  
  -- Delete related records (foreign key constraints should handle most of this)
  DELETE FROM barber_profiles WHERE user_id = user_id_to_delete;
  DELETE FROM user_profiles WHERE user_id = user_id_to_delete;
  DELETE FROM bookings WHERE user_id = user_id_to_delete OR barber_id IN (
    SELECT id FROM barber_profiles WHERE user_id = user_id_to_delete
  );
  DELETE FROM reviews WHERE user_id = user_id_to_delete OR barber_id IN (
    SELECT id FROM barber_profiles WHERE user_id = user_id_to_delete
  );
  DELETE FROM messages WHERE sender_id = user_id_to_delete OR recipient_id = user_id_to_delete;
  DELETE FROM notifications WHERE user_id = user_id_to_delete;
  DELETE FROM client_rewards WHERE user_id = user_id_to_delete;
  
  -- Finally delete the auth user (this should cascade to remaining related tables)
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Add escrow status to payments tables
ALTER TABLE real_time_payments ADD COLUMN IF NOT EXISTS escrow_status TEXT DEFAULT 'held';
ALTER TABLE real_time_payments ADD COLUMN IF NOT EXISTS escrow_released_at TIMESTAMP WITH TIME ZONE;

-- Create escrow management function
CREATE OR REPLACE FUNCTION release_escrow_payment(payment_id UUID, admin_user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update payment to release escrow
  UPDATE real_time_payments 
  SET 
    escrow_status = 'released',
    escrow_released_at = NOW(),
    updated_at = NOW()
  WHERE id = payment_id AND escrow_status = 'held';
  
  RETURN FOUND;
END;
$$;
