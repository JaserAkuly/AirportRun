import type { FlightDeparture, NotificationPreferences, InsertNotificationLog } from '@shared/schema';

export interface NotificationService {
  checkForDelayAlerts(flights: FlightDeparture[], preferences: NotificationPreferences[]): Promise<void>;
  shouldNotify(flight: FlightDeparture, preferences: NotificationPreferences): boolean;
  createNotificationMessage(flight: FlightDeparture): string;
  logNotification(userId: string, flight: FlightDeparture, message: string): Promise<void>;
}

class NotificationServiceImpl implements NotificationService {
  private notifiedFlights = new Set<string>(); // Track already notified flights
  
  async checkForDelayAlerts(flights: FlightDeparture[], preferences: NotificationPreferences[]): Promise<void> {
    for (const userPrefs of preferences) {
      if (!userPrefs.notificationsEnabled) continue;
      
      for (const flight of flights) {
        if (this.shouldNotify(flight, userPrefs)) {
          const notificationKey = `${userPrefs.userId}-${flight.flightNumber}-${flight.delayMinutes}`;
          
          // Avoid duplicate notifications
          if (this.notifiedFlights.has(notificationKey)) continue;
          
          const message = this.createNotificationMessage(flight);
          await this.logNotification(userPrefs.userId!, flight, message);
          
          // Mark as notified
          this.notifiedFlights.add(notificationKey);
          
          console.log(`Notification triggered for user ${userPrefs.userId}: ${message}`);
        }
      }
    }
  }

  shouldNotify(flight: FlightDeparture, preferences: NotificationPreferences): boolean {
    // Check if delay exceeds threshold
    if (!flight.delayMinutes || flight.delayMinutes < (preferences.delayThreshold || 30)) {
      return false;
    }

    // Check if flight is cancelled (always notify)
    if (flight.status === 'Cancelled') {
      return true;
    }

    // Check if terminal is preferred (higher priority)
    if (preferences.preferredTerminals && preferences.preferredTerminals.length > 0) {
      return preferences.preferredTerminals.includes(flight.terminal || '');
    }

    // Notify for all significant delays if no preferred terminals
    return true;
  }

  createNotificationMessage(flight: FlightDeparture): string {
    if (flight.status === 'Cancelled') {
      return `Flight ${flight.flightNumber} to ${flight.destination} has been cancelled.`;
    }
    
    return `Flight ${flight.flightNumber} to ${flight.destination} is delayed ${flight.delayMinutes} minutes. New departure: ${flight.departureTime}`;
  }

  async logNotification(userId: string, flight: FlightDeparture, message: string): Promise<void> {
    try {
      // In a real implementation, this would save to the database
      console.log('Logging notification:', {
        userId,
        flightNumber: flight.flightNumber,
        delayMinutes: flight.delayMinutes || 0,
        message,
        sentAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log notification:', error);
    }
  }

  // Clear old notifications periodically
  clearOldNotifications(): void {
    this.notifiedFlights.clear();
  }
}

export const notificationService = new NotificationServiceImpl();

// Clear notifications every hour to avoid memory buildup
setInterval(() => {
  notificationService.clearOldNotifications();
}, 60 * 60 * 1000);