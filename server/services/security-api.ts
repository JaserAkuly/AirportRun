// Security service to provide estimated wait times for DFW terminals
export class SecurityService {
  async getSecurityWaitTimes(): Promise<any[]> {
    try {
      // In a real implementation, this would integrate with DFW's security wait time systems
      // For now, we'll provide realistic estimates based on time of day, day of week, and flight schedules

      const currentHour = new Date().getHours();
      const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
      
      const terminals = ["Terminal A", "Terminal B", "Terminal C", "Terminal D", "Terminal E"];
      
      return terminals.map(terminal => ({
        terminal,
        estimatedWait: this.calculateWaitTime(terminal, currentHour, dayOfWeek),
        peakHours: this.getPeakHours(terminal),
        crowdLevel: this.getCrowdLevel(terminal, currentHour, dayOfWeek),
        crowdColor: this.getCrowdColor(terminal, currentHour, dayOfWeek),
        tips: this.getTerminalTips(terminal)
      }));

    } catch (error) {
      console.error("Error calculating security wait times:", error);
      
      // Return fallback data
      return [
        {
          terminal: "All Terminals",
          estimatedWait: 15,
          peakHours: ["6:00-9:00 AM", "4:00-7:00 PM"],
          crowdLevel: "Moderate",
          crowdColor: "warning",
          tips: ["Security wait data temporarily unavailable"]
        }
      ];
    }
  }

  private calculateWaitTime(terminal: string, hour: number, dayOfWeek: number): number {
    // Base wait times by terminal (C and D are typically busiest)
    const baseWaits = {
      "Terminal A": 8,
      "Terminal B": 10,
      "Terminal C": 15, // American Airlines hub
      "Terminal D": 18, // American Airlines hub
      "Terminal E": 12
    };

    let baseWait = baseWaits[terminal as keyof typeof baseWaits] || 10;

    // Time of day multipliers
    let timeMultiplier = 1.0;
    
    if (hour >= 5 && hour <= 9) {
      timeMultiplier = 1.8; // Morning rush
    } else if (hour >= 16 && hour <= 20) {
      timeMultiplier = 1.6; // Evening rush
    } else if (hour >= 10 && hour <= 15) {
      timeMultiplier = 1.2; // Midday steady
    } else {
      timeMultiplier = 0.6; // Off-peak hours
    }

    // Weekend vs weekday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      timeMultiplier *= 0.8; // Generally less busy on weekends
    } else if (dayOfWeek === 1 || dayOfWeek === 5) {
      timeMultiplier *= 1.3; // Monday/Friday travel
    }

    // Add some randomness
    const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2

    return Math.round(baseWait * timeMultiplier * randomFactor);
  }

  private getCrowdLevel(terminal: string, hour: number, dayOfWeek: number): string {
    const waitTime = this.calculateWaitTime(terminal, hour, dayOfWeek);
    
    if (waitTime >= 25) return "Very Busy";
    if (waitTime >= 15) return "Busy";
    if (waitTime >= 8) return "Moderate";
    return "Light Crowds";
  }

  private getCrowdColor(terminal: string, hour: number, dayOfWeek: number): string {
    const waitTime = this.calculateWaitTime(terminal, hour, dayOfWeek);
    
    if (waitTime >= 25) return "error";
    if (waitTime >= 15) return "warning";
    return "success";
  }

  private getPeakHours(terminal: string): string[] {
    // DFW typical peak hours
    const peakHours = ["5:30-9:30 AM", "3:30-7:30 PM"];
    
    // Terminal C and D (American Airlines) have additional midday peaks
    if (terminal === "Terminal C" || terminal === "Terminal D") {
      return [...peakHours, "11:00 AM-1:00 PM"];
    }
    
    return peakHours;
  }

  private getTerminalTips(terminal: string): string[] {
    const generalTips = [
      "Arrive 2 hours early for domestic flights, 3 hours for international",
      "TSA PreCheck and Clear lanes available for expedited screening",
      "Remove laptops and liquids before approaching security"
    ];

    const terminalSpecificTips: { [key: string]: string[] } = {
      "Terminal A": [
        "Typically the least crowded terminal",
        "Good option if checking in for connecting flights"
      ],
      "Terminal B": [
        "Moderate traffic, efficient security layout",
        "Close parking in Terminal B garage"
      ],
      "Terminal C": [
        "American Airlines hub - expect higher volumes",
        "Multiple security checkpoints available",
        "Consider alternate terminals if possible during peak hours"
      ],
      "Terminal D": [
        "Busiest terminal - American Airlines international hub",
        "Longest wait times typically here",
        "Plan extra time, especially for international departures"
      ],
      "Terminal E": [
        "Growing international traffic",
        "Modern security setup with good flow",
        "Less crowded than Terminals C and D"
      ]
    };

    return [
      ...generalTips.slice(0, 2),
      ...(terminalSpecificTips[terminal] || [])
    ];
  }
}

export const securityService = new SecurityService();