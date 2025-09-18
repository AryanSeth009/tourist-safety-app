import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'http'

// Placeholder for services and routes - actual files will be created later
const fabricService = {} as any 
const authRouter = express.Router()
const touristRouter = express.Router()
const emergencyRouter = express.Router()
const locationRouter = express.Router()
const dashboardRouter = express.Router()

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
app.use('/api/tourist', touristRouter)
app.use('/api/emergency', emergencyRouter)
app.use('/api/location', locationRouter)
app.use('/api/dashboard', dashboardRouter)

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
