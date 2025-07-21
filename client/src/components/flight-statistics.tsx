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
      
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-4">
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

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-xs text-gray-500">Avg Delay</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{averageDelay}m</p>
              <p className="text-xs text-orange-600">Worst: AA5621 (85min)</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Plane className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-xs text-gray-500">Cancelled</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{cancellations}</p>
              <p className="text-xs text-red-600">See details below</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{totalFlights}</p>
              <p className="text-xs text-blue-600">Daily operations</p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cancelled Flights */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Plane className="h-5 w-5 text-red-600 mr-2" />
              Today's Cancellations
            </h4>
            <div className="max-h-64 overflow-y-auto space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">AA2847</p>
                  <p className="text-xs text-gray-600">American Airlines</p>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Engine Issue</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">DL1205</p>
                  <p className="text-xs text-gray-600">Delta Airlines</p>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Weather</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">UA3452</p>
                  <p className="text-xs text-gray-600">United Airlines</p>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Crew</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">WN7890</p>
                  <p className="text-xs text-gray-600">Southwest Airlines</p>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Maintenance</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">B61234</p>
                  <p className="text-xs text-gray-600">JetBlue Airways</p>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Air Traffic</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">F92156</p>
                  <p className="text-xs text-gray-600">Frontier Airlines</p>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Crew</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">NK485</p>
                  <p className="text-xs text-gray-600">Spirit Airlines</p>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Weather</span>
              </div>
            </div>
          </div>

          {/* Airline Breakdown */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              Airline Operations
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">American Airlines</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">142 flights</p>
                  <p className="text-xs text-gray-500">31% of total</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Delta Airlines</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">89 flights</p>
                  <p className="text-xs text-gray-500">20% of total</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">United Airlines</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">76 flights</p>
                  <p className="text-xs text-gray-500">17% of total</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Southwest Airlines</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">58 flights</p>
                  <p className="text-xs text-gray-500">13% of total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}