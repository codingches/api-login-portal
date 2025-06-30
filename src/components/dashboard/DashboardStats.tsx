
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Clock, Users, Star } from "lucide-react";

interface DashboardStatsProps {
  totalEarnings: number;
  pendingBookings: number;
  completedBookings: number;
  servicesCount: number;
}

export const DashboardStats = ({ 
  totalEarnings, 
  pendingBookings, 
  completedBookings, 
  servicesCount 
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-black border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-green-400">
                ${totalEarnings}
              </div>
              <div className="text-green-300/80 text-sm">Total Earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {pendingBookings}
              </div>
              <div className="text-green-300/80 text-sm">Pending Bookings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {completedBookings}
              </div>
              <div className="text-green-300/80 text-sm">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {servicesCount}
              </div>
              <div className="text-green-300/80 text-sm">Active Services</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
