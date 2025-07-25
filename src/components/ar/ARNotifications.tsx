import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, Camera, Sparkles, Share2, Heart } from 'lucide-react';

interface ARNotification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  icon: React.ReactNode;
  duration?: number;
}

interface ARNotificationsProps {
  notifications: ARNotification[];
  onDismiss: (id: string) => void;
}

export const ARNotifications = ({ notifications, onDismiss }: ARNotificationsProps) => {
  const [visibleNotifications, setVisibleNotifications] = useState<ARNotification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);

    // Auto-dismiss notifications
    notifications.forEach(notification => {
      if (notification.duration) {
        setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
      }
    });
  }, [notifications, onDismiss]);

  const getNotificationStyles = (type: ARNotification['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/50',
          text: 'text-green-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/50',
          text: 'text-yellow-400'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/50',
          text: 'text-blue-400'
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {visibleNotifications.map((notification) => {
          const styles = getNotificationStyles(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`
                ${styles.bg} ${styles.border} ${styles.text} 
                backdrop-blur-md border rounded-lg p-4 shadow-lg
                cursor-pointer hover:scale-105 transition-transform
              `}
              onClick={() => onDismiss(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-mono text-sm font-semibold">
                    {notification.title}
                  </h4>
                  <p className="text-xs opacity-80 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing AR notifications
export const useARNotifications = () => {
  const [notifications, setNotifications] = useState<ARNotification[]>([]);

  const addNotification = (notification: Omit<ARNotification, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random()}`;
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Predefined notification creators
  const notifyPhotoCapture = () => addNotification({
    type: 'success',
    title: '[PHOTO_CAPTURED]',
    message: 'Your AR preview has been saved successfully!',
    icon: <Camera className="h-4 w-4" />,
    duration: 3000,
  });

  const notifyStyleChange = (styleName: string) => addNotification({
    type: 'info',
    title: '[STYLE_UPDATED]',
    message: `Now previewing: ${styleName}`,
    icon: <Sparkles className="h-4 w-4" />,
    duration: 2000,
  });

  const notifyFavoriteAdded = (styleName: string) => addNotification({
    type: 'success',
    title: '[FAVORITE_ADDED]',
    message: `${styleName} added to your favorites!`,
    icon: <Heart className="h-4 w-4" />,
    duration: 2000,
  });

  const notifyShare = () => addNotification({
    type: 'success',
    title: '[SHARED_SUCCESSFULLY]',
    message: 'AR preview shared with your network!',
    icon: <Share2 className="h-4 w-4" />,
    duration: 3000,
  });

  const notifyCameraError = () => addNotification({
    type: 'warning',
    title: '[CAMERA_ACCESS_REQUIRED]',
    message: 'Please allow camera access to use AR features',
    icon: <AlertTriangle className="h-4 w-4" />,
    duration: 5000,
  });

  const notifyFaceDetection = (detected: boolean) => addNotification({
    type: detected ? 'success' : 'warning',
    title: detected ? '[FACE_DETECTED]' : '[FACE_NOT_DETECTED]',
    message: detected 
      ? 'AR overlay ready! Try on different hairstyles now.' 
      : 'Position your face in the center of the frame.',
    icon: detected ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />,
    duration: detected ? 2000 : 4000,
  });

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    // Predefined notifications
    notifyPhotoCapture,
    notifyStyleChange,
    notifyFavoriteAdded,
    notifyShare,
    notifyCameraError,
    notifyFaceDetection,
  };
};