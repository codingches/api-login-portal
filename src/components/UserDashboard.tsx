
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Star, User, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useUserProfile();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  // Fetch user's bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          barber_profiles!inner(business_name, location, phone)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch user's reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['user-reviews', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          barber_profiles!inner(business_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleProfileSave = async () => {
    const success = await updateProfile(profileForm);
    if (success) {
      setEditingProfile(false);
    }
  };

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
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-400">
              [USER_DASHBOARD]
            </h1>
            <Button 
              onClick={signOut}
              variant="outline" 
              className="border-red-500 text-red-400 hover:bg-red-500/20"
            >
              LOGOUT
            </Button>
          </div>

          <div className="text-green-300 mb-8">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black border border-green-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-green-500/20">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-green-500/20">
              My Reviews
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-500/20">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
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
          </TabsContent>

          <TabsContent value="bookings">
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
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="bg-black border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">My Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-green-300/60">Loading reviews...</div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border border-green-500/30 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-green-400 font-bold">{review.barber_profiles.business_name}</h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        
                        {review.comment && (
                          <p className="text-green-300/80 mb-2">{review.comment}</p>
                        )}
                        
                        <div className="text-green-300/60 text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-green-300/60">No reviews yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-black border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="text-green-300/60">Loading profile...</div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-green-400">Email</Label>
                          <Input
                            id="email"
                            value={user?.email || ''}
                            disabled
                            className="bg-black/50 border-green-500/50 text-green-300"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="full_name" className="text-green-400">Full Name</Label>
                          <Input
                            id="full_name"
                            value={profileForm.full_name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                            disabled={!editingProfile}
                            className="bg-black/50 border-green-500/50 text-green-300"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-green-400">Phone</Label>
                          <Input
                            id="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!editingProfile}
                            className="bg-black/50 border-green-500/50 text-green-300"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      {editingProfile ? (
                        <>
                          <Button 
                            onClick={handleProfileSave}
                            className="bg-green-500 hover:bg-green-600 text-black"
                          >
                            Save Changes
                          </Button>
                          <Button 
                            onClick={() => {
                              setEditingProfile(false);
                              setProfileForm({
                                full_name: profile?.full_name || '',
                                phone: profile?.phone || '',
                              });
                            }}
                            variant="outline"
                            className="border-gray-500 text-gray-400"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => setEditingProfile(true)}
                          className="bg-green-500 hover:bg-green-600 text-black"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
