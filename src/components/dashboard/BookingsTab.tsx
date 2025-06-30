
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, User, Search, Filter } from "lucide-react";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";

interface Booking {
  id: string;
  user_id: string;
  booking_date: string;
  booking_time: string;
  service_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BookingsTabProps {
  bookings: Booking[];
  onRefreshBookings: () => void;
}

export const BookingsTab = ({ bookings, onRefreshBookings }: BookingsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingBookings(prev => new Set(prev).add(bookingId));
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}`,
      });
      
      onRefreshBookings();
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    } finally {
      setUpdatingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'border-green-500/30 text-green-400';
      case 'completed':
        return 'border-blue-500/30 text-blue-400';
      case 'cancelled':
        return 'border-red-500/30 text-red-400';
      default:
        return 'border-yellow-500/30 text-yellow-400';
    }
  };

  const getDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMM d, yyyy');
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groupedBookings = filteredBookings.reduce((groups, booking) => {
    const date = booking.booking_date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(booking);
    return groups;
  }, {} as Record<string, Booking[]>);

  const sortedDates = Object.keys(groupedBookings).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <CalendarDays className="h-6 w-6" />
          Bookings Management
        </h2>
        <Button
          onClick={onRefreshBookings}
          variant="outline"
          className="border-green-500/30 text-green-400"
        >
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-green-300">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                <Input
                  placeholder="Search by service or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black border-green-500/30 text-green-400 pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-green-300">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-black border-green-500/30 text-green-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-green-500/30">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings by Date */}
      {sortedDates.length === 0 ? (
        <Card className="bg-black border-green-500/30">
          <CardContent className="text-center py-8">
            <CalendarDays className="h-12 w-12 mx-auto text-green-400/50 mb-4" />
            <p className="text-green-300/60">
              {bookings.length === 0 ? "No bookings yet" : "No bookings match your filters"}
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map(date => (
          <Card key={date} className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">
                {getDateDisplay(date)} ({format(new Date(date), 'EEEE')})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupedBookings[date]
                  .sort((a, b) => a.booking_time.localeCompare(b.booking_time))
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className={`border rounded-lg p-4 ${getStatusColor(booking.status)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-semibold">{booking.booking_time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{booking.user_id.slice(0, 8)}...</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-green-300/80">Service: {booking.service_type}</p>
                        <p className="text-green-300/60 text-sm">
                          Booked: {format(new Date(booking.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>

                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                disabled={updatingBookings.has(booking.id)}
                                className="bg-green-500 hover:bg-green-600 text-black"
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                disabled={updatingBookings.has(booking.id)}
                                className="border-red-500/30 text-red-400"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                disabled={updatingBookings.has(booking.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                disabled={updatingBookings.has(booking.id)}
                                className="border-red-500/30 text-red-400"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
