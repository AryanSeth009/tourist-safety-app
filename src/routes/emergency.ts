import { Router } from 'express'
import { triggerEmergency } from '../controllers/emergencyController'

const emergencyRouter = Router()

emergencyRouter.post('/panic', triggerEmergency)

export { emergencyRouter }
