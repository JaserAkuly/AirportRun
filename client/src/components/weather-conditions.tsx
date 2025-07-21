import { Cloud, CloudRain, Zap, Wind, Eye, Thermometer, Droplets } from 'lucide-react';

interface WeatherCondition {
  id: string;
  type: 'clear' | 'rain' | 'thunderstorm' | 'snow' | 'fog' | 'wind';
  severity: 'low' | 'moderate' | 'high' | 'severe';
  title: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  flightImpact: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
  impactDescription: string;
  timestamp: string;
}

interface WeatherAlert {
  id: string;
  type: 'advisory' | 'watch' | 'warning' | 'emergency';
  title: string;
  description: string;
  validUntil: string;
  flightImpact: string;
}

interface WeatherConditionsProps {
  current: WeatherCondition;
  alerts: WeatherAlert[];
}

export default function WeatherConditions({ current, alerts }: WeatherConditionsProps) {
  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'clear': return Cloud;
      case 'rain': return CloudRain;
      case 'thunderstorm': return Zap;
      case 'wind': return Wind;
      case 'fog': return Eye;
      default: return Cloud;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'none': return 'text-green-600 bg-green-50 border-green-200';
      case 'minimal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'significant': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'advisory': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'watch': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'warning': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'emergency': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const WeatherIcon = getWeatherIcon(current.type);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <WeatherIcon className="text-primary mr-3 h-6 w-6" />
          Weather Impact
        </h2>
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-gray-200/50">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-700">Live</span>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
        {/* Current Conditions */}
        <div className="p-6 border-b border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Weather Info */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getImpactColor(current.flightImpact)}`}>
                  <WeatherIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{current.title}</h3>
                  <p className="text-sm text-gray-600">{current.description}</p>
                </div>
              </div>
              
              {/* Flight Impact */}
              <div className={`p-3 rounded-lg border ${getImpactColor(current.flightImpact)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Flight Impact</span>
                  <span className="text-xs font-bold uppercase">{current.flightImpact}</span>
                </div>
                <p className="text-sm">{current.impactDescription}</p>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-600">Temperature</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{current.temperature}°F</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-600">Wind</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{current.windSpeed} mph</p>
                <p className="text-xs text-gray-500">{current.windDirection}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">Humidity</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{current.humidity}%</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">Visibility</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{current.visibility} mi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Active Weather Alerts</h4>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold uppercase">{alert.type}</span>
                        <span className="text-xs text-gray-500">
                          Valid until {new Date(alert.validUntil).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <h5 className="font-semibold">{alert.title}</h5>
                      <p className="text-sm mt-1">{alert.description}</p>
                      <p className="text-sm font-medium mt-2">Impact: {alert.flightImpact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}