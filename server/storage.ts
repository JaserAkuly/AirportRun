import { 
  userPreferences, 
  tsaWaitTimes, 
  flightDepartures, 
  parkingAvailability, 
  congestionForecast,
  type UserPreferences, 
  type InsertUserPreferences,
  type TSAWaitTime,
  type FlightDeparture,
  type ParkingAvailability,
  type CongestionForecast,
  type DashboardData
} from "@shared/schema";

export interface IStorage {
  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;
  
  // TSA wait times
  updateTSAWaitTimes(waitTimes: Omit<TSAWaitTime, 'id' | 'updatedAt'>[]): Promise<void>;
  getTSAWaitTimes(): Promise<TSAWaitTime[]>;
  
  // Flight departures
  updateFlightDepartures(departures: Omit<FlightDeparture, 'id' | 'updatedAt'>[]): Promise<void>;
  getFlightDepartures(): Promise<FlightDeparture[]>;
  
  // Parking availability
  updateParkingAvailability(parking: Omit<ParkingAvailability, 'id' | 'updatedAt'>[]): Promise<void>;
  getParkingAvailability(): Promise<ParkingAvailability[]>;
  
  // Congestion forecast
  updateCongestionForecast(forecast: Omit<CongestionForecast, 'id' | 'updatedAt'>[]): Promise<void>;
  getCongestionForecast(): Promise<CongestionForecast[]>;
  
  // Dashboard data
  getDashboardData(): Promise<DashboardData>;
}

export class MemStorage implements IStorage {
  private userPrefs: Map<string, UserPreferences> = new Map();
  private tsaData: TSAWaitTime[] = [];
  private flightData: FlightDeparture[] = [];
  private parkingData: ParkingAvailability[] = [];
  private forecastData: CongestionForecast[] = [];
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
      tsaWaitAlerts: preferences.tsaWaitAlerts ?? existing?.tsaWaitAlerts ?? true,
      flightDelayAlerts: preferences.flightDelayAlerts ?? existing?.flightDelayAlerts ?? false,
      parkingAlerts: preferences.parkingAlerts ?? existing?.parkingAlerts ?? true,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.userPrefs.set(userId, userPref);
    return userPref;
  }

  async updateTSAWaitTimes(waitTimes: Omit<TSAWaitTime, 'id' | 'updatedAt'>[]): Promise<void> {
    this.tsaData = waitTimes.map(wt => ({
      ...wt,
      id: this.currentId++,
      updatedAt: new Date(),
    }));
  }

  async getTSAWaitTimes(): Promise<TSAWaitTime[]> {
    return this.tsaData;
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

  async getDashboardData(): Promise<DashboardData> {
    const flightDepartures = await this.getFlightDepartures();
    const onTimeFlights = flightDepartures.filter(f => f.status === "On Time").length;
    const onTimePercentage = flightDepartures.length > 0 ? Math.round((onTimeFlights / flightDepartures.length) * 100) : 0;
    
    const delayedFlights = flightDepartures.filter(f => f.delayMinutes > 0);
    const averageDelay = delayedFlights.length > 0 
      ? Math.round(delayedFlights.reduce((sum, f) => sum + f.delayMinutes, 0) / delayedFlights.length)
      : 0;

    return {
      tsaWaitTimes: await this.getTSAWaitTimes(),
      flightDepartures,
      parkingAvailability: await this.getParkingAvailability(),
      congestionForecast: await this.getCongestionForecast(),
      onTimePercentage,
      averageDelay,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const storage = new MemStorage();
