
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

interface UserDashboardHeaderProps {
  user: any;
  signOut: () => void;
}

export const UserDashboardHeader = ({ user, signOut }: UserDashboardHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-green-400">
            [USER_DASHBOARD]
          </h1>
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
            onClick={signOut}
            variant="outline" 
            className="border-red-500 text-red-400 hover:bg-red-500/20"
          >
            LOGOUT
          </Button>
        </div>
      </div>

      <div className="text-green-300 mb-8">
        Welcome back, {user?.user_metadata?.full_name || user?.email}
      </div>
    </motion.div>
  );
};
