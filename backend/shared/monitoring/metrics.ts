import promClient from 'prom-client'

class MetricsService {
  private register: promClient.Registry
  
  // Custom metrics for tourist safety
  private touristLocationUpdates: promClient.Counter
  private emergencyAlerts: promClient.Counter
  private safetyScoreHistogram: promClient.Histogram
  private responseTimeHistogram: promClient.Histogram
  
  constructor() {
    this.register = new promClient.Registry()
    
    // Default metrics
    promClient.collectDefaultMetrics({ register: this.register })
    
    // Custom metrics
    this.touristLocationUpdates = new promClient.Counter({
      name: 'tourist_location_updates_total',
      help: 'Total number of tourist location updates',
      labelNames: ['tourist_id', 'region', 'risk_level']
    })
    
    this.emergencyAlerts = new promClient.Counter({
      name: 'emergency_alerts_total',
      help: 'Total number of emergency alerts',
      labelNames: ['alert_type', 'region', 'resolved']
    })
    
    this.safetyScoreHistogram = new promClient.Histogram({
      name: 'tourist_safety_score',
      help: 'Distribution of tourist safety scores',
      buckets: [0, 20, 40, 60, 80, 100]
    })
    
    this.responseTimeHistogram = new promClient.Histogram({
      name: 'emergency_response_time_seconds',
      help: 'Time taken to respond to emergency alerts',
      buckets: [1, 5, 10, 30, 60, 300] // 1s, 5s, 10s, 30s, 1m, 5m
    })
    
    this.register.registerMetric(this.touristLocationUpdates)
    this.register.registerMetric(this.emergencyAlerts)
    this.register.registerMetric(this.safetyScoreHistogram)
    this.register.registerMetric(this.responseTimeHistogram)
  }
  
  recordLocationUpdate(touristId: string, region: string, riskLevel: string) {
    this.touristLocationUpdates.inc({ tourist_id: touristId, region, risk_level: riskLevel })
  }
  
  recordEmergencyAlert(alertType: string, region: string, resolved: boolean = false) {
    this.emergencyAlerts.inc({ alert_type: alertType, region, resolved: resolved.toString() })
  }
  
  recordSafetyScore(score: number) {
    this.safetyScoreHistogram.observe(score)
  }
  
  recordEmergencyResponseTime(timeInSeconds: number) {
    this.responseTimeHistogram.observe(timeInSeconds)
  }
  
  getMetrics(): string {
    return this.register.metrics()
  }
}

export const metricsService = new MetricsService()
