
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star, Clock, TrendingUp } from "lucide-react";

interface UserOverviewTabProps {
  bookings: any[];
  reviews: any[];
  bookingsLoading: boolean;
}

export const UserOverviewTab = ({ bookings, reviews, bookingsLoading }: UserOverviewTabProps) => {
  const upcomingBookings = bookings?.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.booking_date) > new Date()
  ) || [];

  const completedBookings = bookings?.filter(booking => booking.status === 'completed') || [];
  const averageRating = reviews?.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (bookingsLoading) {
    return (
      <div className="text-green-400 font-mono text-center py-8">
        [LOADING_OVERVIEW...]
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-400">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 font-mono">
              {bookings?.length || 0}
            </div>
            <p className="text-xs text-green-300/60">
              {completedBookings.length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-400">
              Reviews Given
            </CardTitle>
            <Star className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 font-mono">
              {reviews?.length || 0}
            </div>
            <p className="text-xs text-green-300/60">
              Avg rating: {averageRating}/5
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-400">
              Upcoming
            </CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 font-mono">
              {upcomingBookings.length}
            </div>
            <p className="text-xs text-green-300/60">
              Next appointments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border border-green-500/20 rounded-lg">
                  <div>
                    <h4 className="text-green-400 font-mono font-bold">
                      {booking.barber_profiles.business_name}
                    </h4>
                    <p className="text-green-300/80 text-sm">
                      {booking.service_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-mono text-sm">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </p>
                    <p className="text-green-300/60 text-sm">
                      {booking.booking_time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-green-300/60 text-center py-8">
              No upcoming appointments
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
