import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Star, Clock, AlertTriangle } from 'lucide-react';
import { useRealTimeFeatures } from '@/hooks/useRealTimeFeatures';
import { LiveBookingQueue } from './LiveBookingQueue';
import { InstantMessagingHub } from './InstantMessagingHub';
import { LiveBarberStatus } from './LiveBarberStatus';
import { EmergencyBroadcasts } from './EmergencyBroadcasts';

interface RealTimeDashboardProps {
  barberId?: string;
  isBarber?: boolean;
}

export const RealTimeDashboard = ({ barberId, isBarber = false }: RealTimeDashboardProps) => {
  const { 
    bookingQueue, 
    conversations, 
    barberStatuses, 
    dynamicPricing, 
    emergencyBroadcasts,
    loading 
  } = useRealTimeFeatures();

  // Calculate real-time metrics
  const activeQueue = bookingQueue.filter(item => item.status === 'waiting');
  const totalWaitTime = activeQueue.reduce((total, item) => total + item.estimated_wait_time, 0);
  const activeConversations = conversations.filter(conv => 
    new Date(conv.last_message_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  const availableBarbers = barberStatuses.filter(status => status.status === 'available');
  const urgentBroadcasts = emergencyBroadcasts.filter(broadcast => 
    broadcast.priority === 'critical' || broadcast.priority === 'high'
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-black border-green-500/20">
          <CardContent className="p-6">
            <div className="text-green-400 font-mono text-center">
              [LOADING_REAL_TIME_DASHBOARD...]
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-400/60 font-mono text-sm">Queue Length</div>
                <div className="text-2xl font-mono text-green-400">{activeQueue.length}</div>
              </div>
              <Users className="h-8 w-8 text-green-400/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-400/60 font-mono text-sm">Total Wait</div>
                <div className="text-2xl font-mono text-green-400">{totalWaitTime}m</div>
              </div>
              <Clock className="h-8 w-8 text-green-400/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-400/60 font-mono text-sm">Active Chats</div>
                <div className="text-2xl font-mono text-green-400">{activeConversations.length}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-400/60 font-mono text-sm">Available Barbers</div>
                <div className="text-2xl font-mono text-green-400">{availableBarbers.length}</div>
              </div>
              <Star className="h-8 w-8 text-green-400/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Broadcasts */}
      {urgentBroadcasts.length > 0 && (
        <EmergencyBroadcasts broadcasts={urgentBroadcasts} />
      )}

      {/* Dynamic Pricing Alerts */}
      {dynamicPricing.length > 0 && (
        <Card className="bg-black border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 font-mono flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Dynamic Pricing Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dynamicPricing.slice(0, 6).map((pricing) => (
                <div 
                  key={pricing.id}
                  className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400 font-mono text-sm font-medium">
                      {pricing.service_name}
                    </span>
                    <Badge 
                      className={`font-mono ${
                        pricing.demand_level === 'peak' ? 'bg-red-500' :
                        pricing.demand_level === 'high' ? 'bg-orange-500' :
                        pricing.demand_level === 'normal' ? 'bg-yellow-500' :
                        'bg-green-500'
                      } text-white`}
                    >
                      {pricing.demand_level}
                    </Badge>
                  </div>
                  <div className="text-yellow-400/60 font-mono text-xs">
                    Base: ${pricing.base_price} × {pricing.surge_multiplier}
                  </div>
                  <div className="text-yellow-400 font-mono font-medium">
                    Current: ${Math.round(pricing.base_price * pricing.surge_multiplier)}
                  </div>
                  {pricing.effective_until && (
                    <div className="text-yellow-400/40 text-xs font-mono mt-1">
                      Until: {new Date(pricing.effective_until).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Real-Time Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveBookingQueue barberId={barberId} isBarber={isBarber} />
        <LiveBarberStatus barberId={barberId} isBarber={isBarber} showAll={!barberId} />
      </div>

      {/* Instant Messaging */}
      <InstantMessagingHub barberId={barberId} />

      {/* Real-Time Analytics */}
      {isBarber && (
        <Card className="bg-black border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/10 rounded border border-green-500/20">
                <div className="text-green-400 font-mono text-sm">Today's Queue</div>
                <div className="text-2xl font-mono text-green-400 mb-1">
                  {bookingQueue.filter(item => 
                    new Date(item.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <div className="text-green-400/60 text-xs font-mono">clients served</div>
              </div>
              
              <div className="p-4 bg-blue-500/10 rounded border border-blue-500/20">
                <div className="text-blue-400 font-mono text-sm">Avg Wait Time</div>
                <div className="text-2xl font-mono text-blue-400 mb-1">
                  {activeQueue.length > 0 ? Math.round(totalWaitTime / activeQueue.length) : 0}m
                </div>
                <div className="text-blue-400/60 text-xs font-mono">per client</div>
              </div>
              
              <div className="p-4 bg-purple-500/10 rounded border border-purple-500/20">
                <div className="text-purple-400 font-mono text-sm">Active Chats</div>
                <div className="text-2xl font-mono text-purple-400 mb-1">
                  {activeConversations.length}
                </div>
                <div className="text-purple-400/60 text-xs font-mono">conversations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};