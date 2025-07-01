
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Star, CreditCard } from "lucide-react";

interface UserOverviewTabProps {
  bookings: any[];
  reviews: any[];
  bookingsLoading: boolean;
}

export const UserOverviewTab = ({ bookings, reviews, bookingsLoading }: UserOverviewTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {bookings?.length || 0}
                </div>
                <div className="text-green-300/80 text-sm">Total Bookings</div>
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
                  {bookings?.filter(b => b.status === 'confirmed').length || 0}
                </div>
                <div className="text-green-300/80 text-sm">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {reviews?.length || 0}
                </div>
                <div className="text-green-300/80 text-sm">Reviews Given</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  ${bookings?.filter(b => b.status === 'completed').length * 35 || 0}
                </div>
                <div className="text-green-300/80 text-sm">Total Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="text-green-300/60">Loading recent activity...</div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="flex justify-between items-center p-3 border border-green-500/20 rounded">
                  <div>
                    <div className="text-green-400">{booking.barber_profiles.business_name}</div>
                    <div className="text-green-300/80 text-sm">
                      {booking.booking_date} at {booking.booking_time}
                    </div>
                  </div>
                  <div className={`font-mono ${getStatusColor(booking.status)}`}>
                    [{booking.status.toUpperCase()}]
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-green-300/60">No recent activity</div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
