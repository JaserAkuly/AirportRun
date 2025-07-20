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



// API response types
export type DashboardData = {
  flightDepartures: FlightDeparture[];
  parkingAvailability: ParkingAvailability[];
  congestionForecast: CongestionForecast[];
  trafficConditions: TrafficCondition[];
  onTimePercentage: number;
  averageDelay: number;
  cancellations: number;
  lastUpdated: string;
};
