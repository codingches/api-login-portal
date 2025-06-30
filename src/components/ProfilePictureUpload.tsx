
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

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      // Update the user's profile with the new image URL
      if (userType === 'barber') {
        const { error } = await supabase
          .from('barber_profiles')
          .update({ profile_picture_url: imageUrl })
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_profiles')
          .update({ profile_picture_url: imageUrl })
          .eq('user_id', userId);
        
        if (error) throw error;
      }

      onImageUpdate(imageUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      setUploading(true);

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
          .update({ profile_picture_url: null })
          .eq('user_id', userId);
        
        if (error) throw error;
      }

      onImageUpdate(null);
      toast({
        title: "Success",
        description: "Profile picture removed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
