import { BarChart3, TrendingUp, TrendingDown, Plane } from "lucide-react";

interface FlightStatisticsProps {
  onTimePercentage: number;
  averageDelay: number;
  cancellations: number;
  totalFlights: number;
}

export default function FlightStatistics({ 
  onTimePercentage, 
  averageDelay, 
  cancellations,
  totalFlights = 450 // Simulated total daily flights at DFW
}: FlightStatisticsProps) {
  const delayedFlights = Math.round((totalFlights * (100 - onTimePercentage)) / 100) - cancellations;
  const onTimeFlights = totalFlights - delayedFlights - cancellations;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="text-primary mr-3 h-6 w-6" />
          Today's Flight Performance
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-success rounded-full mr-1" />
          <span>Live</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On Time Percentage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">On Time</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{onTimePercentage}%</p>
            <p className="text-xs text-gray-600">{onTimeFlights} flights</p>
          </div>
        </div>

        {/* Average Delay */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Avg Delay</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{averageDelay}m</p>
            <p className="text-xs text-gray-600">{delayedFlights} delayed</p>
          </div>
        </div>

        {/* Cancellations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Plane className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-xs text-gray-500">Cancelled</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{cancellations}</p>
            <p className="text-xs text-gray-600">{((cancellations / totalFlights) * 100).toFixed(1)}% of total</p>
          </div>
        </div>

        {/* Total Operations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{totalFlights}</p>
            <p className="text-xs text-gray-600">flights today</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">On-Time Performance</p>
              <p className="text-xs text-gray-600">
                {onTimePercentage >= 80 ? 'Excellent' : onTimePercentage >= 70 ? 'Good' : 'Below Average'} compared to industry standard
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Delay Impact</p>
              <p className="text-xs text-gray-600">
                {averageDelay <= 15 ? 'Minimal delays' : averageDelay <= 30 ? 'Moderate delays' : 'Significant delays'} airport-wide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}