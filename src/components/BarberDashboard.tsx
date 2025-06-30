import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Star, DollarSign, Users, TrendingUp, Shield, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBarberData } from "@/hooks/useBarberData";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Link } from "react-router-dom";
import { BankConnectionForm } from "@/components/BankConnectionForm";
import { ClientSuggestions } from "@/components/ClientSuggestions";
import { RealTimePayments } from "@/components/RealTimePayments";

export const BarberDashboard = () => {
  const { user, signOut } = useAuth();
  const { barberProfile, services, availability, bookings, loading } = useBarberData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-xl">[LOADING_BARBER_DASHBOARD...]</div>
      </div>
    );
  }

  if (!barberProfile) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-xl">No barber profile found</div>
      </div>
    );
  }

  const totalEarnings = bookings?.filter((b: any) => b.status === 'completed').length * 35 || 0;
  const pendingBookings = bookings?.filter((b: any) => b.status === 'pending').length || 0;
  const completedBookings = bookings?.filter((b: any) => b.status === 'completed').length || 0;

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="container mx-auto max-w-6xl">
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
                onClick={signOut}
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black border border-green-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-green-500/20">
              Payments
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-green-500/20">
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-green-500/20">
              Services
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-green-500/20">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="availability" className="data-[state=active]:bg-green-500/20">
              Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
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
                        {services?.length || 0}
                      </div>
                      <div className="text-green-300/80 text-sm">Active Services</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Verification Status Card */}
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
          </TabsContent>

          <TabsContent value="payments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BankConnectionForm 
                barberProfile={barberProfile}
                onSuccess={() => window.location.reload()}
              />
              <RealTimePayments barberId={barberProfile.id} />
            </div>
          </TabsContent>

          <TabsContent value="suggestions">
            <ClientSuggestions barberId={barberProfile.id} />
          </TabsContent>

          <TabsContent value="services">
            <div>Services Content</div>
          </TabsContent>

          <TabsContent value="bookings">
            <div>Bookings Content</div>
          </TabsContent>

          <TabsContent value="availability">
            <div>Availability Content</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
