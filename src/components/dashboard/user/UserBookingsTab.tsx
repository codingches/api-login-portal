
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserBookingsTabProps {
  bookings: any[];
  bookingsLoading: boolean;
}

export const UserBookingsTab = ({ bookings, bookingsLoading }: UserBookingsTabProps) => {
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
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400">My Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {bookingsLoading ? (
          <div className="text-green-300/60">Loading bookings...</div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="border border-green-500/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-green-400 font-bold">{booking.barber_profiles.business_name}</h3>
                    <p className="text-green-300/80">{booking.barber_profiles.location}</p>
                  </div>
                  <div className={`font-mono ${getStatusColor(booking.status)}`}>
                    [{booking.status.toUpperCase()}]
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-green-300/60">Date</div>
                    <div className="text-green-300">{booking.booking_date}</div>
                  </div>
                  <div>
                    <div className="text-green-300/60">Time</div>
                    <div className="text-green-300">{booking.booking_time}</div>
                  </div>
                  <div>
                    <div className="text-green-300/60">Service</div>
                    <div className="text-green-300">{booking.service_type}</div>
                  </div>
                  <div>
                    <div className="text-green-300/60">Phone</div>
                    <div className="text-green-300">{booking.barber_profiles.phone}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-300/60">No bookings found</div>
        )}
      </CardContent>
    </Card>
  );
};
