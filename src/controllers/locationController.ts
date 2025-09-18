import { Request, Response } from 'express'
import { getFabricContract } from '../services/fabricService'
import { LocationService, LocationData } from '../../services/location-service/src/locationService'
import { io } from '../app' // Import the Socket.IO server instance

const locationService = new LocationService(getFabricContract())

export const recordLocation = async (req: Request, res: Response) => {
  try {
    const { touristId, latitude, longitude, address, riskLevel, timestamp } = req.body
    const locationData: LocationData = {
      touristId,
      latitude,
      longitude,
      address,
      riskLevel,
      timestamp: new Date(timestamp)
    }
    await locationService.recordLocation(locationData)

    // Emit real-time location update to dashboard
    io.to(`authority-${'defaultRegion'}`).emit('tourist-location-update', locationData)

    res.status(200).json({ message: 'Location recorded successfully' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to record location', error: error.message })
  }
}

export const getTouristLocationHistory = async (req: Request, res: Response) => {
  try {
    const { touristId } = req.params
    const history = await locationService.getTouristLocationHistory(touristId)
    res.status(200).json(history)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to retrieve location history', error: error.message })
  }
}
