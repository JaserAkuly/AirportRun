# DFW Airport Congestion Tracker

## Overview

This is a mobile-first MVP web application called "DFW Airport Congestion Tracker" that provides real-time congestion and predictive insights for Dallas/Fort Worth International Airport. The application displays TSA wait times, flight departure status, parking availability, and congestion forecasts to help travelers plan their airport experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 21, 2025)

✓ Enhanced congestion forecast with AI-powered analysis using real FlightAware flight traffic data
✓ Removed confusing three-header layout in favor of clean bar chart visualization  
✓ Integrated multi-factor analysis: flight patterns (50%), parking pressure (30%), traffic conditions (20%)
✓ Added intelligent recommendations showing best/worst travel times based on data analysis
✓ Fixed tip submission functionality with proper API endpoint and form handling
✓ Updated all tip usernames to display as "Frequent Flyer" consistently
✓ Added "Restroom" category option for crowd-sourced tips
✓ Enhanced component ordering: congestion forecast (top), parking, traffic, crowd tips, flight statistics
✓ **Implemented historical trend analysis feature with 90-day data patterns for enhanced predictions**
✓ **Updated congestion forecast text labels to "Total departures/arrivals" (removed "during these hours")**
✓ **Fixed red alert readability and dismiss button functionality using proper Tailwind CSS colors**
✓ **Added Historical Trends component showing peak analysis, performance metrics, and reliability scoring**

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
5. **Crowd Tips Service** (`server/services/crowd-tips-api.ts`): User-generated real-time experiences and tips with submission functionality
6. **Notification Service** (`server/services/notification-service.ts`): Push notifications for significant flight delays and alerts
7. **AI Congestion Analysis** (`server/routes.ts`): Intelligent analysis combining FlightAware data, parking availability, and traffic patterns

### Future API Integrations (Planned)
- **Qsensor API**: Customs and immigration queue tracking for international terminals
- **SITA Wait Time API**: Live security/customs queue projections across terminals
- **FlightLabs Airports API**: Detailed terminal amenities, gates, lounges, shops, and restaurants
- **LoungeReview.com API**: Lounge access policies, photos, and user reviews

### Frontend Components
1. **Congestion Forecast** (`client/src/components/congestion-forecast.tsx`): AI-powered 12-hour predictive congestion analysis using FlightAware data, parking, and traffic (top priority)
2. **Parking Availability** (`client/src/components/parking-availability.tsx`): Real-time parking status with capacity numbers (e.g., "52/85 spots")
3. **Traffic Conditions** (`client/src/components/traffic-conditions.tsx`): Internal airport traffic including terminal construction impacts
4. **Crowd-Sourced Tips** (`client/src/components/crowd-sourced-tips.tsx`): Timeline-style tips with submission functionality and "Restroom" category
5. **Flight Statistics** (`client/src/components/flight-statistics.tsx`): Delay/cancellation percentages replacing individual flight departures
6. **Airport Alerts** (`client/src/components/airport-alerts.tsx`): Dismissible toast-style alerts with X buttons
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