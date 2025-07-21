interface HistoricalTrendData {
  date: string; // YYYY-MM-DD format
  hour: number; // 0-23
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  flightCount: number;
  avgDelayMinutes: number;
  congestionScore: number; // 0-100
  parkingOccupancy: number; // 0-100 percentage
  weatherCondition?: string; // clear, rain, fog, etc.
  specialEvent: boolean; // holidays, major events
}

interface TrendAnalysisResult {
  predictedCongestion: number;
  confidence: number;
  factors: {
    historicalPattern: number;
    dayOfWeekTrend: number;
    seasonalFactor: number;
    specialEventImpact: number;
  };
  recommendation: string;
}

class HistoricalTrendsService {
  private trends: HistoricalTrendData[] = [];

  constructor() {
    this.initializeHistoricalData();
  }

  // Initialize with realistic DFW historical data patterns
  private initializeHistoricalData() {
    const now = new Date();
    const startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)); // 90 days ago
    
    // Generate historical data for the past 90 days
    for (let d = 0; d < 90; d++) {
      const date = new Date(startDate.getTime() + (d * 24 * 60 * 60 * 1000));
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate hourly data for each day
      for (let hour = 0; hour < 24; hour++) {
        const trendData = this.generateRealisticHourlyData(dateStr, hour, dayOfWeek, date);
        this.trends.push(trendData);
      }
    }
  }

  private generateRealisticHourlyData(date: string, hour: number, dayOfWeek: number, dateObj: Date): HistoricalTrendData {
    // Base flight patterns for DFW (departures + arrivals per hour)
    const baseFlightCounts: { [key: number]: number } = {
      0: 8, 1: 5, 2: 3, 3: 2, 4: 4, 5: 12,
      6: 28, 7: 45, 8: 52, 9: 38, 10: 42, 11: 46,
      12: 48, 13: 44, 14: 46, 15: 49, 16: 52, 17: 58,
      18: 55, 19: 48, 20: 42, 21: 35, 22: 22, 23: 15
    };

    let flightCount = baseFlightCounts[hour] || 30;
    
    // Weekend adjustments (Friday-Sunday tend to be busier)
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
      flightCount *= 1.15; // 15% increase on weekends
    }
    
    // Monday adjustments (business travel)
    if (dayOfWeek === 1) {
      flightCount *= 1.08; // 8% increase on Mondays
    }

    // Holiday periods (simplified - major travel periods)
    const month = dateObj.getMonth();
    const dayOfMonth = dateObj.getDate();
    let specialEvent = false;
    
    // Major holiday travel periods
    if (
      (month === 11 && dayOfMonth >= 20) || // Thanksgiving week
      (month === 0 && dayOfMonth <= 3) ||   // New Year
      (month === 5 && dayOfMonth >= 25) ||  // Summer travel season start
      (month === 6) ||                      // July summer peak
      (month === 7 && dayOfMonth <= 15)    // August summer end
    ) {
      flightCount *= 1.25; // 25% increase during peak travel
      specialEvent = true;
    }

    // Weather simulation (simplified)
    const weatherRand = Math.random();
    let weatherCondition = "clear";
    let weatherImpact = 1.0;
    
    if (weatherRand < 0.1) { // 10% chance of weather issues
      weatherCondition = Math.random() < 0.6 ? "rain" : "fog";
      weatherImpact = 0.7; // 30% reduction in operations
      flightCount *= weatherImpact;
    }

    // Add realistic randomness
    const randomFactor = 0.85 + (Math.random() * 0.3); // ±15% variation
    flightCount = Math.round(flightCount * randomFactor);

    // Calculate congestion score based on flight volume
    let congestionScore = Math.round((flightCount / 65) * 100); // Scale to 0-100
    congestionScore = Math.max(0, Math.min(100, congestionScore));

    // Calculate average delay (realistic patterns)
    let avgDelayMinutes = 0;
    if (congestionScore > 70) {
      avgDelayMinutes = 15 + Math.floor(Math.random() * 20); // 15-35 minutes
    } else if (congestionScore > 40) {
      avgDelayMinutes = 5 + Math.floor(Math.random() * 15); // 5-20 minutes
    } else {
      avgDelayMinutes = Math.floor(Math.random() * 8); // 0-8 minutes
    }

    // Parking occupancy correlation with flight volume
    const parkingOccupancy = Math.round(40 + (congestionScore * 0.5) + (Math.random() * 20));

    return {
      date,
      hour,
      dayOfWeek,
      flightCount,
      avgDelayMinutes,
      congestionScore,
      parkingOccupancy: Math.max(0, Math.min(100, parkingOccupancy)),
      weatherCondition,
      specialEvent
    };
  }

  // Get historical trends for a specific time period
  getHistoricalTrends(days: number = 30): HistoricalTrendData[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    
    return this.trends.filter(trend => trend.date >= cutoffStr);
  }

  // Analyze trends for a specific hour and day of week
  analyzeTrendForHour(targetHour: number, dayOfWeek: number): TrendAnalysisResult {
    // Get similar historical data (same hour, same day of week)
    const similarTrends = this.trends.filter(trend => 
      trend.hour === targetHour && trend.dayOfWeek === dayOfWeek
    );

    if (similarTrends.length === 0) {
      return this.getDefaultAnalysis();
    }

    // Calculate historical pattern
    const avgCongestion = similarTrends.reduce((sum, trend) => sum + trend.congestionScore, 0) / similarTrends.length;
    const stdDev = Math.sqrt(
      similarTrends.reduce((sum, trend) => sum + Math.pow(trend.congestionScore - avgCongestion, 2), 0) / similarTrends.length
    );

    // Day of week trends
    const dayTrends = this.trends.filter(trend => trend.dayOfWeek === dayOfWeek);
    const dayAvgCongestion = dayTrends.reduce((sum, trend) => sum + trend.congestionScore, 0) / dayTrends.length;

    // Recent trends (last 7 days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    const recentDateStr = recentDate.toISOString().split('T')[0];
    
    const recentTrends = similarTrends.filter(trend => trend.date >= recentDateStr);
    const recentAvgCongestion = recentTrends.length > 0 
      ? recentTrends.reduce((sum, trend) => sum + trend.congestionScore, 0) / recentTrends.length 
      : avgCongestion;

    // Special event impact
    const specialEventTrends = similarTrends.filter(trend => trend.specialEvent);
    const specialEventImpact = specialEventTrends.length > 0 
      ? (specialEventTrends.reduce((sum, trend) => sum + trend.congestionScore, 0) / specialEventTrends.length) - avgCongestion
      : 0;

    // Calculate prediction with confidence
    const historicalWeight = 0.4;
    const recentWeight = 0.3;
    const dayWeight = 0.2;
    const eventWeight = 0.1;

    const predictedCongestion = Math.round(
      (avgCongestion * historicalWeight) +
      (recentAvgCongestion * recentWeight) +
      (dayAvgCongestion * dayWeight) +
      (specialEventImpact * eventWeight)
    );

    // Confidence based on data consistency (lower std dev = higher confidence)
    const confidence = Math.max(0.5, Math.min(0.95, 1 - (stdDev / 50)));

    // Generate recommendation
    const recommendation = this.generateRecommendation(predictedCongestion, confidence, targetHour);

    return {
      predictedCongestion: Math.max(0, Math.min(100, predictedCongestion)),
      confidence,
      factors: {
        historicalPattern: Math.round(avgCongestion),
        dayOfWeekTrend: Math.round(dayAvgCongestion),
        seasonalFactor: Math.round(recentAvgCongestion),
        specialEventImpact: Math.round(specialEventImpact)
      },
      recommendation
    };
  }

  private getDefaultAnalysis(): TrendAnalysisResult {
    return {
      predictedCongestion: 50,
      confidence: 0.6,
      factors: {
        historicalPattern: 50,
        dayOfWeekTrend: 50,
        seasonalFactor: 50,
        specialEventImpact: 0
      },
      recommendation: "Moderate congestion expected based on typical patterns."
    };
  }

  private generateRecommendation(congestion: number, confidence: number, hour: number): string {
    const confidenceText = confidence > 0.8 ? "High confidence" : confidence > 0.6 ? "Medium confidence" : "Low confidence";
    
    if (congestion < 30) {
      return `${confidenceText}: Light traffic expected. Great time to travel.`;
    } else if (congestion < 60) {
      return `${confidenceText}: Moderate congestion expected. Allow extra time.`;
    } else {
      return `${confidenceText}: Heavy congestion expected. Consider alternative times.`;
    }
  }

  // Get trend summary for dashboard
  getTrendSummary(): {
    busiest: { hour: number; avgCongestion: number };
    quietest: { hour: number; avgCongestion: number };
    averageDelay: number;
    reliabilityScore: number;
  } {
    const hourlyAverages: { [hour: number]: number[] } = {};
    
    // Group by hour
    this.trends.forEach(trend => {
      if (!hourlyAverages[trend.hour]) {
        hourlyAverages[trend.hour] = [];
      }
      hourlyAverages[trend.hour].push(trend.congestionScore);
    });

    // Calculate averages
    const hourlyAvgCongestion: { hour: number; avgCongestion: number }[] = [];
    for (let hour = 0; hour < 24; hour++) {
      if (hourlyAverages[hour] && hourlyAverages[hour].length > 0) {
        const avg = hourlyAverages[hour].reduce((sum, val) => sum + val, 0) / hourlyAverages[hour].length;
        hourlyAvgCongestion.push({ hour, avgCongestion: Math.round(avg) });
      }
    }

    // Find busiest and quietest hours
    const busiest = hourlyAvgCongestion.reduce((max, current) => 
      current.avgCongestion > max.avgCongestion ? current : max
    );
    
    const quietest = hourlyAvgCongestion.reduce((min, current) => 
      current.avgCongestion < min.avgCongestion ? current : min
    );

    // Calculate overall metrics
    const avgDelay = this.trends.reduce((sum, trend) => sum + trend.avgDelayMinutes, 0) / this.trends.length;
    
    // Reliability score (based on consistency)
    const congestionValues = this.trends.map(trend => trend.congestionScore);
    const avgCongestion = congestionValues.reduce((sum, val) => sum + val, 0) / congestionValues.length;
    const variance = congestionValues.reduce((sum, val) => sum + Math.pow(val - avgCongestion, 2), 0) / congestionValues.length;
    const reliability = Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) / 2)));

    return {
      busiest,
      quietest,
      averageDelay: Math.round(avgDelay),
      reliabilityScore: Math.round(reliability)
    };
  }

  // Add new historical data point (for real-time learning)
  addHistoricalDataPoint(data: Omit<HistoricalTrendData, 'date' | 'dayOfWeek'>): void {
    const now = new Date();
    const newTrend: HistoricalTrendData = {
      ...data,
      date: now.toISOString().split('T')[0],
      dayOfWeek: now.getDay()
    };
    
    this.trends.push(newTrend);
    
    // Keep only last 90 days of data to prevent unlimited growth
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    
    this.trends = this.trends.filter(trend => trend.date >= cutoffStr);
  }
}

export const historicalTrendsService = new HistoricalTrendsService();