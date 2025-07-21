import { AlertTriangle, Info, CheckCircle, X } from "lucide-react";

interface AirportAlert {
  id: number;
  type: string; // "warning", "info", "success", "error"
  title: string;
  message: string;
  timestamp: string;
  dismissible: number;
  link?: string | null;
}

interface AirportAlertsProps {
  data: AirportAlert[];
  onDismiss?: (alertId: number) => void;
}

export default function AirportAlerts({ data, onDismiss }: AirportAlertsProps) {
  if (!data || data.length === 0) return null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'info': 
      default: return Info;
    }
  };

  const getAlertColorClass = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'info':
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getAlertTextColorClass = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'success': return 'text-green-600';
      case 'info':
      default: return 'text-blue-600';
    }
  };

  const getAlertBgColorClass = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      case 'success': return 'bg-green-100';
      case 'info':
      default: return 'bg-blue-100';
    }
  };

  return (
    <div className="space-y-2 mb-6">
      {data.slice(0, 3).map((alert) => {
        const AlertIcon = getAlertIcon(alert.type);
        
        return (
          <div
            key={alert.id}
            className={`rounded-xl border p-4 shadow-lg backdrop-blur-sm ${getAlertColorClass(alert.type)} 
                       animate-in slide-in-from-top-2 duration-300`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getAlertBgColorClass(alert.type)}`}>
                  <AlertIcon className={`h-4 w-4 ${getAlertTextColorClass(alert.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm mb-1 ${getAlertTextColorClass(alert.type)}`}>{alert.title}</h3>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.timestamp}</p>
                </div>
              </div>
              {alert.dismissible === 1 && onDismiss && (
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="ml-3 p-1 text-gray-400 hover:text-gray-700 hover:bg-white/50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  title="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}