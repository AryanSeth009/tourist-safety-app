#!/bin/bash
# deployment/deploy.sh

set -e

echo "🚀 Deploying Smart Tourist Safety System..."

# 1. Setup Hyperledger Fabric Network
echo "📡 Setting up Hyperledger Fabric network..."
cd ../hyperledger-network
# This script assumes that 'network.sh' and 'deployCC.sh' exist and are executable.
# You would typically generate crypto materials and artifacts before this step.
# For a full setup, you'd need to run cryptogen, configtxgen, etc., which are part of Fabric Samples.
# ./scripts/network.sh up createChannel -c tourist-safety-channel -ca
# ./scripts/deployCC.sh tourist-safety-channel tourist-id ../chaincode/tourist-id

# Placeholder for Fabric network setup using docker-compose from the main deployment directory
echo "WARNING: Hyperledger Fabric network setup commands are commented out. Please ensure Fabric is running or uncomment and adapt these lines for your environment."

cd ../deployment/docker # Navigate back to deployment/docker for docker-compose.yml

# 2. Build and deploy services
echo "🏗️ Building microservices..."
docker-compose -f docker-compose.yml build

# 3. Run database migrations (placeholder - assuming api-gateway has migration scripts)
echo "💾 Running database migrations..."
docker-compose -f docker-compose.yml run --rm api-gateway npm run migrate || echo "No migration script found or migration failed. Proceeding."

# 4. Deploy to production
echo "🌐 Deploying to production..."
docker-compose -f docker-compose.yml up -d

# 5. Health checks
echo "🏥 Running health checks..."
sleep 30 # Give services time to start
curl -f http://localhost:3000/health || echo "API Gateway health check failed. Please check logs." # Assuming a health endpoint
curl -f http://localhost:8000/health || echo "AI Service health check failed. Please check logs." # Assuming a health endpoint

# 6. Setup monitoring (placeholder for Prometheus/Grafana docker-compose)
echo "📊 Setting up monitoring..."
# docker-compose -f monitoring/docker-compose.yml up -d # Uncomment if you have a separate monitoring compose file
echo "WARNING: Monitoring setup commands are commented out. Please ensure monitoring is set up manually or uncomment and adapt these lines for your environment."

echo "✅ Deployment complete!"
echo "📱 React Native app should connect to: http://your-domain:3000"
echo "🖥️ Dashboard available at: http://your-domain:3001"
echo "📊 Monitoring at: http://your-domain:3002" # Update as per your monitoring setup
