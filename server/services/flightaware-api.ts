import { FlightDeparture } from "@shared/schema";

interface FlightAwareResponse {
  departures?: Array<{
    ident: string;
    ident_iata?: string;
    destination?: { code?: string; city?: string; name?: string };
    scheduled_out?: string;
    estimated_out?: string;
    actual_out?: string;
    status?: string;
    operator_iata?: string;
    flight_number?: string;
  }>;
}

export class FlightAwareService {
  private readonly apiKey = process.env.FLIGHTAWARE_API_KEY || "";
  private readonly baseUrl = "https://aeroapi.flightaware.com/aeroapi";
  
  constructor() {
    console.log('FlightAware service initialized. API key available:', this.apiKey ? 'YES' : 'NO');
  }
  
  async getFlightDepartures(): Promise<Omit<FlightDeparture, 'id' | 'updatedAt'>[]> {
    if (!this.apiKey) {
      console.warn('FlightAware API key not found, returning fallback data');
      return this.getFallbackFlightData();
    }
    
    console.log('FlightAware API key found, fetching live data from DFW...');
    
    try {
      const response = await fetch(`${this.baseUrl}/airports/KDFW/flights/departures?max_pages=1&howMany=12`, {
        headers: {
          'x-apikey': this.apiKey,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`FlightAware API error: ${response.statusText}`);
      }
      
      const data: FlightAwareResponse = await response.json();
      console.log('FlightAware API response received:', data.departures ? data.departures.length : 0, 'flights');
      
      if (!data.departures || data.departures.length === 0) {
        console.log('No departure data available, using fallback');
        return this.getFallbackFlightData();
      }
      
      // Process up to 8 recent departures
      const departures: Omit<FlightDeparture, 'id' | 'updatedAt'>[] = data.departures.slice(0, 8).map(flight => {
        const scheduledTime = flight.scheduled_out ? new Date(flight.scheduled_out) : new Date();
        const estimatedTime = flight.estimated_out ? new Date(flight.estimated_out) : null;
        const actualTime = flight.actual_out ? new Date(flight.actual_out) : null;
        
        // Calculate delay
        const compareTime = actualTime || estimatedTime || scheduledTime;
        const delayMinutes = Math.max(0, Math.round((compareTime.getTime() - scheduledTime.getTime()) / (1000 * 60)));
        
        // Determine status
        let status: string;
        let statusColor: string;
        
        if (delayMinutes === 0) {
          status = "On Time";
          statusColor = "success";
        } else if (delayMinutes <= 30) {
          status = `Delayed ${delayMinutes}m`;
          statusColor = "warning";
        } else {
          status = `Delayed ${delayMinutes}m`;
          statusColor = "error";
        }
        
        return {
          flightNumber: flight.ident_iata || flight.ident || "Unknown",
          destination: flight.destination?.code || flight.destination?.city || "Unknown",
          departureTime: scheduledTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          status,
          statusColor,
          delayMinutes,
        };
      });
      
      return departures;
    } catch (error) {
      console.error('Error fetching flight departures:', error);
      return this.getFallbackFlightData();
    }
  }
  
  private getFallbackFlightData(): Omit<FlightDeparture, 'id' | 'updatedAt'>[] {
    const now = new Date();
    const flights = [
      { flightNumber: "AA 1423", destination: "LAX", delay: 0 },
      { flightNumber: "UA 892", destination: "ORD", delay: 15 },
      { flightNumber: "DL 1156", destination: "ATL", delay: 45 },
      { flightNumber: "SW 2047", destination: "PHX", delay: 0 },
      { flightNumber: "AA 2891", destination: "JFK", delay: 5 },
      { flightNumber: "UA 1654", destination: "SFO", delay: 0 },
      { flightNumber: "DL 2234", destination: "LAX", delay: 30 },
      { flightNumber: "SW 1877", destination: "LAS", delay: 0 },
    ];
    
    return flights.map((flight, index) => {
      const departureTime = new Date(now.getTime() + (index * 15 + 15) * 60000); // 15 min intervals
      
      let status: string;
      let statusColor: string;
      
      if (flight.delay === 0) {
        status = "On Time";
        statusColor = "success";
      } else if (flight.delay <= 30) {
        status = `Delayed ${flight.delay}m`;
        statusColor = "warning";
      } else {
        status = `Delayed ${flight.delay}m`;
        statusColor = "error";
      }
      
      return {
        flightNumber: flight.flightNumber,
        destination: flight.destination,
        departureTime: departureTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        status,
        statusColor,
        delayMinutes: flight.delay,
      };
    });
  }
}

export const flightAwareService = new FlightAwareService();
