import { Request, Response } from 'express'

export const getDashboardData = (req: Request, res: Response) => {
  // Placeholder for fetching dashboard data
  res.status(200).json({ message: 'Dashboard data (placeholder)' })
}

export const getAlerts = (req: Request, res: Response) => {
  // Placeholder for fetching alerts
  res.status(200).json({ message: 'Alerts data (placeholder)' })
}
