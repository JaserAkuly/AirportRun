import { Settings, Star, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { UserPreferences, InsertUserPreferences } from "@shared/schema";

export default function UserPreferences() {
  const [selectedTerminal, setSelectedTerminal] = useState<string>('A');
  const [notifications, setNotifications] = useState({
    tsaWaitAlerts: true,
    flightDelayAlerts: false,
    parkingAlerts: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = "default-user"; // In a real app, this would come from authentication

  const { data: userPrefs } = useQuery<UserPreferences>({
    queryKey: [`/api/preferences/${userId}`],
    retry: false,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: Partial<InsertUserPreferences>) => {
      const response = await apiRequest("POST", `/api/preferences/${userId}`, preferences);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/preferences/${userId}`] });
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Load existing preferences
  useEffect(() => {
    if (userPrefs) {
      setSelectedTerminal(userPrefs.preferredTerminal || 'A');
      setNotifications({
        tsaWaitAlerts: userPrefs.tsaWaitAlerts ?? true,
        flightDelayAlerts: userPrefs.flightDelayAlerts ?? false,
        parkingAlerts: userPrefs.parkingAlerts ?? true,
      });
    }
  }, [userPrefs]);

  const handleTerminalChange = (terminal: string) => {
    setSelectedTerminal(terminal);
    updatePreferencesMutation.mutate({ preferredTerminal: terminal });
  };

  const handleNotificationChange = (type: keyof typeof notifications, value: boolean) => {
    const updated = { ...notifications, [type]: value };
    setNotifications(updated);
    updatePreferencesMutation.mutate(updated);
  };

  const terminals = ['A', 'B', 'C', 'D', 'E'];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="text-primary mr-3 h-6 w-6" />
          Quick Settings
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Star className="text-yellow-500 mr-2 h-4 w-4" />
            Preferred Terminal
          </h3>
          <div className="flex flex-wrap gap-2">
            {terminals.map((terminal) => (
              <Button
                key={terminal}
                size="sm"
                variant={selectedTerminal === terminal ? "default" : "outline"}
                onClick={() => handleTerminalChange(terminal)}
                disabled={updatePreferencesMutation.isPending}
                className={selectedTerminal === terminal ? 'bg-primary text-white' : ''}
              >
                Terminal {terminal}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Bell className="text-blue-500 mr-2 h-4 w-4" />
            Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <Checkbox
                checked={notifications.tsaWaitAlerts}
                onCheckedChange={(checked) => handleNotificationChange('tsaWaitAlerts', !!checked)}
                disabled={updatePreferencesMutation.isPending}
              />
              <span className="text-sm text-gray-700">TSA wait time alerts</span>
            </label>
            <label className="flex items-center space-x-3">
              <Checkbox
                checked={notifications.flightDelayAlerts}
                onCheckedChange={(checked) => handleNotificationChange('flightDelayAlerts', !!checked)}
                disabled={updatePreferencesMutation.isPending}
              />
              <span className="text-sm text-gray-700">Flight delay notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <Checkbox
                checked={notifications.parkingAlerts}
                onCheckedChange={(checked) => handleNotificationChange('parkingAlerts', !!checked)}
                disabled={updatePreferencesMutation.isPending}
              />
              <span className="text-sm text-gray-700">Parking availability alerts</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
