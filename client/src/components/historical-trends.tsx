import { TrendingUp, BarChart3, Clock, Target } from "lucide-react";

interface HistoricalTrendsProps {
  data: {
    busiest: { hour: number; avgCongestion: number };
    quietest: { hour: number; avgCongestion: number };
    averageDelay: number;
    reliabilityScore: number;
  } | null;
}

export default function HistoricalTrends({ data }: HistoricalTrendsProps) {
  if (!data) return null;

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="text-primary mr-3 h-6 w-6" />
          Historical Insights
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
          <span>90-day analysis</span>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Peak Times Analysis */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <TrendingUp className="text-gray-400 mr-2 h-4 w-4" />
              Peak Analysis
            </h3>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900">Busiest Hour</p>
                  <p className="text-lg font-bold text-red-700">{formatHour(data.busiest.hour)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-600">Avg Congestion</p>
                  <p className="text-lg font-bold text-red-700">{data.busiest.avgCongestion}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">Quietest Hour</p>
                  <p className="text-lg font-bold text-green-700">{formatHour(data.quietest.hour)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Avg Congestion</p>
                  <p className="text-lg font-bold text-green-700">{data.quietest.avgCongestion}%</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Target className="text-gray-400 mr-2 h-4 w-4" />
              Performance Metrics
            </h3>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Average Delay</p>
                  <p className="text-lg font-bold text-blue-700">{data.averageDelay} min</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Reliability Score</p>
                  <p className={`text-lg font-bold ${getReliabilityColor(data.reliabilityScore)}`}>
                    {data.reliabilityScore}%
                  </p>
                </div>
                <BarChart3 className={`h-8 w-8 ${getReliabilityColor(data.reliabilityScore).replace('text-', 'text-')}`} />
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      data.reliabilityScore >= 80 ? 'bg-green-500' : 
                      data.reliabilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${data.reliabilityScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {data.reliabilityScore >= 80 ? 'Highly reliable' : 
                   data.reliabilityScore >= 60 ? 'Moderately reliable' : 'Variable patterns'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-2">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800">
                <span className="font-medium">Best time differential:</span> {Math.abs(data.busiest.avgCongestion - data.quietest.avgCongestion)}% less congestion during quiet hours
              </p>
            </div>
            <div>
              <p className="text-blue-800">
                <span className="font-medium">Prediction accuracy:</span> {data.reliabilityScore}% based on historical patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}