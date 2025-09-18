import { Router } from 'express'
import { recordLocation, getTouristLocationHistory } from '../controllers/locationController'

const locationRouter = Router()

locationRouter.post('/record', recordLocation)
locationRouter.get('/:touristId/history', getTouristLocationHistory)

export { locationRouter }
