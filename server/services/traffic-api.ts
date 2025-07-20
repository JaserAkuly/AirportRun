// Traffic service to provide DFW area traffic conditions
import type { TrafficCondition } from "@shared/schema";

export class TrafficService {
  async getTrafficConditions(): Promise<Omit<TrafficCondition, 'id' | 'updatedAt'>[]> {
    try {
      // In a real implementation, this would call traffic APIs like Google Maps, Waze, or TxDOT
      // For now, we'll provide realistic data based on DFW area traffic patterns and construction

      return [
        {
          route: "I-635 to DFW",
          status: "Heavy Traffic",
          statusColor: "warning",
          travelTime: 35,
          normalTime: 22,
          incidents: [
            "Construction lane closures between Belt Line Rd and DFW exits",
            "Heavy congestion at Terminal C/D exits"
          ]
        },
        {
          route: "I-35E to DFW",
          status: "Moderate Delays",
          statusColor: "warning", 
          travelTime: 28,
          normalTime: 20,
          incidents: [
            "Airport construction causing backup at Terminal A/B exits"
          ]
        },
        {
          route: "Highway 121 to DFW",
          status: "Free Flow",
          statusColor: "success",
          travelTime: 15,
          normalTime: 15,
          incidents: []
        },
        {
          route: "State Highway 114 to DFW",
          status: "Light Traffic",
          statusColor: "success",
          travelTime: 18,
          normalTime: 16,
          incidents: []
        },
        {
          route: "I-30 to DFW",
          status: "Heavy Traffic", 
          statusColor: "error",
          travelTime: 42,
          normalTime: 25,
          incidents: [
            "Major construction on I-30 eastbound near DFW exits",
            "Lane closures affecting Terminal E access"
          ]
        }
      ];

    } catch (error) {
      console.error("Error fetching traffic conditions:", error);
      
      // Return fallback data
      return [
        {
          route: "Major Routes to DFW",
          status: "Data Unavailable",
          statusColor: "warning",
          travelTime: 25,
          normalTime: 20,
          incidents: ["Traffic data temporarily unavailable"]
        }
      ];
    }
  }
}

export const trafficService = new TrafficService();