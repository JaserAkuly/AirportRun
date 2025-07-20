import { Car, Building, Bus } from "lucide-react";
import type { ParkingAvailability } from "@shared/schema";

interface ParkingAvailabilityProps {
  data: ParkingAvailability[];
}

export default function ParkingAvailability({ data }: ParkingAvailabilityProps) {
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

  const terminalParking = data.filter(p => p.category === 'terminal');
  const otherParking = data.filter(p => p.category !== 'terminal');

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Car className="text-primary mr-3 h-6 w-6" />
          Parking Availability
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-success rounded-full mr-1" />
          <span>Live</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Terminal Parking */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Building className="text-gray-400 mr-2 h-4 w-4" />
            Terminal Parking
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {terminalParking.map((lot) => (
              <div key={lot.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{lot.location}</p>
                  <p className="text-xs text-gray-500">${lot.dailyRate}/day</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColorClass(lot.statusColor)}`} />
                  <span className={`text-sm font-medium ${getStatusTextColorClass(lot.statusColor)}`}>
                    {lot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Express & Remote Parking */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Bus className="text-gray-400 mr-2 h-4 w-4" />
            Express & Remote
          </h3>
          
          <div className="space-y-3">
            {otherParking.map((lot) => (
              <div key={lot.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{lot.location}</p>
                  <p className="text-xs text-gray-500">
                    ${lot.dailyRate}/day{lot.shuttleRequired ? ' • Bus included' : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColorClass(lot.statusColor)}`} />
                  <span className={`text-sm font-medium ${getStatusTextColorClass(lot.statusColor)}`}>
                    {lot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 flex items-center">
          <Car className="inline mr-1 h-4 w-4" />
          <span className="font-medium">Parking Data Sources:</span>
          <span className="ml-1">
            Terminal parking availability scraped from DFW.com real-time status. 
            Express and Remote lots include shuttle schedules and current capacity from official DFW parking APIs.
          </span>
        </p>
      </div>
    </section>
  );
}