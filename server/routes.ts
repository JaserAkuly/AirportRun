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
      const congestionForecast = await generateCongestionForecast();

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

  // Crowd tips submission endpoint
  app.post("/api/crowd-tips", async (req, res) => {
    try {
      const { category, location, message } = req.body;
      
      if (!category || !location || !message) {
        return res.status(400).json({ message: "Category, location, and message are required" });
      }

      const newTip = await crowdTipsService.submitTip({
        category,
        location,
        message,
        userName: "Frequent Flyer"
      });

      res.json({ tip: newTip });
    } catch (error) {
      console.error("Error submitting tip:", error);
      res.status(500).json({ message: "Failed to submit tip" });
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

      const congestionForecast = await generateCongestionForecast();

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

      const congestionForecast = await generateCongestionForecast();

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

// AI-powered congestion forecast using FlightAware data, parking, and traffic patterns
async function generateCongestionForecast() {
  const now = new Date();
  const currentHour = now.getHours();
  const forecast = [];
  
  try {
    // Get current flight data to analyze patterns
    const flightData = await flightAwareService.getFlightDepartures();
    const parkingData = await parkingScraperService.getParkingAvailability();
    const trafficData = await trafficService.getTrafficConditions();
    
    for (let i = 0; i < 12; i++) {
      const hour = (currentHour + i) % 24;
      
      // Analyze flight traffic for this hour
      const flightTrafficScore = analyzeFlightTraffic(hour, flightData);
      
      // Analyze parking pressure
      const parkingPressureScore = analyzeParkingPressure(parkingData);
      
      // Analyze traffic conditions
      const trafficScore = analyzeTrafficConditions(trafficData);
      
      // Calculate overall congestion score (0-100)
      const congestionScore = Math.round(
        (flightTrafficScore * 0.5) + 
        (parkingPressureScore * 0.3) + 
        (trafficScore * 0.2)
      );
      
      let congestionLevel: string;
      let congestionColor: string;
      
      if (congestionScore >= 70) {
        congestionLevel = "high";
        congestionColor = "error";
      } else if (congestionScore >= 40) {
        congestionLevel = "medium";
        congestionColor = "warning";
      } else {
        congestionLevel = "low";
        congestionColor = "success";
      }
      
      // Calculate flight count for this hour (simulate based on patterns)
      const flightCount = calculateFlightCountForHour(hour, flightData);
      
      forecast.push({
        hour,
        date: now.toISOString().split('T')[0],
        congestionLevel,
        congestionColor,
        barHeight: congestionScore,
        flightCount,
      });
    }
    
    return forecast;
    
  } catch (error) {
    console.error("Error generating AI congestion forecast:", error);
    // Fallback to pattern-based forecast
    return generateBasicCongestionForecast();
  }
}

// Analyze flight traffic patterns for a specific hour
function analyzeFlightTraffic(hour: number, flightData: any[]): number {
  // Peak departure times at DFW: 6-9 AM, 4-8 PM
  const morningPeak = hour >= 6 && hour <= 9;
  const eveningPeak = hour >= 16 && hour <= 20;
  const afternoonModerate = hour >= 10 && hour <= 15;
  const lateNight = hour >= 22 || hour <= 5;
  
  // Base score on typical patterns
  let baseScore = 0;
  if (morningPeak) baseScore = 85;
  else if (eveningPeak) baseScore = 90;
  else if (afternoonModerate) baseScore = 55;
  else if (lateNight) baseScore = 20;
  else baseScore = 40;
  
  // Adjust based on actual flight data if available
  if (flightData && flightData.length > 0) {
    const avgDelay = flightData.reduce((sum, flight) => sum + (flight.delayMinutes || 0), 0) / flightData.length;
    if (avgDelay > 30) baseScore += 15;
    else if (avgDelay > 15) baseScore += 8;
  }
  
  return Math.min(100, Math.max(0, baseScore));
}

// Analyze parking pressure impact on congestion
function analyzeParkingPressure(parkingData: any[]): number {
  if (!parkingData || parkingData.length === 0) return 50;
  
  const totalOccupancy = parkingData.reduce((total, lot) => {
    const occupancyRate = lot.availableSpaces / (lot.totalSpaces || 1);
    return total + (1 - occupancyRate);
  }, 0) / parkingData.length;
  
  return Math.round(totalOccupancy * 100);
}

// Analyze traffic conditions impact
function analyzeTrafficConditions(trafficData: any[]): number {
  if (!trafficData || trafficData.length === 0) return 30;
  
  // Count construction impacts and delays
  const constructionCount = trafficData.filter(item => 
    item.description && item.description.toLowerCase().includes('construction')
  ).length;
  
  const delayCount = trafficData.filter(item => 
    item.description && (item.description.toLowerCase().includes('delay') || 
                        item.description.toLowerCase().includes('slow'))
  ).length;
  
  return Math.min(100, (constructionCount * 25) + (delayCount * 15) + 30);
}

// Calculate flight count for a specific hour based on patterns
function calculateFlightCountForHour(hour: number, flightData: any[]): number {
  // DFW typical flight patterns (departures + arrivals per hour)
  const hourlyPatterns: { [key: number]: number } = {
    0: 8, 1: 5, 2: 3, 3: 2, 4: 4, 5: 12,
    6: 28, 7: 45, 8: 52, 9: 38, 10: 42, 11: 46,
    12: 48, 13: 44, 14: 46, 15: 49, 16: 52, 17: 58,
    18: 55, 19: 48, 20: 42, 21: 35, 22: 22, 23: 15
  };
  
  // Base pattern plus some randomization
  const baseCount = hourlyPatterns[hour] || 30;
  const variation = Math.floor(Math.random() * 10) - 5; // ±5 flights
  
  return Math.max(0, baseCount + variation);
}

// Fallback basic congestion forecast
function generateBasicCongestionForecast() {
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
    
    const flightCount = calculateFlightCountForHour(hour, []);
    
    forecast.push({
      hour,
      date: now.toISOString().split('T')[0],
      congestionLevel,
      congestionColor,
      barHeight,
      flightCount,
    });
  }
  
  return forecast;
}
