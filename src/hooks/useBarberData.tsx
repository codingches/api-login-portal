import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface BarberProfile {
  id: string;
  user_id: string;
  business_name: string;
  location: string;
  specialty: string;
  pricing: string;
  x_handle: string | null;
  phone: string;
  status: 'pending_payment' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface BarberService {
  id: string;
  barber_id: string;
  service_name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface BarberAvailability {
  id: string;
  barber_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export const useBarberData = () => {
  const [barberProfile, setBarberProfile] = useState<BarberProfile | null>(null);
  const [services, setServices] = useState<BarberService[]>([]);
  const [availability, setAvailability] = useState<BarberAvailability[]>([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBarberData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch barber profile
      const { data: profileData, error: profileError } = await supabase
        .from('barber_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setBarberProfile(profileData as BarberProfile);

      if (profileData) {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('barber_services')
          .select('*')
          .eq('barber_id', profileData.id);

        if (servicesError) throw servicesError;
        setServices(servicesData || []);

        // Fetch availability
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('barber_availability')
          .select('*')
          .eq('barber_id', profileData.id)
          .order('day_of_week');

        if (availabilityError) throw availabilityError;
        setAvailability(availabilityData || []);

        // Fetch bookings for this barber
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('barber_id', profileData.id)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      }
    } catch (error: any) {
      console.error('Error fetching barber data:', error);
      toast({
        title: "Error",
        description: "Failed to load barber data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addService = async (service: Omit<BarberService, 'id' | 'created_at'>) => {
    if (!barberProfile) return false;

    try {
      const { data, error } = await supabase
        .from('barber_services')
        .insert(service)
        .select()
        .single();

      if (error) throw error;
      
      setServices(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Service added successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateService = async (serviceId: string, updates: Partial<BarberService>) => {
    try {
      const { data, error } = await supabase
        .from('barber_services')
        .update(updates)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;
      
      setServices(prev => prev.map(s => s.id === serviceId ? data : s));
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
      return false;
    }
  };

  const setAvailabilityForDay = async (dayOfWeek: number, startTime: string, endTime: string, isAvailable: boolean) => {
    if (!barberProfile) return false;

    try {
      const { error } = await supabase
        .from('barber_availability')
        .upsert({
          barber_id: barberProfile.id,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          is_available: isAvailable,
        });

      if (error) throw error;
      
      await fetchBarberData(); // Refetch to get updated availability
      toast({
        title: "Success",
        description: "Availability updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBarberData();
  }, [user]);

  return {
    barberProfile,
    services,
    availability,
    bookings,
    loading,
    addService,
    updateService,
    setAvailabilityForDay,
    refetchData: fetchBarberData,
  };
};
