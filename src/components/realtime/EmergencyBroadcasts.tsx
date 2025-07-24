import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Megaphone, Plus, Clock, MapPin, X } from 'lucide-react';
import { useRealTimeFeatures, EmergencyBroadcast } from '@/hooks/useRealTimeFeatures';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface EmergencyBroadcastsProps {
  broadcasts?: EmergencyBroadcast[];
  canCreate?: boolean;
}

export const EmergencyBroadcasts = ({ broadcasts, canCreate = false }: EmergencyBroadcastsProps) => {
  const { emergencyBroadcasts, sendEmergencyBroadcast, loading } = useRealTimeFeatures();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState({
    type: 'system' as EmergencyBroadcast['broadcast_type'],
    title: '',
    message: '',
    priority: 'normal' as EmergencyBroadcast['priority'],
    affected_area: ''
  });

  const displayBroadcasts = broadcasts || emergencyBroadcasts;

  const getPriorityIcon = (priority: EmergencyBroadcast['priority']) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: EmergencyBroadcast['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: EmergencyBroadcast['broadcast_type']) => {
    switch (type) {
      case 'cancellation': return '❌';
      case 'delay': return '⏰';
      case 'emergency': return '🚨';
      case 'weather': return '🌧️';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  const handleCreateBroadcast = async () => {
    if (!newBroadcast.title || !newBroadcast.message) return;

    const result = await sendEmergencyBroadcast(
      newBroadcast.type,
      newBroadcast.title,
      newBroadcast.message,
      newBroadcast.priority,
      newBroadcast.affected_area || undefined
    );

    if (result) {
      setNewBroadcast({
        type: 'system',
        title: '',
        message: '',
        priority: 'normal',
        affected_area: ''
      });
      setIsCreateDialogOpen(false);
    }
  };

  const isExpired = (broadcast: EmergencyBroadcast) => {
    return broadcast.expires_at && new Date(broadcast.expires_at) < new Date();
  };

  if (loading) {
    return (
      <Card className="bg-black border-red-500/20">
        <CardContent className="p-6">
          <div className="text-red-400 font-mono text-center">
            [LOADING_BROADCASTS...]
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-red-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-red-400 font-mono flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Emergency Broadcasts ({displayBroadcasts.length})
        </CardTitle>
        {canCreate && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Plus className="h-4 w-4 mr-2" />
                Create Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-red-500/20">
              <DialogHeader>
                <DialogTitle className="text-red-400 font-mono">Create Emergency Broadcast</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="broadcast-type" className="text-red-400 font-mono">Type</Label>
                  <Select value={newBroadcast.type} onValueChange={(value) => 
                    setNewBroadcast({...newBroadcast, type: value as EmergencyBroadcast['broadcast_type']})
                  }>
                    <SelectTrigger className="bg-black border-red-500/30 text-red-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-500/30">
                      <SelectItem value="system" className="text-red-400">System</SelectItem>
                      <SelectItem value="emergency" className="text-red-400">Emergency</SelectItem>
                      <SelectItem value="cancellation" className="text-red-400">Cancellation</SelectItem>
                      <SelectItem value="delay" className="text-red-400">Delay</SelectItem>
                      <SelectItem value="weather" className="text-red-400">Weather</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority" className="text-red-400 font-mono">Priority</Label>
                  <Select value={newBroadcast.priority} onValueChange={(value) => 
                    setNewBroadcast({...newBroadcast, priority: value as EmergencyBroadcast['priority']})
                  }>
                    <SelectTrigger className="bg-black border-red-500/30 text-red-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-500/30">
                      <SelectItem value="low" className="text-red-400">Low</SelectItem>
                      <SelectItem value="normal" className="text-red-400">Normal</SelectItem>
                      <SelectItem value="high" className="text-red-400">High</SelectItem>
                      <SelectItem value="critical" className="text-red-400">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title" className="text-red-400 font-mono">Title</Label>
                  <Input
                    id="title"
                    value={newBroadcast.title}
                    onChange={(e) => setNewBroadcast({...newBroadcast, title: e.target.value})}
                    className="bg-black border-red-500/30 text-red-400"
                    placeholder="Broadcast title"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-red-400 font-mono">Message</Label>
                  <Textarea
                    id="message"
                    value={newBroadcast.message}
                    onChange={(e) => setNewBroadcast({...newBroadcast, message: e.target.value})}
                    className="bg-black border-red-500/30 text-red-400"
                    placeholder="Broadcast message"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="affected-area" className="text-red-400 font-mono">Affected Area (Optional)</Label>
                  <Input
                    id="affected-area"
                    value={newBroadcast.affected_area}
                    onChange={(e) => setNewBroadcast({...newBroadcast, affected_area: e.target.value})}
                    className="bg-black border-red-500/30 text-red-400"
                    placeholder="Downtown, City Center, etc."
                  />
                </div>

                <Button 
                  onClick={handleCreateBroadcast}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-mono"
                  disabled={!newBroadcast.title || !newBroadcast.message}
                >
                  Send Broadcast
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {displayBroadcasts.length === 0 ? (
          <div className="text-center py-8 text-red-400/60 font-mono">
            No active emergency broadcasts
          </div>
        ) : (
          displayBroadcasts.map((broadcast) => (
            <div 
              key={broadcast.id}
              className={`p-4 rounded border transition-all ${
                isExpired(broadcast) 
                  ? 'bg-gray-900/50 border-gray-500/20 opacity-60' 
                  : broadcast.priority === 'critical' 
                    ? 'bg-red-500/20 border-red-500/50 animate-pulse' 
                    : broadcast.priority === 'high'
                      ? 'bg-orange-500/20 border-orange-500/50'
                      : 'bg-yellow-500/10 border-yellow-500/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getTypeIcon(broadcast.broadcast_type)}</span>
                  <Badge className={`${getPriorityColor(broadcast.priority)} text-white font-mono flex items-center gap-1`}>
                    {getPriorityIcon(broadcast.priority)}
                    {broadcast.priority.toUpperCase()}
                  </Badge>
                  {isExpired(broadcast) && (
                    <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 font-mono">
                      EXPIRED
                    </Badge>
                  )}
                </div>
                <div className="text-red-400/60 text-xs font-mono">
                  {new Date(broadcast.created_at).toLocaleString()}
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-red-400 font-mono font-medium mb-1">
                  {broadcast.title}
                </h3>
                <p className="text-red-400/80 font-mono text-sm">
                  {broadcast.message}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs">
                {broadcast.affected_area && (
                  <div className="text-red-400/60 font-mono flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {broadcast.affected_area}
                  </div>
                )}
                {broadcast.expires_at && (
                  <div className="text-red-400/60 font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires: {new Date(broadcast.expires_at).toLocaleString()}
                  </div>
                )}
              </div>

              {broadcast.priority === 'critical' && !isExpired(broadcast) && (
                <div className="mt-3 p-2 bg-red-500/30 rounded border border-red-500/50">
                  <div className="text-red-400 font-mono text-xs font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    CRITICAL: Immediate action required
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};