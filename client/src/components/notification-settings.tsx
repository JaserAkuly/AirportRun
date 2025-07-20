import { useState, useEffect } from 'react';
import { Bell, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NotificationPreferences, InsertNotificationPreferences } from '@shared/schema';

export default function NotificationSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [delayThreshold, setDelayThreshold] = useState(30);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [preferredTerminals, setPreferredTerminals] = useState<string[]>([]);
  
  const { permission, requestPermission, isSupported } = useNotifications();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current notification preferences
  const { data: preferences, isLoading } = useQuery<NotificationPreferences>({
    queryKey: ['/api/notification-preferences'],
    retry: false,
  });

  // Update notification preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: InsertNotificationPreferences) => {
      const response = await fetch('/api/notification-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save preferences');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-preferences'] });
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Save failed",
        description: "Failed to save notification preferences.",
        variant: "destructive",
      });
    },
  });

  // Load preferences when data is available
  useEffect(() => {
    if (preferences) {
      setDelayThreshold(preferences.delayThreshold || 30);
      setNotificationsEnabled(preferences.notificationsEnabled || false);
      setPreferredTerminals(preferences.preferredTerminals || []);
    }
  }, [preferences]);

  const handleEnableNotifications = async () => {
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      return;
    }

    const result = await requestPermission();
    if (result === 'granted') {
      setNotificationsEnabled(true);
    }
  };

  const handleSaveSettings = () => {
    updatePreferencesMutation.mutate({
      userId: 'demo-user', // In a real app, this would come from auth
      delayThreshold,
      notificationsEnabled: notificationsEnabled && permission === 'granted',
      preferredTerminals,
    });
  };

  const toggleTerminal = (terminal: string) => {
    setPreferredTerminals(prev => 
      prev.includes(terminal) 
        ? prev.filter(t => t !== terminal)
        : [...prev, terminal]
    );
  };

  const terminals = ['Terminal A', 'Terminal B', 'Terminal C', 'Terminal D', 'Terminal E'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Notification Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Browser Support Check */}
          {!isSupported && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Push notifications are not supported in your browser.
              </p>
            </div>
          )}

          {/* Enable Notifications */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Push Notifications</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Get notified about significant flight delays
                </p>
                <p className="text-xs text-gray-500">
                  Status: {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Blocked' : 'Not enabled'}
                </p>
              </div>
              <Button
                onClick={handleEnableNotifications}
                disabled={!isSupported || permission === 'denied'}
                variant={notificationsEnabled && permission === 'granted' ? 'default' : 'outline'}
                size="sm"
              >
                {permission === 'granted' ? 'Enabled' : 'Enable'}
              </Button>
            </div>
          </div>

          {/* Delay Threshold */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Delay Threshold</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Notify me when delays exceed:
              </p>
              <div className="flex space-x-2">
                {[15, 30, 45, 60].map((minutes) => (
                  <Button
                    key={minutes}
                    variant={delayThreshold === minutes ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDelayThreshold(minutes)}
                  >
                    {minutes}min
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Preferred Terminals */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Preferred Terminals</span>
            </h3>
            <p className="text-sm text-gray-700">
              Get priority notifications for flights in these terminals:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {terminals.map((terminal) => (
                <Button
                  key={terminal}
                  variant={preferredTerminals.includes(terminal) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTerminal(terminal)}
                  className="text-xs"
                >
                  {terminal}
                </Button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button 
              onClick={handleSaveSettings} 
              disabled={updatePreferencesMutation.isPending}
              className="flex-1"
            >
              {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}