import { Car, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import type { TrafficCondition } from "@shared/schema";

interface TrafficConditionsProps {
  data: TrafficCondition[];
}

export default function TrafficConditions({ data }: TrafficConditionsProps) {
  const getStatusColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  const getStatusTextColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (color: string) => {
    switch (color) {
      case 'success': return CheckCircle;
      case 'warning': return Clock;
      case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Car className="text-primary mr-3 h-6 w-6" />
          Traffic to DFW
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-1" />
          <span>Live</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-100">
          {data.map((route) => {
            const StatusIcon = getStatusIcon(route.statusColor);
            const delayMinutes = route.travelTime - route.normalTime;
            
            return (
              <div key={route.route} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColorClass(route.statusColor)} bg-opacity-10`}>
                      <StatusIcon className={`h-5 w-5 ${getStatusTextColorClass(route.statusColor)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{route.route}</h3>
                      <p className={`text-sm ${getStatusTextColorClass(route.statusColor)}`}>
                        {route.status}
                        {delayMinutes > 0 && ` (+${delayMinutes} min)`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{route.travelTime} min</p>
                    <p className="text-xs text-gray-500">
                      Usually {route.normalTime} min
                    </p>
                  </div>
                </div>
                
                {route.incidents && route.incidents.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        {route.incidents.map((incident, index) => (
                          <p key={index} className="text-sm text-yellow-800">
                            {incident}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="p-4 bg-blue-50 border-t border-gray-100">
          <p className="text-sm text-blue-800">
            <Car className="inline mr-1 h-4 w-4" />
            Traffic data includes construction zones and peak hour congestion patterns around DFW terminals.
          </p>
        </div>
      </div>
    </section>
  );
}