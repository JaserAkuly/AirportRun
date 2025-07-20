// Crowd-sourced tips service for real-time traveler experiences
export class CrowdTipsService {
  async getCrowdTips(): Promise<any[]> {
    try {
      // In a real implementation, this would pull from a user-generated content database
      // For now, we'll provide sample tips to demonstrate the feature

      const currentHour = new Date().getHours();
      
      const sampleTips = [
        {
          id: "tip1",
          category: "security",
          location: "Terminal D",
          message: "Security line took 12 minutes around noon today - TSA PreCheck was under 3 minutes",
          timePosted: "2 hours ago",
          helpful: 8,
          userName: "FrequentFlyer123"
        },
        {
          id: "tip2", 
          category: "skylink",
          location: "Terminal B to D",
          message: "Skylink running every 3 minutes, journey took under 7 minutes total",
          timePosted: "45 minutes ago",
          helpful: 5,
          userName: "BusinessTraveler"
        },
        {
          id: "tip3",
          category: "amenities",
          location: "Terminal C Gate 16",
          message: "Café Aroma near Gate C16 has the best coffee and shortest lines. Highly recommend!",
          timePosted: "1 hour ago", 
          helpful: 12,
          userName: "CoffeeLoversUnited"
        },
        {
          id: "tip4",
          category: "security",
          location: "Terminal A",
          message: "Terminal A security is surprisingly quiet right now - good alternative to busier terminals",
          timePosted: "30 minutes ago",
          helpful: 3,
          userName: "SmartTraveler"
        },
        {
          id: "tip5",
          category: "general",
          location: "Terminal E",
          message: "Construction at Terminal E drop-off causing delays. Use upper level departure area instead",
          timePosted: "15 minutes ago",
          helpful: 6,
          userName: "LocalDriver"
        }
      ];

      // Add time-specific tips
      if (currentHour >= 5 && currentHour <= 9) {
        sampleTips.unshift({
          id: "morning-tip",
          category: "security",
          location: "All Terminals",
          message: "Morning rush - expect longer security lines. TSA PreCheck saving 15+ minutes right now",
          timePosted: "20 minutes ago",
          helpful: 15,
          userName: "EarlyBird"
        });
      }

      if (currentHour >= 16 && currentHour <= 20) {
        sampleTips.unshift({
          id: "evening-tip",
          category: "general",
          location: "Terminal C & D",
          message: "Evening rush at American Airlines terminals. Allow extra time for check-in and security",
          timePosted: "10 minutes ago",
          helpful: 9,
          userName: "AAFrequentFlyer"
        });
      }

      return sampleTips;

    } catch (error) {
      console.error("Error fetching crowd-sourced tips:", error);
      
      // Return minimal fallback tips
      return [
        {
          id: "fallback-tip",
          category: "general",
          location: "DFW Airport",
          message: "Tip system temporarily unavailable. Check back soon for real-time traveler insights!",
          timePosted: "Just now",
          helpful: 0,
          userName: "System"
        }
      ];
    }
  }

  async submitTip(tip: {
    category: string;
    location: string;
    message: string;
    userName?: string;
  }): Promise<any> {
    try {
      // In a real implementation, this would save to database and moderate content
      // For now, we'll simulate tip submission
      
      const newTip = {
        id: `tip-${Date.now()}`,
        ...tip,
        timePosted: "Just now",
        helpful: 0,
        userName: tip.userName || "Anonymous"
      };

      return newTip;

    } catch (error) {
      console.error("Error submitting tip:", error);
      throw new Error("Failed to submit tip");
    }
  }
}

export const crowdTipsService = new CrowdTipsService();