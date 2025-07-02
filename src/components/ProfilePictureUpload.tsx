
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

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
      console.log('=== UPLOAD PROCESS STARTED ===');
      console.log('User ID:', userId);
      console.log('User Type:', userType);
      console.log('Current Image URL:', currentImageUrl);

      if (!event.target.files || event.target.files.length === 0) {
        console.log('No file selected');
        toast({
          title: "No file selected",
          description: "Please select an image file to upload.",
          variant: "destructive",
        });
        return;
      }

      const file = event.target.files[0];
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.log('Invalid file type:', file.type);
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPG, PNG, GIF, etc.).",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log('File too large:', file.size);
        toast({
          title: "File too large",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Show progress toast
      toast({
        title: "Uploading...",
        description: "Please wait while we upload your profile picture.",
      });

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('Upload path:', filePath);

      // Remove old image if exists
      if (currentImageUrl) {
        try {
          const urlParts = currentImageUrl.split('/');
          const oldFileName = urlParts[urlParts.length - 1];
          const oldFilePath = `${userId}/${oldFileName}`;
          console.log('Attempting to remove old image:', oldFilePath);
          
          const { error: deleteError } = await supabase.storage
            .from('profile-pictures')
            .remove([oldFilePath]);
          
          if (deleteError) {
            console.log('Error removing old image (continuing anyway):', deleteError);
          } else {
            console.log('Old image removed successfully');
          }
        } catch (deleteError) {
          console.log('Error in delete process (continuing anyway):', deleteError);
        }
      }

      // Upload new image
      console.log('Starting file upload...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      console.log('Generated public URL:', imageUrl);

      // Test if the URL is accessible
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        console.log('URL accessibility test:', response.status, response.statusText);
      } catch (urlError) {
        console.log('URL test failed (continuing anyway):', urlError);
      }

      // Update the user's profile with the new image URL
      console.log('Updating database...');
      if (userType === 'barber') {
        console.log('Updating barber profile...');
        const { error: dbError } = await supabase
          .from('barber_profiles')
          .update({ 
            profile_picture_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (dbError) {
          console.error('Database update error (barber):', dbError);
          throw new Error(`Database update failed: ${dbError.message}`);
        }
        console.log('Barber profile updated successfully');
      } else {
        console.log('Updating user profile...');
        const { error: dbError } = await supabase
          .from('user_profiles')
          .upsert({ 
            user_id: userId,
            profile_picture_url: imageUrl,
            updated_at: new Date().toISOString()
          });
        
        if (dbError) {
          console.error('Database update error (user):', dbError);
          throw new Error(`Database update failed: ${dbError.message}`);
        }
        console.log('User profile updated successfully');
      }

      console.log('Calling onImageUpdate with URL:', imageUrl);
      onImageUpdate(imageUrl);
      
      toast({
        title: "Success!",
        description: "Profile picture updated successfully!",
      });

      // Clear the input
      event.target.value = '';
      console.log('=== UPLOAD PROCESS COMPLETED SUCCESSFULLY ===');

    } catch (error: any) {
      console.error('=== UPLOAD PROCESS FAILED ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      setUploading(true);
      console.log('=== REMOVE PROCESS STARTED ===');

      // Remove from storage if exists
      if (currentImageUrl) {
        const urlParts = currentImageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${userId}/${fileName}`;
        console.log('Removing file from storage:', filePath);
        
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove([filePath]);
          
        if (deleteError) {
          console.log('Storage delete error (continuing):', deleteError);
        }
      }

      // Remove from database
      if (userType === 'barber') {
        const { error } = await supabase
          .from('barber_profiles')
          .update({ 
            profile_picture_url: null,
            updated_at: new Date().toISOString()
          })
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
      console.log('=== REMOVE PROCESS COMPLETED ===');
    } catch (error: any) {
      console.error('=== REMOVE PROCESS FAILED ===');
      console.error('Remove error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    console.log('Upload button clicked');
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
    if (fileInput) {
      console.log('File input found, triggering click');
      fileInput.click();
    } else {
      console.error('File input not found!');
      toast({
        title: "Error",
        description: "File input not found. Please refresh the page and try again.",
        variant: "destructive",
      });
    }
  };

  console.log('ProfilePictureUpload render:', {
    currentImageUrl,
    userType,
    userId,
    uploading
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24 border-2 border-green-500/30">
        <AvatarImage src={currentImageUrl || undefined} alt="Profile" />
        <AvatarFallback className="bg-black text-green-400 text-xl">
          {userType === 'barber' ? 'B' : 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          disabled={uploading}
          onClick={handleButtonClick}
          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
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
      
      {uploading && (
        <div className="text-green-400 text-sm font-mono">
          Processing your image...
        </div>
      )}
    </div>
  );
};
