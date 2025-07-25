import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User preferences schema
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  preferredTerminal: text("preferred_terminal"),
  trafficAlerts: boolean("traffic_alerts").default(true),
  flightDelayAlerts: boolean("flight_delay_alerts").default(false),
  parkingAlerts: boolean("parking_alerts").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;



// Flight departures data
export const flightDepartures = pgTable("flight_departures", {
  id: serial("id").primaryKey(),
  flightNumber: text("flight_number").notNull(),
  destination: text("destination").notNull(),
  departureTime: text("departure_time").notNull(),
  status: text("status").notNull(), // "On Time", "Delayed", "Cancelled"
  statusColor: text("status_color").notNull(), // "success", "warning", "error"
  delayMinutes: integer("delay_minutes").default(0),
  gate: text("gate"),
  terminal: text("terminal"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type FlightDeparture = typeof flightDepartures.$inferSelect;

// Parking availability data
export const parkingAvailability = pgTable("parking_availability", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  category: text("category").notNull(), // "terminal", "express", "remote"
  status: text("status").notNull(), // "Available", "Limited", "Full"
  statusColor: text("status_color").notNull(), // "success", "warning", "error"
  dailyRate: integer("daily_rate").notNull(),
  shuttleRequired: boolean("shuttle_required").default(false),
  availableSpaces: integer("available_spaces"),
  totalSpaces: integer("total_spaces"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ParkingAvailability = typeof parkingAvailability.$inferSelect;

// Congestion forecast data
export const congestionForecast = pgTable("congestion_forecast", {
  id: serial("id").primaryKey(),
  hour: integer("hour").notNull(), // 0-23
  date: text("date").notNull(), // YYYY-MM-DD
  congestionLevel: text("congestion_level").notNull(), // "low", "medium", "high"
  congestionColor: text("congestion_color").notNull(), // "success", "warning", "error"
  barHeight: integer("bar_height").notNull(), // For visualization
  flightCount: integer("flight_count").default(0), // Number of flights during this hour
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CongestionForecast = typeof congestionForecast.$inferSelect;

// Traffic conditions data
export const trafficConditions = pgTable("traffic_conditions", {
  id: serial("id").primaryKey(),
  route: text("route").notNull(),
  status: text("status").notNull(), // "Free Flow", "Light Traffic", "Heavy Traffic", etc.
  statusColor: text("status_color").notNull(), // "success", "warning", "error"
  travelTime: integer("travel_time").notNull(), // in minutes
  normalTime: integer("normal_time").notNull(), // typical travel time in minutes
  incidents: text("incidents").array().default([]), // array of incident descriptions
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TrafficCondition = typeof trafficConditions.$inferSelect;

// Weather conditions data
export const weatherConditions = pgTable("weather_conditions", {
  id: serial("id").primaryKey(),
  temperature: integer("temperature").notNull(),
  conditions: text("conditions").notNull(),
  windSpeed: integer("wind_speed").notNull(),
  windDirection: text("wind_direction").notNull(),
  visibility: integer("visibility").notNull(),
  humidity: integer("humidity").notNull(),
  pressure: integer("pressure").notNull(),
  flightImpact: text("flight_impact").notNull(),
  flightImpactColor: text("flight_impact_color").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WeatherCondition = typeof weatherConditions.$inferSelect;

// Airport alerts data
export const airportAlerts = pgTable("airport_alerts", {
  id: serial("id").primaryKey(),
  alertId: text("alert_id").notNull(),
  type: text("type").notNull(), // "warning", "info", "success", "error"
  title: text("title").notNull(),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
  dismissible: integer("dismissible").notNull(), // 0 or 1 for boolean
  link: text("link"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type AirportAlert = typeof airportAlerts.$inferSelect;

// Crowd-sourced tips data
export const crowdTips = pgTable("crowd_tips", {
  id: serial("id").primaryKey(),
  tipId: text("tip_id").notNull(),
  category: text("category").notNull(), // "security", "skylink", "amenities", "general"
  location: text("location").notNull(),
  message: text("message").notNull(),
  timePosted: text("time_posted").notNull(),
  helpful: integer("helpful").default(0),
  userName: text("user_name"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CrowdTip = typeof crowdTips.$inferSelect;
export type InsertCrowdTip = typeof crowdTips.$inferInsert;

// Notification preferences table
export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  delayThreshold: integer("delay_threshold").default(30), // minutes
  notificationsEnabled: boolean("notifications_enabled").default(true),
  preferredTerminals: text("preferred_terminals").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;

// Notification log table to track sent notifications
export const notificationLog = pgTable("notification_log", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  flightNumber: text("flight_number").notNull(),
  delayMinutes: integer("delay_minutes").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
});

export type NotificationLog = typeof notificationLog.$inferSelect;
export type InsertNotificationLog = typeof notificationLog.$inferInsert;

// Historical trend data table for better predictions
export const historicalTrends = pgTable("historical_trends", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD format
  hour: integer("hour").notNull(), // 0-23
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  flightCount: integer("flight_count").notNull(),
  avgDelayMinutes: integer("avg_delay_minutes").default(0),
  congestionScore: integer("congestion_score").notNull(), // 0-100
  parkingOccupancy: integer("parking_occupancy").default(50), // 0-100 percentage
  weatherCondition: text("weather_condition"), // clear, rain, fog, etc.
  specialEvent: boolean("special_event").default(false), // holidays, major events
  createdAt: timestamp("created_at").defaultNow(),
});

export type HistoricalTrend = typeof historicalTrends.$inferSelect;
export type InsertHistoricalTrend = typeof historicalTrends.$inferInsert;

// API response types
export type DashboardData = {
  flightDepartures: FlightDeparture[];
  parkingAvailability: ParkingAvailability[];
  congestionForecast: CongestionForecast[];
  trafficConditions: TrafficCondition[];
  airportAlerts: AirportAlert[];
  crowdTips: CrowdTip[];
  weatherData?: any;
  historicalTrends?: any;
  onTimePercentage: number;
  averageDelay: number;
  cancellations: number;
  lastUpdated: string;
};
