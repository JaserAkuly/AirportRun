import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationSettings() {
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-400 cursor-not-allowed"
        disabled
      >
        <Bell className="mr-2 h-4 w-4" />
        Notifications
      </Button>
      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
        Soon
      </span>
    </div>
  );
}