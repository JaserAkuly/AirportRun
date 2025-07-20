import { PlaneTakeoff, RotateCcw } from "lucide-react";
import type { FlightDeparture } from "@shared/schema";

interface FlightDeparturesProps {
  data: FlightDeparture[];
  onTimePercentage: number;
  averageDelay: number;
  cancellations: number;
}

export default function FlightDepartures({ data, onTimePercentage, averageDelay, cancellations }: FlightDeparturesProps) {
  const getStatusColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  const getStatusTextColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-gray-600';
    }
  };

  // The backend already filters to next 5 flights in 2-3 hours, so display all data
  const displayedFlights = data;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <PlaneTakeoff className="text-primary mr-3 h-6 w-6" />
          Next 5 Departing Flights
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <RotateCcw className="mr-1 h-4 w-4" />
          <span>Live</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <span className="text-success text-sm font-bold">{onTimePercentage}%</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">On Time</p>
                <p className="text-xs text-gray-500">Departures</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                <span className="text-warning text-sm font-bold">{averageDelay}</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Avg Delay</p>
                <p className="text-xs text-gray-500">Minutes</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-error bg-opacity-10 rounded-lg flex items-center justify-center">
                <span className="text-error text-sm font-bold">{cancellations}</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Cancelled</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {displayedFlights.map((flight, index) => (
            <div key={`${flight.flightNumber}-${index}`} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${getStatusColorClass(flight.statusColor)}`} />
                <div>
                  <p className="font-semibold text-gray-900">{flight.flightNumber}</p>
                  <p className="text-sm text-gray-500">
                    to {flight.destination}
                    {flight.gate && ` • Gate ${flight.gate}`}
                    {flight.terminal && ` • ${flight.terminal}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{flight.departureTime}</p>
                <p className={`text-xs ${getStatusTextColorClass(flight.statusColor)}`}>
                  {flight.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}