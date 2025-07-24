import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

// Types for real-time features
export interface BookingQueue {
  id: string;
  barber_id: string;
  client_name: string;
  client_phone?: string;
  service_type: string;
  estimated_wait_time: number;
  queue_position: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ChatConversation {
  id: string;
  barber_id: string;
  client_id: string;
  last_message_at: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'location';
  is_read: boolean;
  created_at: string;
}

export interface BarberLiveStatus {
  id: string;
  barber_id: string;
  status: 'available' | 'busy' | 'break' | 'traveling' | 'offline';
  current_client?: string;
  estimated_finish_time?: string;
  last_location_lat?: number;
  last_location_lng?: number;
  updated_at: string;
}

export interface DynamicPricing {
  id: string;
  barber_id: string;
  service_name: string;
  base_price: number;
  surge_multiplier: number;
  demand_level: 'low' | 'normal' | 'high' | 'peak';
  effective_until?: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyBroadcast {
  id: string;
  sender_id: string;
  broadcast_type: 'cancellation' | 'delay' | 'emergency' | 'weather' | 'system';
  title: string;
  message: string;
  affected_area?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export const useRealTimeFeatures = () => {
  const [bookingQueue, setBookingQueue] = useState<BookingQueue[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [barberStatuses, setBarberStatuses] = useState<BarberLiveStatus[]>([]);
  const [dynamicPricing, setDynamicPricing] = useState<DynamicPricing[]>([]);
  const [emergencyBroadcasts, setEmergencyBroadcasts] = useState<EmergencyBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch initial data
  const fetchInitialData = async () => {
    if (!user) return;

    try {
      const [queueRes, conversationsRes, statusRes, pricingRes, broadcastsRes] = await Promise.all([
        supabase.from('booking_queue').select('*').order('queue_position'),
        supabase.from('chat_conversations').select('*').order('last_message_at', { ascending: false }),
        supabase.from('barber_live_status').select('*'),
        supabase.from('dynamic_pricing').select('*').order('created_at', { ascending: false }),
        supabase.from('emergency_broadcasts').select('*').eq('is_active', true).order('created_at', { ascending: false })
      ]);

      if (queueRes.data) setBookingQueue(queueRes.data as BookingQueue[]);
      if (conversationsRes.data) setConversations(conversationsRes.data as ChatConversation[]);
      if (statusRes.data) setBarberStatuses(statusRes.data as BarberLiveStatus[]);
      if (pricingRes.data) setDynamicPricing(pricingRes.data as DynamicPricing[]);
      if (broadcastsRes.data) setEmergencyBroadcasts(broadcastsRes.data as EmergencyBroadcast[]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load real-time data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchInitialData();

    // Booking Queue Subscription
    const queueChannel = supabase
      .channel('booking-queue-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'booking_queue' }, 
        (payload) => {
          console.log('Queue change:', payload);
          if (payload.eventType === 'INSERT') {
            setBookingQueue(prev => [...prev, payload.new as BookingQueue].sort((a, b) => a.queue_position - b.queue_position));
          } else if (payload.eventType === 'UPDATE') {
            setBookingQueue(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as BookingQueue : item
            ).sort((a, b) => a.queue_position - b.queue_position));
          } else if (payload.eventType === 'DELETE') {
            setBookingQueue(prev => prev.filter(item => item.id !== payload.old.id));
          }
        })
      .subscribe();

    // Chat Conversations Subscription
    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, 
        (payload) => {
          console.log('Conversation change:', payload);
          if (payload.eventType === 'INSERT') {
            setConversations(prev => [payload.new as ChatConversation, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setConversations(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as ChatConversation : item
            ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
          }
        })
      .subscribe();

    // Barber Status Subscription
    const statusChannel = supabase
      .channel('barber-status-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'barber_live_status' }, 
        (payload) => {
          console.log('Status change:', payload);
          if (payload.eventType === 'INSERT') {
            setBarberStatuses(prev => [...prev, payload.new as BarberLiveStatus]);
          } else if (payload.eventType === 'UPDATE') {
            setBarberStatuses(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as BarberLiveStatus : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setBarberStatuses(prev => prev.filter(item => item.id !== payload.old.id));
          }
        })
      .subscribe();

    // Dynamic Pricing Subscription
    const pricingChannel = supabase
      .channel('pricing-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dynamic_pricing' }, 
        (payload) => {
          console.log('Pricing change:', payload);
          if (payload.eventType === 'INSERT') {
            setDynamicPricing(prev => [payload.new as DynamicPricing, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDynamicPricing(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as DynamicPricing : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setDynamicPricing(prev => prev.filter(item => item.id !== payload.old.id));
          }
        })
      .subscribe();

    // Emergency Broadcasts Subscription
    const broadcastsChannel = supabase
      .channel('broadcasts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_broadcasts' }, 
        (payload) => {
          console.log('Broadcast change:', payload);
          if (payload.eventType === 'INSERT' && payload.new.is_active) {
            setEmergencyBroadcasts(prev => [payload.new as EmergencyBroadcast, ...prev]);
            // Show immediate notification for critical broadcasts
            if (payload.new.priority === 'critical') {
              toast({
                title: "🚨 " + payload.new.title,
                description: payload.new.message,
                variant: "destructive",
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            setEmergencyBroadcasts(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as EmergencyBroadcast : item
            ).filter(item => item.is_active));
          }
        })
      .subscribe();

    return () => {
      queueChannel.unsubscribe();
      conversationsChannel.unsubscribe();
      statusChannel.unsubscribe();
      pricingChannel.unsubscribe();
      broadcastsChannel.unsubscribe();
    };
  }, [user, toast]);

  // Helper functions
  const addToQueue = async (barber_id: string, client_name: string, service_type: string, client_phone?: string) => {
    try {
      const { data: queueData } = await supabase
        .from('booking_queue')
        .select('queue_position')
        .eq('barber_id', barber_id)
        .eq('status', 'waiting')
        .order('queue_position', { ascending: false })
        .limit(1);

      const nextPosition = queueData && queueData.length > 0 ? queueData[0].queue_position + 1 : 1;

      const { data, error } = await supabase
        .from('booking_queue')
        .insert([{
          barber_id,
          client_name,
          client_phone,
          service_type,
          queue_position: nextPosition
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Added to Queue",
        description: `Position #${nextPosition} in queue`,
      });

      return data;
    } catch (error) {
      console.error('Error adding to queue:', error);
      toast({
        title: "Error",
        description: "Failed to add to queue",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateBarberStatus = async (barber_id: string, status: BarberLiveStatus['status'], current_client?: string) => {
    try {
      const { data, error } = await supabase
        .from('barber_live_status')
        .upsert([{
          barber_id,
          status,
          current_client,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Status changed to ${status}`,
      });

      return data;
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return null;
    }
  };

  const sendEmergencyBroadcast = async (
    broadcast_type: EmergencyBroadcast['broadcast_type'],
    title: string,
    message: string,
    priority: EmergencyBroadcast['priority'] = 'normal',
    affected_area?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('emergency_broadcasts')
        .insert([{
          sender_id: user.id,
          broadcast_type,
          title,
          message,
          priority,
          affected_area,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Broadcast Sent",
        description: `${title} broadcast sent successfully`,
      });

      return data;
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast({
        title: "Error",
        description: "Failed to send broadcast",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    // State
    bookingQueue,
    conversations,
    barberStatuses,
    dynamicPricing,
    emergencyBroadcasts,
    loading,
    
    // Actions
    addToQueue,
    updateBarberStatus,
    sendEmergencyBroadcast,
    refetch: fetchInitialData,
  };
};