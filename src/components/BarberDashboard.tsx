
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Star, DollarSign, Users, Scissors, Plus, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBarberData } from "@/hooks/useBarberData";
import { useState } from "react";

export const BarberDashboard = () => {
  const { user, signOut } = useAuth();
  const { barberProfile, services, availability, bookings, loading, addService, updateService, setAvailabilityForDay } = useBarberData();
  
  const [showAddService, setShowAddService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    description: '',
    price: '',
    duration_minutes: '',
  });

  const [availabilityForm, setAvailabilityForm] = useState<{[key: number]: {start_time: string, end_time: string, is_available: boolean}}>({
    0: { start_time: '09:00', end_time: '17:00', is_available: true }, // Sunday
    1: { start_time: '09:00', end_time: '17:00', is_available: true }, // Monday
    2: { start_time: '09:00', end_time: '17:00', is_available: true }, // Tuesday
    3: { start_time: '09:00', end_time: '17:00', is_available: true }, // Wednesday
    4: { start_time: '09:00', end_time: '17:00', is_available: true }, // Thursday
    5: { start_time: '09:00', end_time: '17:00', is_available: true }, // Friday
    6: { start_time: '09:00', end_time: '17:00', is_available: false }, // Saturday
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleAddService = async () => {
    if (!barberProfile) return;

    const success = await addService({
      barber_id: barberProfile.id,
      service_name: serviceForm.service_name,
      description: serviceForm.description,
      price: parseInt(serviceForm.price) * 100, // Convert to cents
      duration_minutes: parseInt(serviceForm.duration_minutes),
      is_active: true,
    });

    if (success) {
      setServiceForm({ service_name: '', description: '', price: '', duration_minutes: '' });
      setShowAddService(false);
    }
  };

  const handleAvailabilityUpdate = async (dayOfWeek: number) => {
    const dayData = availabilityForm[dayOfWeek];
    await setAvailabilityForDay(dayOfWeek, dayData.start_time, dayData.end_time, dayData.is_available);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-xl">[LOADING_BARBER_DATA...]</div>
      </div>
    );
  }

  if (!barberProfile) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">[NO_BARBER_PROFILE_FOUND]</div>
          <div className="text-green-300/80">Please register as a barber first</div>
        </div>
      </div>
    );
  }

  const totalRevenue = bookings.filter((b: any) => b.status === 'completed').length * 35; // Rough estimate
  const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed').length;
  const avgRating = 4.8; // Mock rating, would come from reviews

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
              [BARBER_DASHBOARD]
            </h1>
            <Button 
              onClick={signOut}
              variant="outline" 
              className="border-red-500 text-red-400 hover:bg-red-500/20"
            >
              LOGOUT
            </Button>
          </div>

          <div className="text-green-300 mb-2">
            {barberProfile.business_name}
          </div>
          <div className="text-green-300/60 text-sm">
            Status: [{barberProfile.status.toUpperCase()}]
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black border border-green-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-green-500/20">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-green-500/20">
              Services
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
                    <Calendar className="h-8 w-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {bookings.length}
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
                        {confirmedBookings}
                      </div>
                      <div className="text-green-300/80 text-sm">Upcoming</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-blue-400">
                        ${totalRevenue}
                      </div>
                      <div className="text-green-300/80 text-sm">Total Revenue</div>
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
                        {avgRating}
                      </div>
                      <div className="text-green-300/80 text-sm">Avg Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking: any) => (
                      <div key={booking.id} className="flex justify-between items-center p-3 border border-green-500/20 rounded">
                        <div>
                          <div className="text-green-400">{booking.service_type}</div>
                          <div className="text-green-300/80 text-sm">
                            {booking.booking_date} at {booking.booking_time}
                          </div>
                        </div>
                        <div className={`font-mono ${booking.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'}`}>
                          [{booking.status.toUpperCase()}]
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-green-300/60">No bookings yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="bg-black border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="border border-green-500/30 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-green-400 font-bold">{booking.service_type}</h3>
                            <p className="text-green-300/80">Booking ID: {booking.id.slice(0, 8)}</p>
                          </div>
                          <div className={`font-mono ${booking.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'}`}>
                            [{booking.status.toUpperCase()}]
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-green-300/60">Date</div>
                            <div className="text-green-300">{booking.booking_date}</div>
                          </div>
                          <div>
                            <div className="text-green-300/60">Time</div>
                            <div className="text-green-300">{booking.booking_time}</div>
                          </div>
                          <div>
                            <div className="text-green-300/60">Created</div>
                            <div className="text-green-300">{new Date(booking.created_at).toLocaleDateString()}</div>
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

          <TabsContent value="services">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-green-400">Services</h2>
                <Button 
                  onClick={() => setShowAddService(true)}
                  className="bg-green-500 hover:bg-green-600 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {showAddService && (
                <Card className="bg-black border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400">Add New Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-green-400">Service Name</Label>
                        <Input
                          value={serviceForm.service_name}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, service_name: e.target.value }))}
                          className="bg-black/50 border-green-500/50 text-green-300"
                          placeholder="e.g., Haircut"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-green-400">Price ($)</Label>
                        <Input
                          type="number"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                          className="bg-black/50 border-green-500/50 text-green-300"
                          placeholder="25"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-green-400">Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={serviceForm.duration_minutes}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                          className="bg-black/50 border-green-500/50 text-green-300"
                          placeholder="30"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-green-400">Description</Label>
                      <Textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-black/50 border-green-500/50 text-green-300"
                        placeholder="Service description..."
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleAddService}
                        className="bg-green-500 hover:bg-green-600 text-black"
                      >
                        Add Service
                      </Button>
                      <Button 
                        onClick={() => setShowAddService(false)}
                        variant="outline"
                        className="border-gray-500 text-gray-400"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="bg-black border-green-500/30">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-green-400 font-bold">{service.service_name}</h3>
                          <p className="text-green-300/80">${(service.price / 100).toFixed(2)}</p>
                        </div>
                        <div className="text-green-300/60 text-sm">
                          {service.duration_minutes}min
                        </div>
                      </div>
                      
                      {service.description && (
                        <p className="text-green-300/80 text-sm mb-3">{service.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className={`text-sm ${service.is_active ? 'text-green-400' : 'text-gray-400'}`}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-green-500/50 text-green-400"
                          onClick={() => updateService(service.id, { is_active: !service.is_active })}
                        >
                          {service.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {services.length === 0 && (
                <Card className="bg-black border-green-500/30">
                  <CardContent className="p-8 text-center">
                    <Scissors className="h-12 w-12 text-green-400/50 mx-auto mb-4" />
                    <div className="text-green-300/60">No services added yet</div>
                    <div className="text-green-300/40 text-sm">Add your first service to get started</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="availability">
            <Card className="bg-black border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Set Your Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dayNames.map((dayName, index) => (
                    <div key={index} className="border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-green-400 font-bold">{dayName}</h3>
                        <Switch
                          checked={availabilityForm[index].is_available}
                          onCheckedChange={(checked) => {
                            setAvailabilityForm(prev => ({
                              ...prev,
                              [index]: { ...prev[index], is_available: checked }
                            }));
                          }}
                        />
                      </div>
                      
                      {availabilityForm[index].is_available && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-green-300">Start Time</Label>
                            <Input
                              type="time"
                              value={availabilityForm[index].start_time}
                              onChange={(e) => {
                                setAvailabilityForm(prev => ({
                                  ...prev,
                                  [index]: { ...prev[index], start_time: e.target.value }
                                }));
                              }}
                              className="bg-black/50 border-green-500/50 text-green-300"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-green-300">End Time</Label>
                            <Input
                              type="time"
                              value={availabilityForm[index].end_time}
                              onChange={(e) => {
                                setAvailabilityForm(prev => ({
                                  ...prev,
                                  [index]: { ...prev[index], end_time: e.target.value }
                                }));
                              }}
                              className="bg-black/50 border-green-500/50 text-green-300"
                            />
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => handleAvailabilityUpdate(index)}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-black"
                        size="sm"
                      >
                        Update {dayName}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
