
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Calendar, MessageCircle, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  data: any;
  read_at: string | null;
  created_at: string;
}

export const NotificationCenter = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('push_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(showAll ? 50 : 10);

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('push_notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      case 'message':
        return <MessageCircle className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'message':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'payment':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const unreadCount = notifications?.filter(n => !n.read_at).length || 0;

  if (isLoading) {
    return (
      <div className="text-green-400 font-mono text-center py-4">
        [LOADING_NOTIFICATIONS...]
      </div>
    );
  }

  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-400 font-mono flex items-center gap-2">
            <Bell className="h-5 w-5" />
            [NOTIFICATIONS]
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {notifications && notifications.length > 10 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 font-mono"
            >
              {showAll ? 'Show Less' : 'Show All'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!notifications || notifications.length === 0 ? (
          <div className="text-green-400/60 font-mono text-center py-8">
            No notifications
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read_at 
                    ? 'border-green-500/20 bg-green-500/5' 
                    : 'border-green-500/40 bg-green-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-green-400 font-mono text-sm font-medium">
                        {notification.title}
                      </h4>
                      {!notification.read_at && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          className="text-green-400 hover:text-green-300 p-1"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-green-300/80 font-mono text-xs mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getNotificationColor(notification.type)}`}
                      >
                        {notification.type.toUpperCase()}
                      </Badge>
                      <span className="text-green-400/60 font-mono text-xs">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
