
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

interface DashboardHeaderProps {
  barberProfile: any;
  onSignOut: () => void;
}

export const DashboardHeader = ({ barberProfile, onSignOut }: DashboardHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-green-400">
            [BARBER_DASHBOARD]
          </h1>
          <VerificationBadge 
            barberId={barberProfile.id}
            isVerified={barberProfile.is_verified || false}
            isOwner={true}
          />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button 
              variant="outline" 
              className="border-green-500 text-green-400 hover:bg-green-500/20"
            >
              <Home className="mr-2 h-4 w-4" />
              HOME
            </Button>
          </Link>
          <Button 
            onClick={onSignOut}
            variant="outline" 
            className="border-red-500 text-red-400 hover:bg-red-500/20"
          >
            LOGOUT
          </Button>
        </div>
      </div>

      <div className="text-green-300 mb-8">
        {barberProfile.business_name} - {barberProfile.location}
      </div>
    </motion.div>
  );
};
