
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ProfileTabProps {
  barberProfile: any;
  onRefreshData: () => void;
}

export const ProfileTab = ({ barberProfile, onRefreshData }: ProfileTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    business_name: barberProfile?.business_name || '',
    location: barberProfile?.location || '',
    specialty: barberProfile?.specialty || '',
    pricing: barberProfile?.pricing || '',
    phone: barberProfile?.phone || '',
    x_handle: barberProfile?.x_handle || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!user || !barberProfile) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('barber_profiles')
        .update(formData)
        .eq('id', barberProfile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      onRefreshData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpdate = (url: string | null) => {
    console.log('Profile picture updated:', url);
    // The ProfilePictureUpload component handles the database update,
    // so we just need to refresh the data
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono flex items-center gap-2">
            [PROFILE_PICTURE]
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfilePictureUpload
            currentImageUrl={barberProfile?.profile_picture_url}
            onImageUpdate={handleImageUpdate}
            userType="barber"
            userId={user?.id || ''}
          />
        </CardContent>
      </Card>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono flex items-center gap-2">
            [BUSINESS_INFORMATION]
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name" className="text-green-300 font-mono">
                Business Name
              </Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                className="bg-black border-green-500/30 text-green-300 font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="text-green-300 font-mono">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-black border-green-500/30 text-green-300 font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-green-300 font-mono">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-black border-green-500/30 text-green-300 font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="x_handle" className="text-green-300 font-mono">
                X Handle (Optional)
              </Label>
              <Input
                id="x_handle"
                value={formData.x_handle}
                onChange={(e) => handleInputChange('x_handle', e.target.value)}
                placeholder="@username"
                className="bg-black border-green-500/30 text-green-300 font-mono"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialty" className="text-green-300 font-mono">
              Specialty
            </Label>
            <Textarea
              id="specialty"
              value={formData.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
              className="bg-black border-green-500/30 text-green-300 font-mono"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="pricing" className="text-green-300 font-mono">
              Pricing Information
            </Label>
            <Textarea
              id="pricing"
              value={formData.pricing}
              onChange={(e) => handleInputChange('pricing', e.target.value)}
              className="bg-black border-green-500/30 text-green-300 font-mono"
              rows={3}
            />
          </div>

          <Button
            onClick={handleUpdateProfile}
            disabled={isUpdating}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-mono"
          >
            {isUpdating ? '[UPDATING...]' : '[UPDATE_PROFILE]'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
