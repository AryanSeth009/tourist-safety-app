import { Gateway, Wallets, Wallet, X509Identity } from 'fabric-network'
import * as path from 'path'
import * as fs from 'fs'

let gateway: Gateway | undefined
let network: any
let contract: any
let wallet: Wallet

async function initializeFabricGateway() {
  try {
    const ccpPath = path.resolve(__dirname, '..', '..', 'hyperledger-network', 'organizations', 'peerOrganizations', 'tourism.example.com', 'connection-tourism.json')
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'))

    const walletPath = path.resolve(__dirname, '..', '..', 'hyperledger-network', 'wallet')
    wallet = await Wallets.newFileSystemWallet(walletPath)

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser')
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet')
        console.log('Run the registerUser.ts application before retrying')
        throw new Error('User identity not found in wallet')
    }
    
    gateway = new Gateway()
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } })
    network = await gateway.getNetwork('tourist-safety-channel')
    contract = network.getContract('tourist-id')

    console.log("Hyperledger Fabric Gateway initialized successfully.")
  } catch (error) {
    console.error(`Failed to initialize Fabric Gateway: ${error}`)
    // Depending on your deployment strategy, you might want to exit or handle this more gracefully
    // For a robust service, implement retry mechanisms
    // process.exit(1)
  }
}

function getFabricContract(): any {
  if (!contract) {
    throw new Error("Fabric contract not initialized. Call initializeFabricGateway first.")
  }
  return contract
}

function getFabricNetwork(): any {
  if (!network) {
    throw new Error("Fabric network not initialized. Call initializeFabricGateway first.")
  }
  return network
}

function getFabricGateway(): Gateway {
  if (!gateway) {
    throw new Error("Fabric gateway not initialized. Call initializeFabricGateway first.")
  }
  return gateway
}

export { initializeFabricGateway, getFabricContract, getFabricNetwork, getFabricGateway }
