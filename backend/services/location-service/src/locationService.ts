import { Contract } from 'fabric-network'
import { metricsService } from '../../../shared/monitoring/metrics'

interface LocationData {
  touristId: string
  latitude: number
  longitude: number
  timestamp: Date
  address: string
  riskLevel: string
}

class LocationService {
  private contract: Contract

  constructor(contract: Contract) {
    this.contract = contract
  }

  async recordLocation(locationData: LocationData): Promise<void> {
    await this.contract.submitTransaction(
      'RecordLocation',
      locationData.touristId,
      locationData.latitude.toString(),
      locationData.longitude.toString(),
      locationData.address,
      locationData.riskLevel
    )
    metricsService.recordLocationUpdate(locationData.touristId, "unknown_region", locationData.riskLevel)
    console.log(`Location recorded for tourist ID: ${locationData.touristId}`)
  }

  async getTouristLocationHistory(touristId: string): Promise<LocationData[]> {
    // Placeholder for actual implementation to query location history from blockchain
    console.log(`Fetching location history for tourist ID: ${touristId}`)
    return []
  }
}

export { LocationService, LocationData }
