import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User preferences schema
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  preferredTerminal: text("preferred_terminal"),
  tsaWaitAlerts: boolean("tsa_wait_alerts").default(true),
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

// TSA wait times data
export const tsaWaitTimes = pgTable("tsa_wait_times", {
  id: serial("id").primaryKey(),
  terminal: text("terminal").notNull(),
  waitTimeMinutes: integer("wait_time_minutes").notNull(),
  status: text("status").notNull(), // "short", "moderate", "long"
  statusColor: text("status_color").notNull(), // "success", "warning", "error"
  loadPercentage: integer("load_percentage").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TSAWaitTime = typeof tsaWaitTimes.$inferSelect;

// Flight departures data
export const flightDepartures = pgTable("flight_departures", {
  id: serial("id").primaryKey(),
  flightNumber: text("flight_number").notNull(),
  destination: text("destination").notNull(),
  departureTime: text("departure_time").notNull(),
  status: text("status").notNull(), // "On Time", "Delayed", "Cancelled"
  statusColor: text("status_color").notNull(), // "success", "warning", "error"
  delayMinutes: integer("delay_minutes").default(0),
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

// API response types
export type DashboardData = {
  tsaWaitTimes: TSAWaitTime[];
  flightDepartures: FlightDeparture[];
  parkingAvailability: ParkingAvailability[];
  congestionForecast: CongestionForecast[];
  onTimePercentage: number;
  averageDelay: number;
  lastUpdated: string;
};
