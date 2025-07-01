
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { useState } from "react";

interface UserProfileTabProps {
  user: any;
  profile: any;
  profileLoading: boolean;
  updateProfile: (data: any) => Promise<boolean>;
  refetchProfile: () => void;
}

export const UserProfileTab = ({ 
  user, 
  profile, 
  profileLoading, 
  updateProfile, 
  refetchProfile 
}: UserProfileTabProps) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleProfileSave = async () => {
    const success = await updateProfile(profileForm);
    if (success) {
      setEditingProfile(false);
    }
  };

  const handleImageUpdate = (url: string | null) => {
    refetchProfile();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfilePictureUpload
            currentImageUrl={profile?.profile_picture_url}
            onImageUpdate={handleImageUpdate}
            userType="user"
            userId={user?.id || ''}
          />
        </CardContent>
      </Card>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <div className="text-green-300/60">Loading profile...</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-400">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-black/50 border-green-500/50 text-green-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-green-400">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                      disabled={!editingProfile}
                      className="bg-black/50 border-green-500/50 text-green-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-green-400">Phone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editingProfile}
                      className="bg-black/50 border-green-500/50 text-green-300"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                {editingProfile ? (
                  <>
                    <Button 
                      onClick={handleProfileSave}
                      className="bg-green-500 hover:bg-green-600 text-black"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileForm({
                          full_name: profile?.full_name || '',
                          phone: profile?.phone || '',
                        });
                      }}
                      variant="outline"
                      className="border-gray-500 text-gray-400"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setEditingProfile(true)}
                    className="bg-green-500 hover:bg-green-600 text-black"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
