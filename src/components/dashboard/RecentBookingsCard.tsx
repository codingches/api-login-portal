
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentBookingsCardProps {
  bookings: any[];
}

export const RecentBookingsCard = ({ bookings }: RecentBookingsCardProps) => {
  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400">Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings && bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking: any) => (
              <div key={booking.id} className="flex justify-between items-center p-3 border border-green-500/20 rounded">
                <div>
                  <div className="text-green-400">{booking.user_id}</div>
                  <div className="text-green-300/80 text-sm">
                    {booking.booking_date} at {booking.booking_time}
                  </div>
                </div>
                <div className="text-yellow-400">[{booking.status.toUpperCase()}]</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-300/60">No recent bookings</div>
        )}
      </CardContent>
    </Card>
  );
};
