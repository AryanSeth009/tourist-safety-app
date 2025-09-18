import { Router } from 'express'
import { createTouristId, getTouristId, verifyTouristId } from '../controllers/touristController'

const touristRouter = Router()

touristRouter.post('/create-id', createTouristId)
touristRouter.get('/:touristId', getTouristId)
touristRouter.get('/verify/:touristId', verifyTouristId)

export { touristRouter }
