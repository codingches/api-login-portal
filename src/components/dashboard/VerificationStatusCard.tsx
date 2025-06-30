
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Shield } from "lucide-react";

interface VerificationStatusCardProps {
  barberProfile: any;
}

export const VerificationStatusCard = ({ barberProfile }: VerificationStatusCardProps) => {
  return (
    <Card className="bg-black border-green-500/30 mb-6">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {barberProfile.is_verified ? (
          <div className="flex items-center gap-3 text-green-400">
            <Shield className="h-6 w-6" />
            <div>
              <div className="font-semibold">Verified Barber</div>
              <div className="text-green-300/80 text-sm">
                Your profile has been verified and displays a trust badge
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-green-300/80">
              Get verified to build trust with potential clients and stand out from other barbers.
            </div>
            <VerificationBadge 
              barberId={barberProfile.id}
              isVerified={false}
              isOwner={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
