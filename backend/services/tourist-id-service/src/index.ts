import { Gateway, Wallets } from 'fabric-network'
import * as path from 'path'
import * as fs from 'fs'
import { TouristIDService } from './touristService'

const ccpPath = path.resolve(__dirname, '..', '..', 'hyperledger-network', 'organizations', 'peerOrganizations', 'tourism.example.com', 'connection-tourism.json')
const walletPath = path.resolve(__dirname, '..', '..', 'hyperledger-network', 'wallet')

let touristIDService: TouristIDService

async function initializeFabric() {
  try {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'))
    const wallet = await Wallets.newFileSystemWallet(walletPath)

    const gateway = new Gateway()
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } })

    const network = await gateway.getNetwork('tourist-safety-channel')
    const contract = network.getContract('tourist-id')
    
    touristIDService = new TouristIDService(contract)
    console.log("Hyperledger Fabric gateway and contract initialized for Tourist ID Service.")
  } catch (error) {
    console.error(`Failed to initialize Fabric for Tourist ID Service: ${error}`)
    process.exit(1)
  }
}

initializeFabric()

export { touristIDService }
