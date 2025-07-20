// Weather service to provide DFW airport weather conditions and flight impacts
export class WeatherService {
  async getWeatherConditions(): Promise<any[]> {
    try {
      // In a real implementation, this would call weather APIs like OpenWeatherMap, WeatherAPI, or NOAA
      // For now, we'll provide realistic weather data for DFW area

      const currentHour = new Date().getHours();
      
      // Simulate different weather conditions based on time/season
      const conditions = [
        {
          temperature: this.getRealisticTemperature(),
          conditions: this.getCurrentConditions(),
          windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph typical for DFW
          windDirection: this.getWindDirection(),
          visibility: this.getVisibility(),
          humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
          pressure: Math.floor(Math.random() * 50) + 2980, // 29.80-30.30 inHg
          flightImpact: this.getFlightImpact(),
          flightImpactColor: this.getFlightImpactColor()
        }
      ];

      return conditions;
    } catch (error) {
      console.error("Error fetching weather conditions:", error);
      
      // Return fallback weather data
      return [
        {
          temperature: 75,
          conditions: "Clear",
          windSpeed: 8,
          windDirection: "SW",
          visibility: 10,
          humidity: 55,
          pressure: 3010,
          flightImpact: "No weather-related delays expected",
          flightImpactColor: "success"
        }
      ];
    }
  }

  private getRealisticTemperature(): number {
    const month = new Date().getMonth();
    const hour = new Date().getHours();
    
    // DFW seasonal temperature ranges
    const seasonalAvg = [
      52, 58, 66, 76, 84, 92, 96, 95, 88, 78, 65, 55
    ][month];
    
    // Daily temperature variation
    const dailyVariation = Math.sin((hour - 6) * Math.PI / 12) * 8;
    
    return Math.round(seasonalAvg + dailyVariation + (Math.random() - 0.5) * 10);
  }

  private getCurrentConditions(): string {
    const conditions = [
      "Clear", "Partly Cloudy", "Mostly Cloudy", "Overcast",
      "Light Rain", "Thunderstorms", "Fog", "Hazy"
    ];
    
    // Weight toward more common conditions
    const weights = [0.3, 0.25, 0.2, 0.1, 0.08, 0.04, 0.02, 0.01];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < conditions.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return conditions[i];
      }
    }
    
    return "Clear";
  }

  private getWindDirection(): string {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", 
                       "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    
    // DFW typically has southerly winds
    const southWeights = ["S", "SSW", "SW", "WSW"];
    
    if (Math.random() < 0.6) {
      return southWeights[Math.floor(Math.random() * southWeights.length)];
    }
    
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private getVisibility(): number {
    const hour = new Date().getHours();
    
    // Reduced visibility possible in early morning or late evening
    if (hour < 7 || hour > 20) {
      return Math.floor(Math.random() * 3) + 7; // 7-10 miles
    }
    
    return 10; // Clear visibility most of the time
  }

  private getFlightImpact(): string {
    const conditions = this.getCurrentConditions();
    const windSpeed = Math.floor(Math.random() * 15) + 5;
    const visibility = this.getVisibility();
    
    if (conditions.includes("Thunderstorms")) {
      return "Severe weather delays and cancellations likely";
    }
    
    if (conditions.includes("Fog") || visibility < 8) {
      return "Reduced visibility may cause arrival/departure delays";
    }
    
    if (windSpeed > 18) {
      return "High winds may impact smaller aircraft operations";
    }
    
    if (conditions.includes("Rain")) {
      return "Light weather delays possible during precipitation";
    }
    
    return "No significant weather impact on flight operations";
  }

  private getFlightImpactColor(): string {
    const impact = this.getFlightImpact();
    
    if (impact.includes("Severe") || impact.includes("cancellations")) {
      return "error";
    }
    
    if (impact.includes("delays") || impact.includes("impact")) {
      return "warning";
    }
    
    return "success";
  }
}

export const weatherService = new WeatherService();