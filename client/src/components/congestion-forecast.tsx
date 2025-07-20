import { TrendingUp, CheckCircle, AlertTriangle, Moon, Info } from "lucide-react";
import type { CongestionForecast } from "@shared/schema";

interface CongestionForecastProps {
  data: CongestionForecast[];
}

export default function CongestionForecast({ data }: CongestionForecastProps) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  const getCurrentPeriod = () => {
    if (currentHour >= 6 && currentHour <= 8) return "Peak (6-8 AM)";
    if (currentHour >= 17 && currentHour <= 20) return "Peak (5-8 PM)";
    if (currentHour >= 21 || currentHour <= 5) return "Evening/Night";
    return "Current";
  };

  const getCurrentCongestionLevel = () => {
    if (currentHour >= 6 && currentHour <= 8) return { level: "High Congestion", color: "warning", icon: AlertTriangle };
    if (currentHour >= 17 && currentHour <= 20) return { level: "High Congestion", color: "warning", icon: AlertTriangle };
    return { level: "Low Congestion", color: "success", icon: CheckCircle };
  };

  const getBarColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  const getIconColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-gray-600';
    }
  };

  const getBgColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success bg-opacity-10';
      case 'warning': return 'bg-warning bg-opacity-10';
      case 'error': return 'bg-error bg-opacity-10';
      default: return 'bg-gray-100';
    }
  };

  const currentCongestion = getCurrentCongestionLevel();
  const CurrentIcon = currentCongestion.icon;

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="text-primary mr-3 h-6 w-6" />
          12-Hour Congestion Forecast
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-1" />
          <span>AI Predicted</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${getBgColorClass(currentCongestion.color)}`}>
              <CurrentIcon className={`h-6 w-6 ${getIconColorClass(currentCongestion.color)}`} />
            </div>
            <p className="font-semibold text-gray-900">{getCurrentPeriod()}</p>
            <p className={`text-sm ${getIconColorClass(currentCongestion.color)}`}>{currentCongestion.level}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-warning bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="text-warning h-6 w-6" />
            </div>
            <p className="font-semibold text-gray-900">Peak Hours</p>
            <p className="text-sm text-warning">High Congestion</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Moon className="text-success h-6 w-6" />
            </div>
            <p className="font-semibold text-gray-900">Evening (9+ PM)</p>
            <p className="text-sm text-success">Low Congestion</p>
          </div>
        </div>
        
        {/* Hourly timeline */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Next 12 Hours</h4>
          
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {data.slice(0, 12).map((forecast, index) => (
              <div key={`${forecast.hour}-${index}`} className="text-center">
                <div
                  className={`rounded mb-1 ${getBarColorClass(forecast.congestionColor)}`}
                  style={{ 
                    height: `${Math.max(forecast.barHeight * 0.8, 16)}px`,
                    maxHeight: '80px'
                  }}
                />
                <span className="text-xs text-gray-500">{formatHour(forecast.hour)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <Info className="inline mr-1 h-4 w-4" />
            <strong>Recommendation:</strong> Best departure times are before 5 PM or after 9 PM to avoid peak congestion.
          </p>
        </div>
      </div>
    </section>
  );
}