
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

interface ProfilePictureUploadProps {
  currentImageUrl?: string | null;
  onImageUpdate: (url: string | null) => void;
  userType: 'barber' | 'user';
  userId: string;
}

export const ProfilePictureUpload = ({ 
  currentImageUrl, 
  onImageUpdate, 
  userType, 
  userId 
}: ProfilePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      console.log('Starting image upload...');

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      console.log('File selected:', file.name, file.size, file.type);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB.');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Remove old image if exists
      if (currentImageUrl) {
        const oldPath = currentImageUrl.split('/').pop();
        if (oldPath) {
          const oldFilePath = `${userId}/${oldPath}`;
          console.log('Removing old image:', oldFilePath);
          await supabase.storage
            .from('profile-pictures')
            .remove([oldFilePath]);
        }
      }

      // Upload new image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      console.log('Public URL:', imageUrl);

      // Update the user's profile with the new image URL
      if (userType === 'barber') {
        console.log('Updating barber profile...');
        const { error } = await supabase
          .from('barber_profiles')
          .update({ profile_picture_url: imageUrl })
          .eq('user_id', userId);
        
        if (error) {
          console.error('Database update error (barber):', error);
          throw error;
        }
        console.log('Barber profile updated successfully');
      } else {
        console.log('Updating user profile...');
        const { error } = await supabase
          .from('user_profiles')
          .upsert({ 
            user_id: userId,
            profile_picture_url: imageUrl,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('Database update error (user):', error);
          throw error;
        }
        console.log('User profile updated successfully');
      }

      onImageUpdate(imageUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });

      // Clear the input
      event.target.value = '';
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      setUploading(true);
      console.log('Removing profile picture...');

      // Remove from storage if exists
      if (currentImageUrl) {
        const fileName = currentImageUrl.split('/').pop();
        if (fileName) {
          const filePath = `${userId}/${fileName}`;
          console.log('Removing file from storage:', filePath);
          await supabase.storage
            .from('profile-pictures')
            .remove([filePath]);
        }
      }

      // Remove from database
      if (userType === 'barber') {
        const { error } = await supabase
          .from('barber_profiles')
          .update({ profile_picture_url: null })
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({ 
            user_id: userId,
            profile_picture_url: null,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }

      onImageUpdate(null);
      toast({
        title: "Success",
        description: "Profile picture removed successfully!",
      });
    } catch (error: any) {
      console.error('Profile picture removal error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24 border-2 border-green-500/30">
        <AvatarImage src={currentImageUrl || undefined} alt="Profile" />
        <AvatarFallback className="bg-black text-green-400 text-xl">
          {userType === 'barber' ? 'B' : 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex gap-2">
        <Label htmlFor="avatar-upload" className="cursor-pointer">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            disabled={uploading}
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
          />
        </Label>
        
        {currentImageUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeImage}
            disabled={uploading}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
