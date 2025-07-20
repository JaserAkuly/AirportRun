import { Cloud, Eye, Wind, Thermometer, Droplets, Plane } from "lucide-react";

interface WeatherData {
  temperature: number;
  conditions: string;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  humidity: number;
  pressure: number;
  flightImpact: string;
  flightImpactColor: string;
}

interface WeatherConditionsProps {
  data: WeatherData[];
}

export default function WeatherConditions({ data }: WeatherConditionsProps) {
  if (!data || data.length === 0) return null;
  
  const weather = data[0]; // Current weather
  
  const getImpactColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  const getImpactTextColorClass = (color: string) => {
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
          <Cloud className="text-primary mr-3 h-6 w-6" />
          Current Weather at DFW
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-1" />
          <span>Live</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Flight Impact Alert */}
        <div className={`p-4 border-b border-gray-100 ${getImpactColorClass(weather.flightImpactColor)} bg-opacity-10`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getImpactColorClass(weather.flightImpactColor)} bg-opacity-20`}>
              <Plane className={`h-5 w-5 ${getImpactTextColorClass(weather.flightImpactColor)}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Flight Impact</h3>
              <p className={`text-sm ${getImpactTextColorClass(weather.flightImpactColor)}`}>
                {weather.flightImpact}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Thermometer className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{weather.temperature}°F</p>
            <p className="text-sm text-gray-500">{weather.conditions}</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Wind className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{weather.windSpeed} mph</p>
            <p className="text-sm text-gray-500">{weather.windDirection}</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{weather.visibility} mi</p>
            <p className="text-sm text-gray-500">Visibility</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Droplets className="h-6 w-6 text-cyan-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{weather.humidity}%</p>
            <p className="text-sm text-gray-500">Humidity</p>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 border-t border-gray-100">
          <p className="text-sm text-blue-800">
            <Cloud className="inline mr-1 h-4 w-4" />
            Weather conditions directly impact flight operations, including delays and cancellations at DFW.
          </p>
        </div>
      </div>
    </section>
  );
}