import { Request, Response } from 'express'
import { getFabricContract } from '../services/fabricService'
import { EmergencyService, Location } from '../../services/emergency-service/src/emergencyService'
import { io } from '../app' // Import the Socket.IO server instance

const emergencyService = new EmergencyService(getFabricContract())

export const triggerEmergency = async (req: Request, res: Response) => {
  try {
    const { touristId, location } = req.body // touristId should come from auth middleware later
    const parsedLocation: Location = { ...location, timestamp: new Date(location.timestamp) };

    await emergencyService.handlePanicButton(touristId || 'dummyTouristId', parsedLocation)

    // Emit real-time alert to dashboard
    io.emit('new-emergency-alert', { touristId: touristId || 'dummyTouristId', location: parsedLocation, timestamp: new Date() })

    res.status(200).json({ message: 'Emergency triggered and recorded', status: 'EMERGENCY_RECORDED', efirNumber: `EFIR-${Date.now()}` })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to trigger emergency', error: error.message })
  }
}
