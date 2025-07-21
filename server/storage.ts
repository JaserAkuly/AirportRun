import { 
  userPreferences, 
  flightDepartures, 
  parkingAvailability, 
  congestionForecast,
  trafficConditions,
  airportAlerts,
  crowdTips,
  notificationPreferences,
  type UserPreferences, 
  type InsertUserPreferences,
  type FlightDeparture,
  type ParkingAvailability,
  type CongestionForecast,
  type TrafficCondition,
  type AirportAlert,
  type CrowdTip,
  type DashboardData,
  type NotificationPreferences,
  type InsertNotificationPreferences
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
  
  // Airport alerts
  updateAirportAlerts(alerts: Omit<AirportAlert, 'id' | 'updatedAt'>[]): Promise<void>;
  getAirportAlerts(): Promise<AirportAlert[]>;
  
  // Crowd-sourced tips
  updateCrowdTips(tips: Omit<CrowdTip, 'id' | 'updatedAt'>[]): Promise<void>;
  getCrowdTips(): Promise<CrowdTip[]>;
  
  // Dashboard data
  getDashboardData(): Promise<DashboardData>;
  
  // Notification preferences
  getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined>;
  upsertNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences>;
  getAllNotificationPreferences(): Promise<NotificationPreferences[]>;
}

export class MemStorage implements IStorage {
  private userPrefs: Map<string, UserPreferences> = new Map();
  private flightData: FlightDeparture[] = [];
  private parkingData: ParkingAvailability[] = [];
  private forecastData: CongestionForecast[] = [];
  private trafficData: TrafficCondition[] = [];
  private alertsData: AirportAlert[] = [];
  private crowdTipsData: CrowdTip[] = [];
  private notificationPrefs: Map<string, NotificationPreferences> = new Map();
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

  async updateAirportAlerts(alerts: Omit<AirportAlert, 'id' | 'updatedAt'>[]): Promise<void> {
    this.alertsData = alerts.map(alert => ({
      ...alert,
      id: this.currentId++,
      updatedAt: new Date(),
    }));
  }

  async getAirportAlerts(): Promise<AirportAlert[]> {
    return this.alertsData;
  }

  async updateCrowdTips(tips: Omit<CrowdTip, 'id' | 'updatedAt'>[]): Promise<void> {
    this.crowdTipsData = tips.map(tip => ({
      ...tip,
      id: this.currentId++,
      updatedAt: new Date(),
    }));
  }

  async getCrowdTips(): Promise<CrowdTip[]> {
    return this.crowdTipsData;
  }

  async getDashboardData(): Promise<DashboardData> {
    const flightDepartures = await this.getFlightDepartures();
    
    // Calculate real statistics if we have departure data, otherwise use simulated airport-wide data
    let onTimePercentage: number;
    let averageDelay: number;
    let cancellations: number;
    
    if (flightDepartures.length > 0) {
      const onTimeFlights = flightDepartures.filter(f => f.status === "On Time").length;
      onTimePercentage = Math.round((onTimeFlights / flightDepartures.length) * 100);
      
      const delayedFlights = flightDepartures.filter(f => f.delayMinutes && f.delayMinutes > 0);
      averageDelay = delayedFlights.length > 0 
        ? Math.round(delayedFlights.reduce((sum, f) => sum + (f.delayMinutes || 0), 0) / delayedFlights.length)
        : 0;

      cancellations = flightDepartures.filter(f => f.status === "Cancelled").length;
    } else {
      // Simulated realistic airport-wide statistics for DFW
      onTimePercentage = 78; // Typical DFW on-time performance
      averageDelay = 18; // Average delay in minutes
      cancellations = 5; // Daily cancellations
    }

    return {
      flightDepartures,
      parkingAvailability: await this.getParkingAvailability(),
      congestionForecast: await this.getCongestionForecast(),
      trafficConditions: await this.getTrafficConditions(),
      airportAlerts: await this.getAirportAlerts(),
      crowdTips: await this.getCrowdTips(),
      onTimePercentage,
      averageDelay,
      cancellations,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Notification preferences methods
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    return this.notificationPrefs.get(userId);
  }

  async upsertNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const existing = this.notificationPrefs.get(preferences.userId!);
    const notificationPref: NotificationPreferences = {
      id: existing?.id || this.currentId++,
      userId: preferences.userId!,
      delayThreshold: preferences.delayThreshold ?? 30,
      notificationsEnabled: preferences.notificationsEnabled ?? true,
      preferredTerminals: preferences.preferredTerminals ?? null,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.notificationPrefs.set(preferences.userId!, notificationPref);
    return notificationPref;
  }

  async getAllNotificationPreferences(): Promise<NotificationPreferences[]> {
    return Array.from(this.notificationPrefs.values());
  }
}

export const storage = new MemStorage();
