import { TrendingUp, Info, Plane, Car, Clock } from "lucide-react";
import type { CongestionForecast } from "@shared/schema";

interface CongestionForecastProps {
  data: CongestionForecast[];
}

export default function CongestionForecast({ data }: CongestionForecastProps) {
  const getBarColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getRecommendation = () => {
    const sortedData = [...data].sort((a, b) => a.barHeight - b.barHeight);
    const lightestHours = sortedData.slice(0, 3);
    const heaviestHours = sortedData.slice(-3);
    
    const lightTimes = lightestHours.map(d => formatHour(d.hour)).join(", ");
    const heavyTimes = heaviestHours.map(d => formatHour(d.hour)).join(", ");
    
    return {
      best: lightTimes,
      avoid: heavyTimes
    };
  };

  const recommendation = getRecommendation();

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="text-primary mr-3 h-6 w-6" />
          12-Hour Congestion Forecast
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-1" />
          <span>AI Analysis</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Hourly Bar Chart */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Hourly Congestion Levels</h4>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                <span>High</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {data.slice(0, 12).map((forecast, index) => (
              <div key={`${forecast.hour}-${index}`} className="text-center">
                <div className="h-20 flex flex-col justify-end mb-2">
                  <div
                    className={`rounded-t transition-all duration-300 ${getBarColorClass(forecast.congestionColor)}`}
                    style={{ 
                      height: `${Math.max(forecast.barHeight * 0.8, 12)}%`,
                    }}
                    title={`${formatHour(forecast.hour)}: ${forecast.congestionLevel} congestion (${forecast.barHeight}%)`}
                  />
                </div>
                <span className="text-xs text-gray-500">{formatHour(forecast.hour)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Plane className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Flight Traffic</span>
            </div>
            <p className="text-sm text-blue-800">Analysis based on departure/arrival patterns from FlightAware data</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Car className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-900">Parking Impact</span>
            </div>
            <p className="text-sm text-green-800">Parking availability and terminal access patterns included</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-medium text-purple-900">Traffic Conditions</span>
            </div>
            <p className="text-sm text-purple-800">Airport roadway and construction data factored in</p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 mb-2">
                <strong>AI Recommendations:</strong>
              </p>
              <p className="text-sm text-blue-700 mb-1">
                <strong>Best times to travel:</strong> {recommendation.best}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Avoid if possible:</strong> {recommendation.avoid}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}