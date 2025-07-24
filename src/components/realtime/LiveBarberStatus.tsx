import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Clock, MapPin, Coffee, Car, Wifi, WifiOff } from 'lucide-react';
import { useRealTimeFeatures, BarberLiveStatus } from '@/hooks/useRealTimeFeatures';

interface LiveBarberStatusProps {
  barberId?: string;
  isBarber?: boolean;
  showAll?: boolean;
}

export const LiveBarberStatus = ({ barberId, isBarber = false, showAll = false }: LiveBarberStatusProps) => {
  const { barberStatuses, updateBarberStatus, loading } = useRealTimeFeatures();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const filteredStatuses = showAll 
    ? barberStatuses 
    : barberId 
      ? barberStatuses.filter(status => status.barber_id === barberId)
      : barberStatuses;

  const getStatusIcon = (status: BarberLiveStatus['status']) => {
    switch (status) {
      case 'available': return <Wifi className="h-4 w-4" />;
      case 'busy': return <User className="h-4 w-4" />;
      case 'break': return <Coffee className="h-4 w-4" />;
      case 'traveling': return <Car className="h-4 w-4" />;
      case 'offline': return <WifiOff className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: BarberLiveStatus['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'break': return 'bg-yellow-500';
      case 'traveling': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: BarberLiveStatus['status']) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'break': return 'On Break';
      case 'traveling': return 'Traveling';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const handleStatusUpdate = async (newStatus: BarberLiveStatus['status']) => {
    if (!barberId) return;

    setUpdatingStatus(true);
    try {
      await updateBarberStatus(barberId, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const currentStatus = filteredStatuses.find(status => status.barber_id === barberId);

  if (loading) {
    return (
      <Card className="bg-black border-green-500/20">
        <CardContent className="p-6">
          <div className="text-green-400 font-mono text-center">
            [LOADING_STATUS...]
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-green-500/20">
      <CardHeader>
        <CardTitle className="text-green-400 font-mono flex items-center gap-2">
          <User className="h-5 w-5" />
          {showAll ? 'All Barber Status' : 'Live Status'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isBarber && barberId && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-mono text-sm">Your Status:</span>
              {currentStatus && (
                <Badge className={`${getStatusColor(currentStatus.status)} text-white font-mono flex items-center gap-1`}>
                  {getStatusIcon(currentStatus.status)}
                  {getStatusText(currentStatus.status)}
                </Badge>
              )}
            </div>
            
            <Select 
              value={currentStatus?.status || 'offline'} 
              onValueChange={handleStatusUpdate}
              disabled={updatingStatus}
            >
              <SelectTrigger className="bg-black border-green-500/30 text-green-400">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent className="bg-black border-green-500/30">
                <SelectItem value="available" className="text-green-400">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Available
                  </div>
                </SelectItem>
                <SelectItem value="busy" className="text-green-400">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Busy
                  </div>
                </SelectItem>
                <SelectItem value="break" className="text-green-400">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    On Break
                  </div>
                </SelectItem>
                <SelectItem value="traveling" className="text-green-400">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Traveling
                  </div>
                </SelectItem>
                <SelectItem value="offline" className="text-green-400">
                  <div className="flex items-center gap-2">
                    <WifiOff className="h-4 w-4" />
                    Offline
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {currentStatus?.current_client && (
              <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <div className="text-blue-400 font-mono text-sm">Current Client:</div>
                <div className="text-blue-400 font-mono font-medium">{currentStatus.current_client}</div>
                {currentStatus.estimated_finish_time && (
                  <div className="text-blue-400/60 text-xs font-mono">
                    Estimated finish: {new Date(currentStatus.estimated_finish_time).toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {showAll && (
          <div className="space-y-3">
            {filteredStatuses.length === 0 ? (
              <div className="text-center py-8 text-green-400/60 font-mono">
                No barber status data available
              </div>
            ) : (
              filteredStatuses.map((status) => (
                <div 
                  key={status.id}
                  className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-green-500/20"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(status.status)} text-white font-mono flex items-center gap-1`}>
                      {getStatusIcon(status.status)}
                      {getStatusText(status.status)}
                    </Badge>
                    <div>
                      <div className="text-green-400 font-mono text-sm">
                        Barber #{status.barber_id.slice(-8)}
                      </div>
                      {status.current_client && (
                        <div className="text-green-400/60 text-xs font-mono">
                          Client: {status.current_client}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-green-400/60 text-xs font-mono">
                      Updated: {new Date(status.updated_at).toLocaleTimeString()}
                    </div>
                    {status.estimated_finish_time && (
                      <div className="text-green-400/40 text-xs font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Finish: {new Date(status.estimated_finish_time).toLocaleTimeString()}
                      </div>
                    )}
                    {status.last_location_lat && status.last_location_lng && (
                      <div className="text-green-400/40 text-xs font-mono flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location tracked
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};