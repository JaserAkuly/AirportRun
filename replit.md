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
1. **FlightAware Service** (`server/services/flightaware-api.ts`): Fetches live flight departure data using FlightAware AeroAPI
2. **Parking Scraper Service** (`server/services/parking-scraper.ts`): Scrapes DFW Airport parking availability data
3. **Traffic Service** (`server/services/traffic-api.ts`): Provides internal airport traffic and construction information
4. **Alerts Service** (`server/services/alerts-api.ts`): Operational alerts, construction notices, and service disruptions
5. **Crowd Tips Service** (`server/services/crowd-tips-api.ts`): User-generated real-time experiences and tips
6. **Notification Service** (`server/services/notification-service.ts`): Push notifications for significant flight delays and alerts

### Future API Integrations (Planned)
- **Qsensor API**: Customs and immigration queue tracking for international terminals
- **SITA Wait Time API**: Live security/customs queue projections across terminals
- **FlightLabs Airports API**: Detailed terminal amenities, gates, lounges, shops, and restaurants
- **LoungeReview.com API**: Lounge access policies, photos, and user reviews

### Frontend Components
1. **Flight Departures** (`client/src/components/flight-departures.tsx`): Shows next 5 flights departing within 2-3 hours maximum
2. **Parking Availability** (`client/src/components/parking-availability.tsx`): Real-time parking status for terminal and remote lots
3. **Congestion Forecast** (`client/src/components/congestion-forecast.tsx`): 12-hour predictive congestion levels (top priority)
4. **Traffic Conditions** (`client/src/components/traffic-conditions.tsx`): Internal airport traffic including terminal construction impacts
5. **Airport Alerts** (`client/src/components/airport-alerts.tsx`): Critical operational alerts and construction notices (compact display)
6. **Crowd-Sourced Tips** (`client/src/components/crowd-sourced-tips.tsx`): Real-time traveler experiences and tips with modal submission feature
7. **Notification Settings** (`client/src/components/notification-settings.tsx`): Push notification preferences for delay alerts and terminal preferences
8. **Notification Hook** (`client/src/hooks/useNotifications.ts`): Browser notification API management and permission handling

### Database Schema
- **User Preferences**: Stores user-specific settings and notification preferences
- **Flight Departures**: Live flight information with delay tracking (limited to next 5 flights in 2-3 hours)
- **Parking Availability**: Current parking status across different lot categories
- **Congestion Forecast**: 12-hour predictive analytics for airport congestion patterns
- **Traffic Conditions**: Internal airport traffic, construction impacts, and terminal access
- **Airport Alerts**: Operational alerts, construction notices, and service disruptions (compact display)
- **Crowd Tips**: User-generated real-time experiences with category-based organization and helpfulness voting
- **Notification Preferences**: User-specific delay thresholds, enabled/disabled status, and preferred terminals
- **Notification Log**: Tracks sent notifications to prevent duplicates and maintain audit trail

## Data Flow

1. **Data Ingestion**: External APIs are polled every 5 minutes via the `/api/refresh` endpoint
2. **Data Storage**: Information is stored in PostgreSQL using Drizzle ORM with type-safe operations
3. **Data Delivery**: Frontend components fetch data through TanStack Query with automatic caching and background updates
4. **Real-time Updates**: Dashboard auto-refreshes every 5 minutes to ensure data freshness
5. **User Interaction**: Preferences are stored per user and affect display prioritization

## External Dependencies

### APIs and Data Sources
- **FlightAware AeroAPI**: Live flight departure information (active with API key)
- **DFW Airport Website**: Parking availability data (scraped with fallback data)
- **Weather APIs**: Current conditions for flight impact assessment (simulated for development)
- **DFW Operations**: Airport alerts and construction notices (simulated for development)

### Infrastructure Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development and deployment platform
- **Browser Notifications API**: Native push notifications for delay alerts
- **Web Push Protocol**: Real-time notification delivery to users

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