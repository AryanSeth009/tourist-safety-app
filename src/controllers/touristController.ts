import { Request, Response } from 'express'
import { getFabricContract } from '../services/fabricService'
import { TouristIDService } from '../../services/tourist-id-service/src/touristService'

const touristIDService = new TouristIDService(getFabricContract())

export const createTouristId = async (req: Request, res: Response) => {
  try {
    const { kycData, itinerary, emergencyContacts, entryPoint } = req.body
    const touristId = await touristIDService.createDigitalID({ kycData, itinerary, emergencyContacts, entryPoint })
    res.status(201).json({ message: 'Tourist ID created successfully', touristId })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create tourist ID', error: error.message })
  }
}

export const getTouristId = async (req: Request, res: Response) => {
  try {
    const { touristId } = req.params
    const tourist = await touristIDService.getTouristID(touristId)
    res.status(200).json(tourist)
  } catch (error: any) {
    res.status(404).json({ message: 'Tourist ID not found', error: error.message })
  }
}

export const verifyTouristId = async (req: Request, res: Response) => {
  try {
    const { touristId } = req.params
    const verified = await touristIDService.verifyTouristID(touristId)
    res.status(200).json({ verified })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to verify tourist ID', error: error.message })
  }
}
