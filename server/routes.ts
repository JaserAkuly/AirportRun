import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { flightAwareService } from "./services/flightaware-api";
import { parkingScraperService } from "./services/parking-scraper";
import { trafficService } from "./services/traffic-api";
import { alertsService } from "./services/alerts-api";
import { crowdTipsService } from "./services/crowd-tips-api";
import { insertUserPreferencesSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get dashboard data
  app.get("/api/dashboard", async (req, res) => {
    try {
      const dashboardData = await storage.getDashboardData();
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Refresh all data from external APIs
  app.post("/api/refresh", async (req, res) => {
    try {
      // Fetch data from all services concurrently
      const [flightDepartures, parkingAvailability, trafficConditions, airportAlerts, crowdTips] = await Promise.all([
        flightAwareService.getFlightDepartures(),
        parkingScraperService.getParkingAvailability(),
        trafficService.getTrafficConditions(),
        alertsService.getAirportAlerts(),
        crowdTipsService.getCrowdTips(),
      ]);

      // Generate congestion forecast
      const congestionForecast = generateCongestionForecast();

      // Update storage
      await Promise.all([
        storage.updateFlightDepartures(flightDepartures),
        storage.updateParkingAvailability(parkingAvailability),
        storage.updateCongestionForecast(congestionForecast),
        storage.updateTrafficConditions(trafficConditions),
        storage.updateAirportAlerts(airportAlerts),
        storage.updateCrowdTips(crowdTips),
      ]);

      const dashboardData = await storage.getDashboardData();
      res.json(dashboardData);
    } catch (error) {
      console.error("Error refreshing data:", error);
      res.status(500).json({ message: "Failed to refresh data" });
    }
  });

  // User preferences endpoints
  app.get("/api/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = await storage.getUserPreferences(userId);
      
      if (!preferences) {
        return res.status(404).json({ message: "User preferences not found" });
      }
      
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post("/api/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const validatedData = insertUserPreferencesSchema.parse(req.body);
      
      const preferences = await storage.createOrUpdateUserPreferences(userId, validatedData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ message: "Failed to update user preferences" });
    }
  });

  // Initialize data on server start
  setTimeout(async () => {
    try {
      console.log("Initializing data from APIs...");
      const [flightDepartures, parkingAvailability, trafficConditions, airportAlerts, crowdTips] = await Promise.all([
        flightAwareService.getFlightDepartures(),
        parkingScraperService.getParkingAvailability(),
        trafficService.getTrafficConditions(),
        alertsService.getAirportAlerts(),
        crowdTipsService.getCrowdTips(),
      ]);

      const congestionForecast = generateCongestionForecast();

      await Promise.all([
        storage.updateFlightDepartures(flightDepartures),
        storage.updateParkingAvailability(parkingAvailability),
        storage.updateCongestionForecast(congestionForecast),
        storage.updateTrafficConditions(trafficConditions),
        storage.updateAirportAlerts(airportAlerts),
        storage.updateCrowdTips(crowdTips),
      ]);

      console.log("Initial data loaded successfully");
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }, 1000);

  // Auto-refresh every 5 minutes
  setInterval(async () => {
    try {
      console.log("Auto-refreshing data...");
      const [flightDepartures, parkingAvailability, trafficConditions, airportAlerts, crowdTips] = await Promise.all([
        flightAwareService.getFlightDepartures(),
        parkingScraperService.getParkingAvailability(),
        trafficService.getTrafficConditions(),
        alertsService.getAirportAlerts(),
        crowdTipsService.getCrowdTips(),
      ]);

      const congestionForecast = generateCongestionForecast();

      await Promise.all([
        storage.updateFlightDepartures(flightDepartures),
        storage.updateParkingAvailability(parkingAvailability),
        storage.updateCongestionForecast(congestionForecast),
        storage.updateTrafficConditions(trafficConditions),
        storage.updateAirportAlerts(airportAlerts),
        storage.updateCrowdTips(crowdTips),
      ]);

      console.log("Data auto-refresh completed");
    } catch (error) {
      console.error("Error during auto-refresh:", error);
    }
  }, 5 * 60 * 1000); // 5 minutes

  // Notification preferences routes
  app.get('/api/notification-preferences', async (req, res) => {
    try {
      const userId = 'demo-user'; // In a real app, this would come from auth
      const preferences = await storage.getNotificationPreferences(userId);
      
      if (!preferences) {
        // Return default preferences
        return res.json({
          userId,
          delayThreshold: 30,
          notificationsEnabled: false,
          preferredTerminals: null,
        });
      }
      
      res.json(preferences);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      res.status(500).json({ error: 'Failed to fetch preferences' });
    }
  });

  app.post('/api/notification-preferences', async (req, res) => {
    try {
      const { userId, delayThreshold, notificationsEnabled, preferredTerminals } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const preferences = await storage.upsertNotificationPreferences({
        userId,
        delayThreshold,
        notificationsEnabled,
        preferredTerminals,
      });
      
      res.json(preferences);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      res.status(500).json({ error: 'Failed to save preferences' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Generate predictive congestion forecast based on typical airport patterns
function generateCongestionForecast() {
  const now = new Date();
  const currentHour = now.getHours();
  const forecast = [];
  
  for (let i = 0; i < 12; i++) {
    const hour = (currentHour + i) % 24;
    let congestionLevel: string;
    let congestionColor: string;
    let barHeight: number;
    
    // Peak congestion typically 6-8 AM and 5-8 PM
    if ((hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 20)) {
      congestionLevel = "high";
      congestionColor = "error";
      barHeight = Math.floor(Math.random() * 25) + 75; // 75-100%
    } else if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16) || (hour >= 21 && hour <= 22)) {
      congestionLevel = "medium";
      congestionColor = "warning";
      barHeight = Math.floor(Math.random() * 25) + 45; // 45-70%
    } else {
      congestionLevel = "low";
      congestionColor = "success";
      barHeight = Math.floor(Math.random() * 30) + 15; // 15-45%
    }
    
    forecast.push({
      hour,
      date: now.toISOString().split('T')[0],
      congestionLevel,
      congestionColor,
      barHeight,
    });
  }
  
  return forecast;
}
