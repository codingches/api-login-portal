
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";

interface UserProfileTabProps {
  user: any;
  profile: any;
  profileLoading: boolean;
  updateProfile: (updates: any) => Promise<void>;
  refetchProfile: () => Promise<void>;
}

export const UserProfileTab = ({ 
  user, 
  profile, 
  profileLoading, 
  updateProfile, 
  refetchProfile 
}: UserProfileTabProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      await updateProfile(formData);
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="text-green-400 font-mono text-center py-8">
        [LOADING_PROFILE...]
      </div>
    );
  }

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 font-mono">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <ProfilePictureUpload
            currentImageUrl={profile?.profile_picture_url}
            onUploadComplete={refetchProfile}
            userId={user?.id}
          />
          <div className="text-center">
            <p className="text-green-400 font-mono">{user?.email}</p>
            <p className="text-green-300/60 text-sm">Email address</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name" className="text-green-300 font-mono">
              Full Name
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="bg-black border-green-500/30 text-green-300 font-mono"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-green-300 font-mono">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-black border-green-500/30 text-green-300 font-mono"
              placeholder="Enter your phone number"
            />
          </div>

          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-mono"
          >
            {isUpdating ? '[UPDATING...]' : '[UPDATE_PROFILE]'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
