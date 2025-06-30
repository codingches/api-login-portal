
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

export const ProfileSettings = () => {
  const { user } = useAuth();
  const { userProfile, refetchProfile } = useUserProfile();

  const handleImageUpdate = (url: string | null) => {
    // The ProfilePictureUpload component handles the database update,
    // so we just need to refresh the profile data
    refetchProfile();
  };

  if (!user) {
    return (
      <div className="text-center text-green-400 font-mono">
        Please log in to access profile settings
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono">
            [PROFILE_PICTURE]
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProfilePictureUpload
            currentImageUrl={userProfile?.profile_picture_url}
            onImageUpdate={handleImageUpdate}
            userType="user"
            userId={user.id}
          />
        </CardContent>
      </Card>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono">
            [ACCOUNT_ACTIONS]
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  );
};
