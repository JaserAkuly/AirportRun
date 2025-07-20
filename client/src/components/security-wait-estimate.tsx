import { Shield, Clock, Users, AlertTriangle } from "lucide-react";

interface SecurityWaitData {
  terminal: string;
  estimatedWait: number;
  peakHours: string[];
  crowdLevel: string;
  crowdColor: string;
  tips: string[];
}

interface SecurityWaitEstimateProps {
  data: SecurityWaitData[];
}

export default function SecurityWaitEstimate({ data }: SecurityWaitEstimateProps) {
  const getCrowdColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  const getCrowdTextColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-gray-600';
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="text-primary mr-3 h-6 w-6" />
          Security Wait Estimates
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-1" />
          <span>Estimated</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-100">
          {data.map((terminal) => (
            <div key={terminal.terminal} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCrowdColorClass(terminal.crowdColor)} bg-opacity-10`}>
                    <Users className={`h-5 w-5 ${getCrowdTextColorClass(terminal.crowdColor)}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{terminal.terminal}</h3>
                    <p className={`text-sm ${getCrowdTextColorClass(terminal.crowdColor)}`}>
                      {terminal.crowdLevel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">~{terminal.estimatedWait} min</p>
                  <p className="text-xs text-gray-500">Estimated wait</p>
                </div>
              </div>
              
              {terminal.peakHours.length > 0 && (
                <div className="mb-3 p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Peak Hours Today</p>
                      <p className="text-sm text-yellow-700">
                        {terminal.peakHours.join(', ')} - expect longer waits
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {terminal.tips.length > 0 && (
                <div className="space-y-1">
                  {terminal.tips.map((tip, index) => (
                    <p key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {tip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-blue-50 border-t border-gray-100">
          <p className="text-sm text-blue-800">
            <AlertTriangle className="inline mr-1 h-4 w-4" />
            Wait times are estimates based on historical patterns, current flight schedules, and terminal activity.
          </p>
        </div>
      </div>
    </section>
  );
}