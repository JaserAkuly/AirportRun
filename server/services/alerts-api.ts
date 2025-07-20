// Airport alerts service to provide current operational alerts and notices
export class AlertsService {
  async getAirportAlerts(): Promise<any[]> {
    try {
      // In a real implementation, this would pull from DFW's alert systems, FAA NOTAMs, etc.
      // For now, we'll provide realistic operational alerts based on common airport situations

      const alerts = [];
      const currentHour = new Date().getHours();
      const currentDate = new Date();

      // Construction alerts (ongoing at DFW)
      alerts.push({
        id: "construction-terminal-roadway",
        type: "warning",
        title: "Terminal Roadway Construction",
        message: "Ongoing construction affecting Terminal A and B drop-off areas. Allow extra time for passenger pickup/drop-off. Use upper level for departures.",
        timestamp: "Updated 2 hours ago",
        dismissible: false,
        link: "https://www.dfwairport.com/construction"
      });

      // Weather-based alerts
      if (this.shouldShowWeatherAlert()) {
        alerts.push({
          id: "weather-advisory",
          type: "info",
          title: "Weather Advisory",
          message: "Monitoring weather conditions that may impact flight operations. Check with your airline for the latest flight status.",
          timestamp: "Updated 30 minutes ago",
          dismissible: true
        });
      }

      // Peak hour alerts
      if (currentHour >= 5 && currentHour <= 9) {
        alerts.push({
          id: "morning-peak",
          type: "info",
          title: "Morning Peak Hours",
          message: "Experiencing high passenger volume. Security wait times may be longer than usual. TSA PreCheck recommended.",
          timestamp: "Updated 15 minutes ago",
          dismissible: true
        });
      }

      if (currentHour >= 16 && currentHour <= 20) {
        alerts.push({
          id: "evening-peak",
          type: "info",
          title: "Evening Rush Period",
          message: "Heavy departure traffic. Allow extra time for check-in, security, and transportation to the airport.",
          timestamp: "Updated 10 minutes ago",
          dismissible: true
        });
      }

      // Weekend/holiday alerts
      if (this.isWeekendOrHoliday()) {
        alerts.push({
          id: "weekend-travel",
          type: "info",
          title: "High Travel Volume",
          message: "Increased weekend travel. Parking lots filling up quickly. Consider using remote parking with shuttle service.",
          timestamp: "Updated 1 hour ago",
          dismissible: true
        });
      }

      // Parking alerts
      if (Math.random() < 0.3) { // 30% chance of parking alert
        alerts.push({
          id: "parking-alert",
          type: "warning",
          title: "Terminal Parking Nearly Full",
          message: "Terminal parking approaching capacity. Express and remote parking lots have availability with shuttle service to terminals.",
          timestamp: "Updated 20 minutes ago",
          dismissible: true
        });
      }

      // Technology/system alerts
      if (Math.random() < 0.15) { // 15% chance of system alert
        alerts.push({
          id: "mobile-checkin",
          type: "info",
          title: "Mobile Check-in Recommended",
          message: "Faster processing with mobile boarding passes. Download your airline's app and check in 24 hours before departure.",
          timestamp: "Updated 3 hours ago",
          dismissible: true
        });
      }

      // Emergency or severe weather (rare)
      if (Math.random() < 0.05) { // 5% chance of severe alert
        alerts.push({
          id: "severe-weather",
          type: "error",
          title: "Severe Weather Impact",
          message: "Thunderstorms in the area causing flight delays and cancellations. Contact your airline for rebooking options.",
          timestamp: "Updated 5 minutes ago",
          dismissible: false,
          link: "https://www.dfwairport.com/flight-status"
        });
      }

      return alerts;

    } catch (error) {
      console.error("Error fetching airport alerts:", error);
      
      // Return minimal fallback alert
      return [
        {
          id: "system-notice",
          type: "info",
          title: "System Notice",
          message: "Airport alert system temporarily unavailable. Please check with your airline for the latest flight information.",
          timestamp: "Just now",
          dismissible: true
        }
      ];
    }
  }

  private shouldShowWeatherAlert(): boolean {
    // Simulate weather conditions that would trigger an alert
    const conditions = ["rain", "thunderstorm", "fog", "high winds"];
    return Math.random() < 0.25; // 25% chance of weather alert
  }

  private isWeekendOrHoliday(): boolean {
    const dayOfWeek = new Date().getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  }
}

export const alertsService = new AlertsService();