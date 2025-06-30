
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";
import { LogOut, User, Settings } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  barberProfile: any;
  onSignOut: () => void;
}

export const DashboardHeader = ({ barberProfile, onSignOut }: DashboardHeaderProps) => {
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(barberProfile?.profile_picture_url);

  const handleAccountDeleted = () => {
    onSignOut();
    window.location.href = '/';
  };

  return (
    <Card className="bg-black border-green-500/30 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-green-500/30 cursor-pointer"
                      onClick={() => setShowProfileUpload(!showProfileUpload)}>
                <AvatarImage src={profilePictureUrl || undefined} alt="Profile" />
                <AvatarFallback className="bg-black text-green-400 text-xl">
                  {barberProfile?.business_name?.[0] || 'B'}
                </AvatarFallback>
              </Avatar>
              {showProfileUpload && (
                <div className="absolute top-20 left-0 z-10 bg-black border border-green-500/30 rounded-lg p-4 min-w-[300px]">
                  <ProfilePictureUpload
                    currentImageUrl={profilePictureUrl}
                    onImageUpdate={setProfilePictureUrl}
                    userType="barber"
                    userId={barberProfile?.user_id}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProfileUpload(false)}
                    className="mt-3 w-full border-green-500/30 text-green-400"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-400">
                {barberProfile?.business_name || 'Barber Dashboard'}
              </h1>
              <p className="text-green-300/80">
                {barberProfile?.location} • {barberProfile?.specialty}
              </p>
              <p className="text-green-300/60 text-sm">
                Status: {barberProfile?.status?.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfileUpload(!showProfileUpload)}
              className="border-green-500/30 text-green-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </Button>
            
            <DeleteAccountDialog onAccountDeleted={handleAccountDeleted} />
            
            <Button
              variant="outline"
              onClick={onSignOut}
              className="border-green-500/30 text-green-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
