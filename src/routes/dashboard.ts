import { Router } from 'express'
import { getDashboardData, getAlerts } from '../controllers/dashboardController'

const dashboardRouter = Router()

dashboardRouter.get('/data', getDashboardData)
dashboardRouter.get('/alerts', getAlerts)

export { dashboardRouter }
