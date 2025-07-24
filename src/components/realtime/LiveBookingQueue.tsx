import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Plus, Phone } from 'lucide-react';
import { useRealTimeFeatures, BookingQueue } from '@/hooks/useRealTimeFeatures';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface LiveBookingQueueProps {
  barberId?: string;
  isBarber?: boolean;
}

export const LiveBookingQueue = ({ barberId, isBarber = false }: LiveBookingQueueProps) => {
  const { bookingQueue, addToQueue, loading } = useRealTimeFeatures();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    service: ''
  });

  const filteredQueue = barberId 
    ? bookingQueue.filter(item => item.barber_id === barberId && item.status === 'waiting')
    : bookingQueue.filter(item => item.status === 'waiting');

  const getStatusColor = (status: BookingQueue['status']) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: BookingQueue['status']) => {
    switch (status) {
      case 'waiting': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleAddToQueue = async () => {
    if (!barberId || !newClient.name || !newClient.service) return;

    const result = await addToQueue(barberId, newClient.name, newClient.service, newClient.phone);
    if (result) {
      setNewClient({ name: '', phone: '', service: '' });
      setIsAddDialogOpen(false);
    }
  };

  const calculateTotalWaitTime = () => {
    return filteredQueue.reduce((total, item) => total + item.estimated_wait_time, 0);
  };

  if (loading) {
    return (
      <Card className="bg-black border-green-500/20">
        <CardContent className="p-6">
          <div className="text-green-400 font-mono text-center">
            [LOADING_QUEUE...]
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-green-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-400 font-mono flex items-center gap-2">
          <Users className="h-5 w-5" />
          Live Queue ({filteredQueue.length})
        </CardTitle>
        {isBarber && barberId && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-green-500/20">
              <DialogHeader>
                <DialogTitle className="text-green-400 font-mono">Add to Queue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client-name" className="text-green-400 font-mono">Client Name</Label>
                  <Input
                    id="client-name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="bg-black border-green-500/30 text-green-400"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="client-phone" className="text-green-400 font-mono">Phone (Optional)</Label>
                  <Input
                    id="client-phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    className="bg-black border-green-500/30 text-green-400"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="service" className="text-green-400 font-mono">Service</Label>
                  <Input
                    id="service"
                    value={newClient.service}
                    onChange={(e) => setNewClient({...newClient, service: e.target.value})}
                    className="bg-black border-green-500/30 text-green-400"
                    placeholder="Haircut, Beard Trim, etc."
                  />
                </div>
                <Button 
                  onClick={handleAddToQueue}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-mono"
                  disabled={!newClient.name || !newClient.service}
                >
                  Add to Queue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredQueue.length === 0 ? (
          <div className="text-center py-8 text-green-400/60 font-mono">
            No one in queue
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 p-3 bg-green-500/10 rounded border border-green-500/20">
              <span className="text-green-400 font-mono text-sm">Total Wait Time:</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 font-mono">
                {calculateTotalWaitTime()} min
              </Badge>
            </div>
            <div className="space-y-3">
              {filteredQueue.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded border border-green-500/20 hover:bg-green-500/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(item.status)} text-white font-mono`}>
                        #{item.queue_position}
                      </Badge>
                      {getStatusIcon(item.status)}
                    </div>
                    <div>
                      <div className="text-green-400 font-mono font-medium">
                        {item.client_name}
                      </div>
                      <div className="text-green-400/60 text-sm font-mono">
                        {item.service_type}
                      </div>
                      {item.client_phone && (
                        <div className="text-green-400/40 text-xs font-mono flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {item.client_phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-mono text-sm">
                      ~{item.estimated_wait_time} min
                    </div>
                    <div className="text-green-400/40 text-xs font-mono">
                      ETA: {new Date(Date.now() + item.estimated_wait_time * 60000).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};