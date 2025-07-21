import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plane, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import FlightDepartures from "../components/flight-departures";
import ParkingAvailability from "../components/parking-availability";
import CongestionForecast from "../components/congestion-forecast";
import TrafficConditions from "../components/traffic-conditions";
import AirportAlerts from "../components/airport-alerts";
import CrowdSourcedTips from "../components/crowd-sourced-tips";
import FlightStatistics from "../components/flight-statistics";
import NotificationSettings from "../components/notification-settings";

import type { DashboardData } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set());

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    refetchIntervalInBackground: true,
  });

  const handleRefresh = async () => {
    try {
      await apiRequest("POST", "/api/refresh");
      await refetch();
      toast({
        title: "Data refreshed",
        description: "All data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getLastUpdatedText = () => {
    if (!dashboardData?.lastUpdated) return "Unknown";
    
    const lastUpdated = new Date(dashboardData.lastUpdated);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60));
    
    if (diffMinutes === 0) return "Just now";
    if (diffMinutes === 1) return "1 min ago";
    return `${diffMinutes} min ago`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load data</h2>
          <p className="text-gray-600 mb-6">There was an error loading the dashboard data.</p>
          <Button onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Plane className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DFW Tracker</h1>
                <p className="text-xs text-gray-500">Dallas/Fort Worth Int'l</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationSettings />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefetching}
                className="text-primary hover:text-blue-700"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
                <p className="text-xs text-gray-400">Updated {getLastUpdatedText()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading airport data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Airport Alerts - Critical information first */}
            <AirportAlerts 
              data={(dashboardData?.airportAlerts || []).filter(alert => !dismissedAlerts.has(alert.id))} 
              onDismiss={(alertId) => {
                setDismissedAlerts(prev => new Set(Array.from(prev).concat(alertId)));
              }}
            />

            {/* 12-Hour Congestion Forecast - Top Priority */}
            <div className="mb-8">
              <CongestionForecast data={dashboardData?.congestionForecast || []} />
            </div>

            {/* Parking Availability */}
            <div className="mb-8">
              <ParkingAvailability data={dashboardData?.parkingAvailability || []} />
            </div>

            {/* Traffic Conditions */}
            <div className="mb-8">
              <TrafficConditions data={dashboardData?.trafficConditions || []} />
            </div>

            {/* Crowd-Sourced Tips */}
            <CrowdSourcedTips data={dashboardData?.crowdTips || []} />

            {/* Flight Statistics */}
            <FlightStatistics 
              onTimePercentage={dashboardData?.onTimePercentage || 78}
              averageDelay={dashboardData?.averageDelay || 18}
              cancellations={dashboardData?.cancellations || 5}
              totalFlights={450}
            />


          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefetching}
                className="text-primary hover:text-blue-700"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <div className="text-sm text-gray-500">
                Auto-refresh: <span className="text-success font-medium">Every 5 min</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
