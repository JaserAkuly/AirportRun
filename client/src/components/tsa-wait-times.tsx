import { Shield, Clock } from "lucide-react";
import type { TSAWaitTime } from "@shared/schema";

interface TSAWaitTimesProps {
  data: TSAWaitTime[];
}

export default function TSAWaitTimes({ data }: TSAWaitTimesProps) {
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

  const getProgressColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="text-primary mr-3 h-6 w-6" />
          TSA Security Wait Times
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          <span>Real-time</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {data.map((terminal) => (
          <div
            key={terminal.terminal}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{terminal.terminal}</h3>
              <div className={`w-3 h-3 rounded-full ${getStatusColorClass(terminal.statusColor)}`} />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">
                  {terminal.waitTimeMinutes > 0 ? terminal.waitTimeMinutes : "--"}
                </span>
                <span className="text-sm text-gray-500 ml-1">min</span>
              </div>
              <p className={`text-xs font-medium ${getStatusTextColorClass(terminal.statusColor)}`}>
                {terminal.status}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${getProgressColorClass(terminal.statusColor)}`}
                  style={{ width: `${terminal.loadPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}