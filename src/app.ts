import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'http'

import { fabricService, initializeFabricGateway } from './services/fabricService'
import { authRouter } from './routes/auth'
import { touristRouter } from './routes/tourist'
import { emergencyRouter } from './routes/emergency'
import { locationRouter } from './routes/location'
import { dashboardRouter } from './routes/dashboard'
import { authenticateToken, authorizeRoles } from './middleware/auth'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: "*" }
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRouter)
app.use('/api/tourist', authenticateToken, touristRouter)
app.use('/api/emergency', authenticateToken, emergencyRouter)
app.use('/api/location', authenticateToken, locationRouter)
app.use('/api/dashboard', authenticateToken, authorizeRoles(['admin', 'tourism_dept']), dashboardRouter)

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('join-tourist', (touristId) => {
    socket.join(`tourist-${touristId}`)
  })
  
  socket.on('join-authority', (authorityId) => {
    socket.join(`authority-${authorityId}`)
  })
})

export { app, server, io }
