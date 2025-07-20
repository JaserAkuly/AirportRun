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
      case 'warning': return 'bg-warning bg-opacity-10 border-warning border-opacity-20';
      case 'error': return 'bg-error bg-opacity-10 border-error border-opacity-20';
      case 'success': return 'bg-success bg-opacity-10 border-success border-opacity-20';
      case 'info':
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getAlertTextColorClass = (type: string) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'success': return 'text-success';
      case 'info':
      default: return 'text-blue-600';
    }
  };

  const getAlertBgColorClass = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-warning bg-opacity-20';
      case 'error': return 'bg-error bg-opacity-20';
      case 'success': return 'bg-success bg-opacity-20';
      case 'info':
      default: return 'bg-blue-100';
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <AlertTriangle className="text-primary mr-3 h-6 w-6" />
          Airport Alerts
        </h2>
        <div className="text-sm text-gray-500">
          {data.length} active alert{data.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="space-y-2">
        {data.slice(0, 3).map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          
          return (
            <div
              key={alert.id}
              className={`rounded-lg border p-3 ${getAlertColorClass(alert.type)}`}
            >
              <div className="flex items-start space-x-2">
                <div className={`w-6 h-6 rounded flex items-center justify-center ${getAlertBgColorClass(alert.type)}`}>
                  <AlertIcon className={`h-3 w-3 ${getAlertTextColorClass(alert.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{alert.title}</h3>
                      <p className="text-xs text-gray-700 mb-1">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                    {alert.dismissible === 1 && onDismiss && (
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}