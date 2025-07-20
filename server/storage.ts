import { 
  userPreferences, 
  flightDepartures, 
  parkingAvailability, 
  congestionForecast,
  trafficConditions,
  type UserPreferences, 
  type InsertUserPreferences,
  type FlightDeparture,
  type ParkingAvailability,
  type CongestionForecast,
  type TrafficCondition,
  type DashboardData
} from "@shared/schema";

export interface IStorage {
  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;
  
  // Flight departures
  updateFlightDepartures(departures: Omit<FlightDeparture, 'id' | 'updatedAt'>[]): Promise<void>;
  getFlightDepartures(): Promise<FlightDeparture[]>;
  
  // Parking availability
  updateParkingAvailability(parking: Omit<ParkingAvailability, 'id' | 'updatedAt'>[]): Promise<void>;
  getParkingAvailability(): Promise<ParkingAvailability[]>;
  
  // Congestion forecast
  updateCongestionForecast(forecast: Omit<CongestionForecast, 'id' | 'updatedAt'>[]): Promise<void>;
  getCongestionForecast(): Promise<CongestionForecast[]>;
  
  // Traffic conditions
  updateTrafficConditions(traffic: Omit<TrafficCondition, 'id' | 'updatedAt'>[]): Promise<void>;
  getTrafficConditions(): Promise<TrafficCondition[]>;
  
  // Dashboard data
  getDashboardData(): Promise<DashboardData>;
}

export class MemStorage implements IStorage {
  private userPrefs: Map<string, UserPreferences> = new Map();
  private flightData: FlightDeparture[] = [];
  private parkingData: ParkingAvailability[] = [];
  private forecastData: CongestionForecast[] = [];
  private trafficData: TrafficCondition[] = [];
  private currentId = 1;

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.userPrefs.get(userId);
  }

  async createOrUpdateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const existing = this.userPrefs.get(userId);
    const userPref: UserPreferences = {
      id: existing?.id || this.currentId++,
      userId,
      preferredTerminal: preferences.preferredTerminal || existing?.preferredTerminal || null,
      trafficAlerts: preferences.trafficAlerts ?? existing?.trafficAlerts ?? true,
      flightDelayAlerts: preferences.flightDelayAlerts ?? existing?.flightDelayAlerts ?? false,
      parkingAlerts: preferences.parkingAlerts ?? existing?.parkingAlerts ?? true,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.userPrefs.set(userId, userPref);
    return userPref;
  }



  async updateFlightDepartures(departures: Omit<FlightDeparture, 'id' | 'updatedAt'>[]): Promise<void> {
    this.flightData = departures.map(fd => ({
      ...fd,
      id: this.currentId++,
      updatedAt: new Date(),
    }));
  }

  async getFlightDepartures(): Promise<FlightDeparture[]> {
    return this.flightData;
  }

  async updateParkingAvailability(parking: Omit<ParkingAvailability, 'id' | 'updatedAt'>[]): Promise<void> {
    this.parkingData = parking.map(pa => ({
      ...pa,
      id: this.currentId++,
      updatedAt: new Date(),
    }));
  }

  async getParkingAvailability(): Promise<ParkingAvailability[]> {
    return this.parkingData;
  }

  async updateCongestionForecast(forecast: Omit<CongestionForecast, 'id' | 'updatedAt'>[]): Promise<void> {
    this.forecastData = forecast.map(cf => ({
      ...cf,
      id: this.currentId++,
      updatedAt: new Date(),
    }));
  }

  async getCongestionForecast(): Promise<CongestionForecast[]> {
    return this.forecastData;
  }

  async updateTrafficConditions(traffic: Omit<TrafficCondition, 'id' | 'updatedAt'>[]): Promise<void> {
    this.trafficData = traffic.map(tc => ({
      ...tc,
      id: this.currentId++,
      updatedAt: new Date(),
    }));
  }

  async getTrafficConditions(): Promise<TrafficCondition[]> {
    return this.trafficData;
  }

  async getDashboardData(): Promise<DashboardData> {
    const flightDepartures = await this.getFlightDepartures();
    const onTimeFlights = flightDepartures.filter(f => f.status === "On Time").length;
    const onTimePercentage = flightDepartures.length > 0 ? Math.round((onTimeFlights / flightDepartures.length) * 100) : 0;
    
    const delayedFlights = flightDepartures.filter(f => f.delayMinutes && f.delayMinutes > 0);
    const averageDelay = delayedFlights.length > 0 
      ? Math.round(delayedFlights.reduce((sum, f) => sum + (f.delayMinutes || 0), 0) / delayedFlights.length)
      : 0;

    const cancelledFlights = flightDepartures.filter(f => f.status === "Cancelled").length;

    return {
      flightDepartures,
      parkingAvailability: await this.getParkingAvailability(),
      congestionForecast: await this.getCongestionForecast(),
      trafficConditions: await this.getTrafficConditions(),
      onTimePercentage,
      averageDelay,
      cancellations: cancelledFlights,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const storage = new MemStorage();
