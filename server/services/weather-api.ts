interface WeatherCondition {
  id: string;
  type: 'clear' | 'rain' | 'thunderstorm' | 'snow' | 'fog' | 'wind';
  severity: 'low' | 'moderate' | 'high' | 'severe';
  title: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  flightImpact: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
  impactDescription: string;
  timestamp: string;
}

interface WeatherForecast {
  current: WeatherCondition;
  hourly: WeatherCondition[];
  alerts: WeatherAlert[];
}

interface WeatherAlert {
  id: string;
  type: 'advisory' | 'watch' | 'warning' | 'emergency';
  title: string;
  description: string;
  validUntil: string;
  flightImpact: string;
}

export class WeatherService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
  }

  async getCurrentWeather(): Promise<WeatherForecast> {
    try {
      // If we have an API key, we could fetch real weather data
      // For now, we'll simulate realistic DFW weather conditions
      
      const currentHour = new Date().getHours();
      const currentConditions = this.generateRealisticWeather(currentHour);
      
      return {
        current: currentConditions,
        hourly: this.generateHourlyForecast(),
        alerts: this.generateWeatherAlerts(currentConditions)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getFallbackWeather();
    }
  }

  private generateRealisticWeather(hour: number): WeatherCondition {
    const weatherScenarios = [
      // Clear conditions
      {
        type: 'clear' as const,
        severity: 'low' as const,
        title: 'Clear Skies',
        description: 'Sunny with light winds',
        temperature: 78,
        humidity: 45,
        windSpeed: 8,
        windDirection: 'SW',
        visibility: 10,
        flightImpact: 'none' as const,
        impactDescription: 'No weather-related flight impacts expected'
      },
      // Light rain
      {
        type: 'rain' as const,
        severity: 'moderate' as const,
        title: 'Light Rain',
        description: 'Scattered light showers',
        temperature: 72,
        humidity: 85,
        windSpeed: 12,
        windDirection: 'SE',
        visibility: 8,
        flightImpact: 'minimal' as const,
        impactDescription: 'Minor delays possible for ground operations'
      },
      // Thunderstorms
      {
        type: 'thunderstorm' as const,
        severity: 'high' as const,
        title: 'Thunderstorms',
        description: 'Active thunderstorms in the area',
        temperature: 75,
        humidity: 90,
        windSpeed: 25,
        windDirection: 'W',
        visibility: 5,
        flightImpact: 'significant' as const,
        impactDescription: 'Flight delays and cancellations likely due to lightning'
      },
      // High winds
      {
        type: 'wind' as const,
        severity: 'moderate' as const,
        title: 'Windy Conditions',
        description: 'Strong gusty winds',
        temperature: 82,
        humidity: 35,
        windSpeed: 35,
        windDirection: 'N',
        visibility: 10,
        flightImpact: 'moderate' as const,
        impactDescription: 'Crosswind landings may cause minor delays'
      }
    ];

    // Select weather based on time and random factors
    const random = Math.random();
    let selectedWeather;
    
    if (hour >= 14 && hour <= 18 && random < 0.3) {
      // Afternoon thunderstorms are common in DFW
      selectedWeather = weatherScenarios[2];
    } else if (random < 0.1) {
      selectedWeather = weatherScenarios[1]; // Rain
    } else if (random < 0.05) {
      selectedWeather = weatherScenarios[3]; // Wind
    } else {
      selectedWeather = weatherScenarios[0]; // Clear
    }

    return {
      id: `weather-${Date.now()}`,
      ...selectedWeather,
      timestamp: new Date().toISOString()
    };
  }

  private generateHourlyForecast(): WeatherCondition[] {
    const forecast = [];
    const currentHour = new Date().getHours();
    
    for (let i = 1; i <= 12; i++) {
      const hour = (currentHour + i) % 24;
      forecast.push({
        ...this.generateRealisticWeather(hour),
        id: `forecast-${hour}-${i}`
      });
    }
    
    return forecast;
  }

  private generateWeatherAlerts(current: WeatherCondition): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    
    if (current.type === 'thunderstorm') {
      alerts.push({
        id: 'thunderstorm-warning',
        type: 'warning',
        title: 'Thunderstorm Warning',
        description: 'Active thunderstorms affecting airport operations. Ground stops may be implemented.',
        validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        flightImpact: 'Expect significant delays and possible cancellations'
      });
    }
    
    if (current.windSpeed > 30) {
      alerts.push({
        id: 'wind-advisory',
        type: 'advisory',
        title: 'High Wind Advisory',
        description: 'Strong winds may affect aircraft operations and ground handling.',
        validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        flightImpact: 'Possible delays for departures and arrivals'
      });
    }
    
    if (current.visibility < 6) {
      alerts.push({
        id: 'visibility-advisory',
        type: 'advisory',
        title: 'Reduced Visibility',
        description: 'Low visibility conditions may impact flight operations.',
        validUntil: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        flightImpact: 'Approach and departure procedures may be modified'
      });
    }
    
    return alerts;
  }

  private getFallbackWeather(): WeatherForecast {
    return {
      current: {
        id: 'fallback-current',
        type: 'clear',
        severity: 'low',
        title: 'Weather Data Unavailable',
        description: 'Unable to retrieve current weather conditions',
        temperature: 75,
        humidity: 50,
        windSpeed: 10,
        windDirection: 'Variable',
        visibility: 10,
        flightImpact: 'none',
        impactDescription: 'Weather service temporarily unavailable',
        timestamp: new Date().toISOString()
      },
      hourly: [],
      alerts: []
    };
  }

  getFlightImpactSeverity(impact: string): number {
    switch (impact) {
      case 'none': return 0;
      case 'minimal': return 1;
      case 'moderate': return 2;
      case 'significant': return 3;
      case 'severe': return 4;
      default: return 0;
    }
  }
}

export const weatherService = new WeatherService();