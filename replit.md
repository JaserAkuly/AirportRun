# DFW Airport Congestion Tracker

## Overview

This is a mobile-first MVP web application called "DFW Airport Congestion Tracker" that provides real-time congestion and predictive insights for Dallas/Fort Worth International Airport. The application displays TSA wait times, flight departure status, parking availability, and congestion forecasts to help travelers plan their airport experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack TypeScript architecture with a clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with Tailwind CSS for styling
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Library**: Custom shadcn/ui components for consistent design

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API endpoints with structured JSON responses
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)

## Key Components

### Data Sources and Services
1. **TSA Service** (`server/services/tsa-api.ts`): Integrates with MyTSA API for real-time security checkpoint wait times
2. **FlightAware Service** (`server/services/flightaware-api.ts`): Fetches live flight departure data using FlightAware AeroAPI
3. **Parking Scraper Service** (`server/services/parking-scraper.ts`): Scrapes DFW Airport parking availability data

### Frontend Components
1. **TSA Wait Times** (`client/src/components/tsa-wait-times.tsx`): Color-coded display of security checkpoint wait times for terminals A-E
2. **Flight Departures** (`client/src/components/flight-departures.tsx`): Live flight status with delay information
3. **Parking Availability** (`client/src/components/parking-availability.tsx`): Real-time parking status for terminal and remote lots
4. **Congestion Forecast** (`client/src/components/congestion-forecast.tsx`): Predictive congestion levels for the next 12 hours
5. **User Preferences** (`client/src/components/user-preferences.tsx`): Customizable alert settings and preferred terminals

### Database Schema
- **User Preferences**: Stores user-specific settings and notification preferences
- **TSA Wait Times**: Real-time security checkpoint data with status indicators
- **Flight Departures**: Live flight information with delay tracking
- **Parking Availability**: Current parking status across different lot categories
- **Congestion Forecast**: Predictive analytics for airport congestion patterns

## Data Flow

1. **Data Ingestion**: External APIs are polled every 5 minutes via the `/api/refresh` endpoint
2. **Data Storage**: Information is stored in PostgreSQL using Drizzle ORM with type-safe operations
3. **Data Delivery**: Frontend components fetch data through TanStack Query with automatic caching and background updates
4. **Real-time Updates**: Dashboard auto-refreshes every 5 minutes to ensure data freshness
5. **User Interaction**: Preferences are stored per user and affect display prioritization

## External Dependencies

### APIs and Data Sources
- **MyTSA API**: Official TSA wait time data (fallback data used when API unavailable)
- **FlightAware AeroAPI**: Live flight departure information
- **DFW Airport Website**: Parking availability data (scraped with fallback data)

### Infrastructure Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development and deployment platform

### Key Libraries
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **TanStack Query**: Robust server state management
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Wouter**: Lightweight React routing

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR for rapid iteration
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Environment Variables**: API keys and database URLs configured via environment

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles the Express server to `dist/index.js`
- **Deployment**: Single-command deployment on Replit platform

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations with `drizzle.config.ts`
- **Schema**: Shared TypeScript schema definitions in `shared/schema.ts`
- **Connection**: `@neondatabase/serverless` for edge-compatible database access

### Performance Optimizations
- **Caching**: TanStack Query provides intelligent client-side caching
- **Mobile-First**: Responsive design optimized for mobile devices
- **Auto-refresh**: Background data updates every 5 minutes
- **Fallback Data**: Graceful degradation when external APIs are unavailable

The application is designed to be resilient, with fallback data mechanisms ensuring the dashboard remains functional even when external data sources are temporarily unavailable.