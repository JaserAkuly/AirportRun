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
    
    // Calculate flight counts for context
    const lightFlightCount = lightestHours.reduce((sum, d) => sum + (d.flightCount || 0), 0);
    const heavyFlightCount = heaviestHours.reduce((sum, d) => sum + (d.flightCount || 0), 0);
    
    const lightTimes = lightestHours.map(d => formatHour(d.hour)).join(", ");
    const heavyTimes = heaviestHours.map(d => formatHour(d.hour)).join(", ");
    
    return {
      best: lightTimes,
      avoid: heavyTimes,
      lightFlightCount,
      heavyFlightCount
    };
  };

  const recommendation = getRecommendation();

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="text-primary mr-3 h-6 w-6" />
          Today's Vibes
        </h2>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
        {/* Visual Flight Activity Chart */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700">85</div>
              <div className="text-sm text-green-600">flights departing</div>
              <div className="text-xs text-green-500 mt-1">4AM-6AM, 10PM-12AM</div>
              <div className="mt-2 h-2 bg-green-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-700">180</div>
              <div className="text-sm text-yellow-600">flights departing</div>
              <div className="text-xs text-yellow-500 mt-1">9AM-4PM, 8PM-10PM</div>
              <div className="mt-2 h-2 bg-yellow-200 rounded-full">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">285</div>
              <div className="text-sm text-red-600">flights departing</div>
              <div className="text-xs text-red-500 mt-1">6AM-9AM, 4PM-8PM</div>
              <div className="mt-2 h-2 bg-red-200 rounded-full">
                <div className="h-2 bg-red-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Info className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-900">Best Travel Times Today</span>
            </div>
            <p className="text-sm text-green-800 mb-1">{recommendation.best}</p>
            <p className="text-xs text-green-600">
              {recommendation.lightFlightCount} total departures/arrivals during these hours
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Info className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-medium text-red-900">Avoid These Times Today</span>
            </div>
            <p className="text-sm text-red-800 mb-1">{recommendation.avoid}</p>
            <p className="text-xs text-red-600">
              {recommendation.heavyFlightCount} total departures/arrivals during these hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}