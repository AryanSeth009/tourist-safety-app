import { server } from './app'
import { initializeFabricGateway } from './services/fabricService'

const PORT = process.env.PORT || 3000

async function startServer() {
  await initializeFabricGateway()
  server.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`)
  })
}

startServer()
