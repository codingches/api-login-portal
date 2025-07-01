
-- Update storage policies to ensure proper access for profile picture uploads
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;

-- Create more permissive policies for profile picture uploads
CREATE POLICY "Users can upload profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-pictures' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-pictures' AND
  auth.uid() IS NOT NULL
);
