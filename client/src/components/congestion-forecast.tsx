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
        {/* Horizontal Travel Times */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200/50">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-green-700">177</div>
              <div>
                <div className="text-lg font-bold text-green-700">Best Travel Times</div>
                <div className="text-sm text-green-600">4AM-6AM, 10PM-12AM</div>
              </div>
            </div>
            <div className="w-24 h-2 bg-green-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200/50">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-yellow-700">345</div>
              <div>
                <div className="text-lg font-bold text-yellow-700">Avoid These Times</div>
                <div className="text-sm text-yellow-600">9AM-4PM, 8PM-10PM</div>
              </div>
            </div>
            <div className="w-24 h-2 bg-yellow-200 rounded-full">
              <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200/50">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-red-700">597</div>
              <div>
                <div className="text-lg font-bold text-red-700">Peak Chaos</div>
                <div className="text-sm text-red-600">6AM-9AM, 4PM-8PM</div>
              </div>
            </div>
            <div className="w-24 h-2 bg-red-200 rounded-full">
              <div className="h-2 bg-red-500 rounded-full" style={{ width: '100%' }}></div>
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