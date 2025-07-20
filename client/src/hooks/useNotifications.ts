import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NotificationHook {
  permission: string | null;
  requestPermission: () => Promise<string>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

export function useNotifications(): NotificationHook {
  const [permission, setPermission] = useState<string | null>(null);
  const { toast } = useToast();
  
  const isSupported = 'Notification' in window && 'serviceWorker' in navigator;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = async (): Promise<string> => {
    if (!isSupported) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive",
      });
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll receive alerts for significant flight delays.",
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "You can enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission error",
        description: "Unable to request notification permission.",
        variant: "destructive",
      });
      return 'denied';
    }
  };

  const showNotification = (title: string, options: NotificationOptions = {}) => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return;
    }

    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to toast notification
      toast({
        title,
        description: options.body || '',
        variant: "destructive",
      });
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported,
  };
}