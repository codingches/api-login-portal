
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Phone, Star } from "lucide-react";
import { useState } from "react";
import { ReviewForm } from "@/components/reviews/ReviewForm";

interface UserBookingsTabProps {
  bookings: any[];
  onRefreshBookings: () => void;
}

export const UserBookingsTab = ({ bookings, onRefreshBookings }: UserBookingsTabProps) => {
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(null);
    onRefreshBookings();
  };

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 font-mono">My Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id}>
                <div className="border border-green-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-green-400 font-bold text-lg">
                        {booking.barber_profiles.business_name}
                      </h3>
                      <p className="text-green-300/80 font-mono text-sm">
                        {booking.service_type}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-green-300 font-mono text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-green-300 font-mono text-sm">
                      <Clock className="h-4 w-4" />
                      {booking.booking_time}
                    </div>
                    <div className="flex items-center gap-2 text-green-300 font-mono text-sm">
                      <MapPin className="h-4 w-4" />
                      {booking.barber_profiles.location}
                    </div>
                    <div className="flex items-center gap-2 text-green-300 font-mono text-sm">
                      <Phone className="h-4 w-4" />
                      {booking.barber_profiles.phone}
                    </div>
                  </div>

                  {booking.status === 'completed' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowReviewForm(showReviewForm === booking.id ? null : booking.id)}
                        className="bg-green-500 hover:bg-green-600 text-black font-mono"
                        size="sm"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Leave Review
                      </Button>
                    </div>
                  )}
                </div>

                {showReviewForm === booking.id && (
                  <div className="mt-4">
                    <ReviewForm
                      barberId={booking.barber_id}
                      bookingId={booking.id}
                      onReviewSubmitted={handleReviewSubmitted}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-300/60 text-center py-8">
            No bookings yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};
