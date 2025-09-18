import { Gateway, Wallets } from 'fabric-network'
import * as path from 'path'
import * as fs from 'fs'
import { EmergencyService } from './emergencyService'

<<<<<<< HEAD
const ccpPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'hyperledger-network',
  'organizations',
  'peerOrganizations',
  'tourism.example.com',
  'connection-tourism.json'
)
const walletPath = path.resolve(__dirname, '..', '..', '..', 'hyperledger-network', 'wallet')
=======
const ccpPath = path.resolve(__dirname, '..', '..', 'hyperledger-network', 'organizations', 'peerOrganizations', 'tourism.example.com', 'connection-tourism.json')
const walletPath = path.resolve(__dirname, '..', '..', 'hyperledger-network', 'wallet')
>>>>>>> e9e2b4d04e0172ab4568bfcddf0a5ee1c9ed73ab

let emergencyService: EmergencyService

async function initializeFabric() {
  try {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'))
    const wallet = await Wallets.newFileSystemWallet(walletPath)

    const gateway = new Gateway()
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } })

    const network = await gateway.getNetwork('tourist-safety-channel')
    const contract = network.getContract('tourist-id')
    
    emergencyService = new EmergencyService(contract)
    console.log("Hyperledger Fabric gateway and contract initialized for Emergency Service.")
  } catch (error) {
    console.error(`Failed to initialize Fabric for Emergency Service: ${error}`)
<<<<<<< HEAD
    // Do not exit; allow service to run in degraded mode for local dev.
=======
    process.exit(1)
>>>>>>> e9e2b4d04e0172ab4568bfcddf0a5ee1c9ed73ab
  }
}

initializeFabric()

export { emergencyService }
