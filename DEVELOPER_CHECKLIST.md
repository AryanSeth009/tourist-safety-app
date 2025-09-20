# Smart Tourist Safety Monitoring & Incident Response System

## Project Overview

This project is a **Smart Tourist Safety Monitoring & Incident Response System** designed to ensure the safety of tourists through a comprehensive mobile application and a robust backend infrastructure. The system leverages **Hyperledger Fabric blockchain** for secure and immutable digital tourist IDs and incident records, coupled with a microservices architecture for real-time monitoring, AI-powered anomaly detection, and efficient emergency response. The frontend is built with **React Native**, providing a rich and responsive mobile experience.

**Key Features:**
-   **Digital Tourist ID**: Secure, blockchain-based identity management for tourists.
-   **Location Tracking & Geo-fencing**: Real-time monitoring of tourist locations and alerts for entry/exit from predefined safety zones.
-   **Panic Button**: Instant emergency activation with location sharing and alerts to authorities/contacts.
-   **AI Anomaly Detection**: Proactive identification of unusual tourist behavior based on movement patterns and itineraries.
-   **Real-time Incident Response**: Integration with emergency services for rapid assistance.
-   **Tourism Department Dashboard**: A web-based interface for authorities to monitor tourists, manage alerts, and generate reports.
-   **Multilingual Support**: Catering to a diverse tourist base.

---

## 0. Quickstart (TL;DR)

Use separate terminals for each step. On Windows PowerShell, use `;` instead of `&&` to chain commands.

1) Install dependencies
```bash
# Root Next.js (web)
cd E:\tourist-safety-app; npm install

# API Gateway
cd E:\tourist-safety-app\backend\api-gateway; npm install

# Microservices
cd E:\tourist-safety-app\backend\services\tourist-id-service; npm install
cd E:\tourist-safety-app\backend\services\emergency-service; npm install
cd E:\tourist-safety-app\backend\services\location-service; npm install
cd E:\tourist-safety-app\backend\services\notification-service; npm install

# Expo (mobile app)
cd E:\tourist-safety-app\rn; npm install
```

2) Start apps (one terminal each)
```bash
# Web (Next.js)
cd E:\tourist-safety-app; npm run dev   # http://localhost:3000 (or next free port)

# API Gateway
cd E:\tourist-safety-app\backend\api-gateway; npm run dev   # http://localhost:4000

# Microservices
cd E:\tourist-safety-app\backend\services\tourist-id-service; npm run dev
cd E:\tourist-safety-app\backend\services\emergency-service; npm run dev
cd E:\tourist-safety-app\backend\services\location-service; npm run dev
cd E:\tourist-safety-app\backend\services\notification-service; npm run dev

# Expo (mobile)
cd E:\tourist-safety-app\rn; npx expo start   # press w for web, a for Android
```

3) Hyperledger Fabric (optional for local dev)
- Services run in degraded mode without Fabric. To enable Fabric, follow 4.3 and ensure `backend/hyperledger-network/organizations/peerOrganizations/tourism.example.com/connection-tourism.json` and a wallet identity (e.g., `appUser`) exist.

## 1. Project Architecture

The system follows a **microservices architecture** with a clear separation of concerns, communicating via an API Gateway and leveraging a Hyperledger Fabric blockchain for critical data.

### 1.1 Frontend (React Native Mobile Application - `rn/`)

The mobile application is a React Native (Expo) project that serves as the primary interface for tourists. It's designed for real-time safety monitoring and incident reporting.

*   **User Interface**: Interactive map, panic button, safety score, alerts, profile, itinerary management.
*   **Mobile-Specific Features**: Location services (background tracking, geofencing), push notifications, haptic feedback, biometric authentication.
*   **Communication**: Interacts with the backend API Gateway via HTTP requests and real-time Socket.IO connections.

### 1.2 Backend (Microservices & Hyperledger Fabric - `backend/`)

The backend is composed of several independent microservices, an API Gateway, and a Hyperledger Fabric blockchain network.

*   **Hyperledger Fabric Network**: Provides a decentralized, immutable ledger for sensitive tourist data (digital IDs, emergency records).
*   **API Gateway**: Central entry point for all frontend requests, handling routing, authentication, and communication with various microservices and the Fabric network.
*   **Microservices**: Specialized services handling specific business logic (e.g., Tourist ID management, Emergency Response, AI Anomaly Detection).
*   **Databases**: PostgreSQL for structured data (user profiles, itineraries) and Redis for caching and real-time data.

### 1.3 Data Flow & Interactions

1.  **Tourist Registration**:
    *   RN App sends KYC data to API Gateway.
    *   API Gateway forwards to Tourist ID Service.
    *   Tourist ID Service hashes sensitive data and creates a digital ID on the Hyperledger Fabric blockchain via its chaincode.
    *   Off-chain data (e.g., full KYC, photos) is stored in a secure PostgreSQL database.
2.  **Location Tracking**:
    *   RN App sends real-time location updates to API Gateway via Socket.IO.
    *   API Gateway forwards to Location Tracking Service (and potentially AI Anomaly Detection Service).
    *   Location data is recorded on-chain (immutable record) and off-chain (for analytics).
3.  **Emergency Activation (Panic Button)**:
    *   RN App triggers panic event.
    *   API Gateway forwards to Emergency Response Service.
    *   Emergency Response Service records incident on blockchain, alerts nearest police, notifies emergency contacts, and generates an automated E-FIR.
    *   Real-time alerts are pushed to the Tourism Department Dashboard via Socket.IO.
4.  **Anomaly Detection**:
    *   Location Tracking Service (or a dedicated AI orchestrator) sends tourist movement data to AI Anomaly Detection Service.
    *   AI Service analyzes patterns against planned itineraries and historical data.
    *   If an anomaly is detected, an alert is sent to the Emergency Response Service and subsequently to the dashboard and tourist's app.
5.  **Dashboard Interactions**:
    *   Tourism Department Dashboard (Next.js) fetches data from API Gateway.
    *   Dashboard receives real-time alerts and location updates via Socket.IO.
    *   Authorities can verify Tourist IDs, manage E-FIRs, and view safety analytics.

---

## 2. Tech Stack

### 2.1 Frontend Stack (`rn/`)

*   **Framework**: React Native with Expo (for simplified development and build process)
*   **Language**: TypeScript + React 18
*   **Styling**: NativeWind v4 (Tailwind CSS for React Native)
*   **UI Components**: Custom React Native equivalents (inspired by Radix UI / shadcn/ui), `react-native-maps`, `lucide-react-native`
*   **Navigation**: React Navigation v6 (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`, `@react-navigation/drawer`)
*   **Forms & Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`
*   **State Management**: Zustand / React Context API
*   **Charts**: Victory Native / React Native Chart Kit
*   **Date Handling**: `date-fns`
*   **Location Services**: `expo-location`, `expo-notifications`
*   **Local Storage**: `expo-secure-store`, `@react-native-async-storage/async-storage`
*   **Camera/Media**: `expo-camera`, `expo-image-picker`
*   **Biometrics**: `expo-local-authentication`
*   **Toasts/Alerts**: `react-native-toast-message`
*   **HTTP Client**: `axios`
*   **Theme Management**: `react-native-appearance`
*   **Real-time Communication**: `socket.io-client`

### 2.2 Backend Stack (`backend/`)

*   **Blockchain**: Hyperledger Fabric 2.5+
*   **Chaincode (Smart Contracts)**: Go (for Tourist ID, Location, Emergency) / JavaScript (alternative)
*   **API Gateway**: Node.js + Express
*   **Microservices**:
    *   **Tourist ID Service**: Node.js
    *   **Emergency Response Service**: Node.js
    *   **AI/ML Anomaly Detection Service**: Python + FastAPI + TensorFlow
    *   (Planned: Location Tracking, Notification, Real-time Communication Services using Node.js)
*   **Database**: PostgreSQL (for persistent structured data), Redis (for caching, queue, real-time data)
*   **Real-time Communication**: Socket.io
*   **Queue**: Redis / Bull Queue (for async tasks like notifications, E-FIR generation)
*   **Monitoring**: Prometheus + Grafana
*   **Deployment**: Docker + Kubernetes
*   **Tourism Department Dashboard**: Next.js (TypeScript, Tailwind CSS, App Router)
*   **Shared Utilities**: TypeScript/JavaScript for encryption, logging (Winston), environment management (Dotenv).
*   **Authentication/Authorization**: JWT, `bcryptjs`, `joi` (for validation)

---

## 3. Component Breakdown

### 3.1 React Native Frontend Components (`rn/`)

*   **`rn/App.tsx`**: Main entry point, sets up `NavigationContainer` and `AppNavigator`.
*   **`rn/src/navigation/`**:
    *   `AppNavigator.tsx`: Root stack navigator (`Main`, `Emergency`).
    *   `TabNavigator.tsx`: Bottom tab navigator for core app screens (`Home`, `Dashboard`, `Itinerary`, `Alerts`, `Profile`).
*   **`rn/src/screens/`**:
    *   `HomeScreen.tsx`: Landing screen.
    *   `DashboardScreen.tsx`: Main user dashboard with safety score, map, quick actions, and recent alerts.
    *   `EmergencyScreen.tsx`: Dedicated screen for emergency actions (e.g., panic button confirmation).
    *   `ItineraryScreen.tsx`: Manages planned travel routes.
    *   `AlertsScreen.tsx`: Displays a list of safety alerts and notifications.
    *   `ProfileScreen.tsx`: User profile and settings.
*   **`rn/src/components/`**:
    *   `PanicButton.tsx`: Hold-to-activate emergency button with haptic feedback.
    *   `MapWidget.tsx`: Displays interactive map with current location, safe zones, and alerts (using `react-native-maps`).
    *   `SafetyScoreWidget.tsx`: Visualizes tourist safety score (planned, likely using Victory Native).
    *   `EmergencyAlert.tsx`, `GeoFenceAlert.tsx`, `MobileNav.tsx`, `MobileOptimizations.tsx`, `ThemeProvider.tsx` (planned conversions from Next.js).
*   **`rn/src/components/ui/`**: Converted shadcn/ui-style components (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`, `AlertDialog.tsx` - work in progress).
*   **`rn/src/hooks/`**:
    *   `useMobile.ts` (adapt for RN mobile state).
    *   `useToast.ts` (adapt for `react-native-toast-message`).
    *   `useLocation.ts` (new: `expo-location` integration).
    *   `useNotifications.ts` (new: `expo-notifications` integration).
    *   `useBiometrics.ts` (new: `expo-local-authentication` integration).
*   **`rn/src/services/`**:
    *   `ApiService.ts`: Handles HTTP requests to the backend API Gateway.
    *   `LocationService.ts`: Manages background location tracking and geofencing.
    *   `NotificationService.ts`: Manages local and push notifications.
    *   `BlockchainService.ts`: Encapsulates interaction with the Tourist ID and Emergency chaincode via the API Gateway.
    *   `SocketService.ts`: Manages real-time communication with the backend.
*   **`rn/src/utils/`**: Utility functions (e.g., `utils.ts`).
*   **`rn/src/store/`**:
    *   `useAppStore.ts`: Zustand store for global application state (user, location, safety score, alerts).
*   **`rn/src/types/`**: TypeScript type definitions.

### 3.2 Backend Services (`backend/`)

*   **`backend/hyperledger-network/`**:
    *   **`organizations/`**: Stores crypto material for Orderer and Peer organizations (TourismDept, Police).
    *   **`configtx/configtx.yaml`**: Defines the network topology, organizations, and capabilities.
    *   **`docker/docker-compose-network.yaml`**: Docker Compose file to spin up the Fabric Orderer and Peer nodes.
    *   **`chaincode/tourist-id/main.go`**: Go-based smart contract for Tourist ID, Location Records, Emergency Alerts, and Safety Score updates.
    *   **`scripts/`**: Placeholder for network setup and chaincode deployment scripts (`network.sh`, `deployCC.sh`).
*   **`backend/api-gateway/`**: (Node.js + Express)
    *   **`src/app.ts`**: Express application setup, middleware, main route definitions, Socket.IO server.
    *   **`src/index.ts`**: Entry point for the API Gateway server.
    *   **`routes/`**: API endpoint definitions (`auth`, `tourist`, `emergency`, `location`, `dashboard`).
    *   **`middleware/`**: Authentication, authorization, error handling.
    *   **`controllers/`**: Request handling logic, orchestrating calls to microservices and Fabric.
    *   **`package.json`**: Node.js project configuration and dependencies (`express`, `cors`, `helmet`, `morgan`, `compression`, `fabric-network`, `jsonwebtoken`, `bcryptjs`, `joi`, `dotenv`, `winston`, `socket.io`).
    *   **`tsconfig.json`**: TypeScript configuration.
*   **`backend/services/tourist-id-service/`**: (Node.js)
    *   **`src/touristService.ts`**: Core logic for interacting with the Tourist ID chaincode (create, verify, update).
    *   **`src/index.ts`**: Fabric gateway initialization and exposure of `TouristIDService`.
    *   **`package.json`, `tsconfig.json`**: Project configuration.
*   **`backend/services/emergency-service/`**: (Node.js)
    *   **`src/emergencyService.ts`**: Core logic for handling panic buttons, recording emergencies, alerting authorities, notifying contacts, and generating E-FIRs.
    *   **`src/index.ts`**: Fabric gateway initialization and exposure of `EmergencyService`.
    *   **`package.json`, `tsconfig.json`**: Project configuration.
*   **`backend/services/ai-anomaly-service/`**: (Python + FastAPI)
    *   **`main.py`**: FastAPI application with endpoints for anomaly detection, `AnomalyDetectionModel` (placeholder for TensorFlow integration).
    *   **`requirements.txt`**: Python dependencies (`fastapi`, `pydantic`, `numpy`, `tensorflow`, `uvicorn`).
    *   **`README.md`**: Setup and API documentation for the AI service.
*   **`backend/dashboard/tourism-admin-dashboard/`**: (Next.js)
    *   A separate Next.js application for tourism authorities with features like real-time map, alerts panel, analytics, E-FIR management.
    *   **`package.json`**: Dependencies (`recharts`, `lucide-react`, `socket.io-client`, `@shadcn/ui`).
*   **`backend/shared/`**:
    *   **`models/`**: Shared data models/interfaces.
    *   **`utils/encryption.ts`**: Utility for data encryption and hashing.
    *   **`monitoring/metrics.ts`**: Prometheus client setup for custom metrics.
    *   **`i18n-service/`**: Multilingual translation service.
*   **`backend/deployment/`**:
    *   **`docker/docker-compose.yml`**: Orchestrates all backend microservices, databases, and Fabric network components for deployment.
    *   **`deploy.sh`**: A shell script for automating the full deployment process (Fabric setup, service builds, docker-compose up).
*   **`backend/.env.production`**: Environment variables for production deployment.

---

## 4. Getting Started: Setup & Local Development

### 4.1 Prerequisites

Ensure you have the following installed:

*   **Node.js (LTS) & npm**
*   **Python 3.8+ & pip**
*   **Go (latest stable)**
*   **Docker & Docker Compose**
*   **Git**
*   **A Unix-like terminal environment (e.g., Git Bash on Windows, WSL, macOS Terminal, Linux)**: This is crucial for running Hyperledger Fabric scripts and Docker Compose commands effectively.
*   **Expo CLI**: `npm install -g expo-cli`
*   **Hyperledger Fabric Binaries & Samples**: (Manual step, usually via `install-fabric.sh` script)

### 4.2 Frontend Setup (React Native - `rn/`)

1.  **Navigate to the React Native project root**:
    ```bash
    cd rn
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Expo development server**:
    ```bash
    npx expo start
    ```
    *   Scan the QR code with your Expo Go app on a physical device or run on an iOS/Android simulator.

### 4.3 Backend Setup (Hyperledger Fabric & Microservices - `backend/`)

**Important**: This setup assumes you have a Unix-like environment and Docker running.

1.  **Navigate to the project root**:
    ```bash
    cd <project_root_directory> # e.g., cd "C:\Users\student\Desktop\VEDANT 3rdY\tourist-safety-app"
    ```
2.  **Hyperledger Fabric Network Setup**:
    *   **Navigate to the Fabric network directory**:
        ```bash
        cd backend/hyperledger-network
        ```
    *   **Download Fabric Samples & Binaries**: (If not already done)
        ```bash
        curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh | bash -s
        ```
        *   This will download `fabric-samples`, `bin` directory with `cryptogen`, `configtxgen` etc.
    *   **Generate Crypto Material and Start Network (Manual steps using Fabric Samples scripts - *highly recommended to follow official Fabric documentation for precise steps*)**:
        *   Typically, you'd use scripts like `network.sh` from `fabric-samples/test-network` to:
            *   Generate crypto material for organizations (`cryptogen`).
            *   Generate channel artifacts (`configtxgen`).
            *   Start the Fabric network (Orderer, Peers, CA servers).
            *   Create a channel (e.g., `tourist-safety-channel`).
            *   Join peers to the channel.
            *   Deploy the `tourist-id` chaincode.
        *   **Example (Conceptual - *refer to `fabric-samples/test-network/network.sh` for actual commands*)**:
            ```bash
            # cd to fabric-samples/test-network/
            # ./network.sh up -ca -s couchdb # Start network with Certificate Authorities and CouchDB
            # ./network.sh createChannel -c tourist-safety-channel # Create the channel
            # ./network.sh deployCC -ccn tourist-id -ccp ../../backend/hyperledger-network/chaincode/tourist-id -ccl go -c tourist-safety-channel # Deploy chaincode
            ```
        *   **Enroll an application user**: You'll need to enroll an identity (e.g., `appUser`) to interact with the network. This typically involves using `fabric-ca-client` to enroll an identity and creating a wallet (filesystem wallet in `backend/hyperledger-network/wallet`).
    *   **Ensure `connection-tourism.json` exists**: After setting up Fabric, a connection profile will be generated (or needs to be manually configured) in `backend/hyperledger-network/organizations/peerOrganizations/tourism.example.com/connection-tourism.json`. This is used by Node.js Fabric SDK.
3.  **API Gateway Setup (`backend/api-gateway/`)**:
    *   **Navigate to the API Gateway directory**:
        ```bash
        cd ../../api-gateway
        ```
    *   **Install dependencies**:
        ```bash
        npm install
        ```
    *   **Run in development mode**:
        ```bash
        npm run dev
        ```
        (This will watch for `.ts` changes and restart the server)

### 4.4 Run Everything (Quick Commands)

Open multiple terminals and run these commands. On Windows PowerShell, prefer `;` as the command separator.

```bash
# Terminal 1 – Next.js web
cd E:\tourist-safety-app; npm run dev

# Terminal 2 – API Gateway
cd E:\tourist-safety-app\backend\api-gateway; npm run dev

# Terminal 3 – Tourist ID service
cd E:\tourist-safety-app\backend\services\tourist-id-service; npm run dev

# Terminal 4 – Emergency service
cd E:\tourist-safety-app\backend\services\emergency-service; npm run dev

# Terminal 5 – Location service
cd E:\tourist-safety-app\backend\services\location-service; npm run dev

# Terminal 6 – Notification service
cd E:\tourist-safety-app\backend\services\notification-service; npm run dev

# Terminal 7 – Expo app (mobile)
cd E:\tourist-safety-app\rn; npx expo start
```

Tip: If ports are in use, the tools will prompt to use the next free port.

### 4.5 Common Issues and Fixes

- Port already in use (EADDRINUSE)
  - Kill the process or choose the next port when prompted.
- PowerShell rejects `&&`
  - Use `;` to chain commands (e.g., `cd path; npm run dev`).
- Expo bundling error: Cannot find module `babel-preset-expo`
  - Ensure it is installed as a devDependency in `rn/package.json`:
    ```bash
    cd rn; npm i -D babel-preset-expo
    ```
- Reanimated plugin/worklets error
  - Align versions that Expo expects and ensure Babel plugin is present:
    - In `rn/package.json`: `react-native-reanimated`: `~4.1.0` (per Expo notice)
    - DevDeps: `react-native-worklets`
    - `rn/babel.config.js` contains:
      ```js
      module.exports = function (api) {
	api.cache(true)
	return { presets: ['babel-preset-expo'], plugins: ['react-native-reanimated/plugin'] }
      }
      ```
  - Clear cache and restart: `npx expo start --clear`
- Android emulator not launching (adb/SDK not found)
  - Install Android Studio + SDK, set `ANDROID_HOME` or open Expo Go on a physical device.
- Location service missing `prom-client`
  - Install in service dir: `npm i prom-client @types/prom-client -D`
- Fabric JSON not found (`connection-tourism.json`)
  - Follow 4.3 to set up Fabric; until then, services run in degraded mode.

4.  **Tourist ID Service Setup (`backend/services/tourist-id-service/`)**:
    *   **Navigate to the service directory**:
        ```bash
        cd ../tourist-id-service
        ```
    *   **Install dependencies**:
        ```bash
        npm install
        ```
    *   **Run in development mode**:
        ```bash
        npm run dev
        ```
5.  **Emergency Response Service Setup (`backend/services/emergency-service/`)**:
    *   **Navigate to the service directory**:
        ```bash
        cd ../emergency-service
        ```
    *   **Install dependencies**:
        ```bash
        npm install
        ```
    *   **Run in development mode**:
        ```bash
        npm run dev
        ```
6.  **AI/ML Anomaly Detection Service Setup (`backend/services/ai-anomaly-service/`)**:
    *   **Navigate to the service directory**:
        ```bash
        cd ../ai-anomaly-service
        ```
    *   **Install Python dependencies**:
        ```bash
        pip install -r requirements.txt
        ```
    *   **Run the service**:
        ```bash
        uvicorn main:app --reload
        ```
7.  **Tourism Department Dashboard Setup (`backend/dashboard/tourism-admin-dashboard/`)**:
    *   **Navigate to the dashboard directory**:
        ```bash
        cd ../../dashboard/tourism-admin-dashboard
        ```
    *   **Install dependencies**:
        ```bash
        npm install
        ```
    *   **Run in development mode**:
        ```bash
        npm run dev
        ```
8.  **Environment Variables**:
    *   Create a `.env` file in each Node.js service (API Gateway, Tourist ID Service, Emergency Service) and the `backend/deployment` directory.
    *   Copy contents from `backend/.env.production` (created earlier) and adapt for local development (e.g., `asLocalhost: true` in Fabric SDK connection, local database URLs).

---

## 5. Key Interactions & Data Flow

### 5.1 Frontend (RN) to Backend (API Gateway)

*   **HTTP/REST**: For initial data fetching, user authentication, profile updates, and less real-time critical operations.
    *   `POST /api/auth/login`, `POST /api/tourist/create-id`, `POST /api/emergency/panic`
*   **Socket.IO**: For real-time location updates, emergency broadcasts, and immediate alerts.
    *   `emit('location-update', { touristId, location })`
    *   `on('emergency-confirmed', (data) => ...)`
    *   `on('geofence-alert', (data) => ...)`

### 5.2 API Gateway to Microservices/Hyperledger Fabric

*   **Microservices (Internal HTTP/RPC)**: API Gateway routes requests to appropriate internal services.
    *   Calls Tourist ID Service for blockchain interactions.
    *   Calls Emergency Service for incident handling.
    *   Calls AI Anomaly Detection Service for analysis.
*   **Hyperledger Fabric SDK**: Services directly interact with the Fabric network (peers, orderers) using the `fabric-network` SDK to submit transactions (write to ledger) or evaluate queries (read from ledger).

### 5.3 Blockchain Interactions (Chaincode)

*   **`CreateTouristID`**: Records hashed KYC data, itinerary, emergency contacts, validity, and initial safety score on the ledger.
*   **`RecordLocation`**: Stores an immutable record of a tourist's location with timestamp and risk level.
*   **`TriggerEmergency`**: Creates an emergency alert record with type, location, and status.
*   **`UpdateSafetyScore`**: Modifies a tourist's safety score on the ledger (e.g., based on AI analysis).
*   **`GetTouristID`**: Queries the ledger for a tourist's digital ID details.

---

## 6. Development Guidelines

*   **Security First**: Always prioritize user safety and data security. Use `expo-secure-store` for sensitive data on mobile, `crypto` for encryption/hashing in backend, and ensure robust authentication/authorization.
*   **Mobile-First Design**: Frontend components should be designed and tested primarily for mobile devices.
*   **Error Handling**: Implement comprehensive error handling and logging across all services.
*   **Immutability**: Understand and respect the immutability of blockchain data. Only record critical, non-sensitive data on-chain.
*   **Asynchronous Operations**: Utilize queues (e.g., Redis/Bull) for background tasks (notifications, E-FIR generation) to maintain responsiveness.
*   **Documentation**: Maintain clear code comments, API documentation (e.g., Swagger/OpenAPI for FastAPI), and update this `DEVELOPER_CHECKLIST.md`.
*   **Testing**: Write unit, integration, and end-to-end tests for all components.
*   **Performance**: Optimize for speed and responsiveness, especially for real-time features and emergency scenarios.
*   **Cross-Platform**: Be mindful of iOS/Android differences in React Native.
*   **Localization**: Ensure all user-facing strings are externalized for multilingual support.

---

## 7. Deployment

The project is designed for containerized deployment using Docker and Kubernetes.

*   **`backend/deployment/docker/docker-compose.yml`**: Defines all backend services (API Gateway, microservices, databases, Fabric components) as Docker containers.
*   **`backend/deployment/deploy.sh`**: A shell script to automate the full deployment process, including:
    1.  Hyperledger Fabric network setup (crypto material, channel creation, chaincode deployment).
    2.  Building Docker images for all services.
    3.  Running database migrations.
    4.  Deploying all services using Docker Compose.
    5.  Basic health checks.
    6.  (Optional) Monitoring setup.

---

## 8. Testing Strategy

*   **Unit Tests**: Isolated tests for individual functions and components (e.g., `lib/utils.ts`, `touristService.ts` methods).
*   **Integration Tests**: Test the interaction between different modules or services.
    *   **Backend**: `tests/integration/touristId.test.ts` (Supertest for API Gateway endpoints, ensuring interaction with Fabric).
    *   **Frontend**: Testing component interactions, navigation flows.
*   **End-to-End (E2E) Tests**: Simulate full user journeys across the RN app, API Gateway, and backend services.
*   **Performance Testing**: Stress testing for emergency scenarios and high user loads.
*   **Security Penetration Testing**: Regularly audit for vulnerabilities.
*   **Accessibility Testing**: Ensure WCAG compliance for both mobile and dashboard interfaces.

---

## 9. Special Considerations

*   **Permissions**: Gracefully handle mobile permissions (location, notifications, camera, biometrics).
*   **Offline Capability**: Design critical RN app features to work offline and synchronize when connectivity is restored.
*   **Battery Optimization**: Optimize location tracking frequency to minimize battery drain.
*   **Deep Linking**: Implement for emergency response (e.g., opening app to an emergency screen).
*   **Multilingual Support**: Ensure all text, including emergency messages, is available in supported languages (e.g., 12+ Indian languages).
*   **AI Model Management**: Strategy for training, versioning, and deploying AI models.

---

## 10. Contacts & Resources

*   **Development Team Contacts**: [Lead Developer, Security Specialist, DevOps Engineer, Product Manager Contact Info]
*   **External Services**: Documentation for Google Maps API, Twilio, FCM, government APIs (UIDAI, Passport), regional police APIs.
*   **Hyperledger Fabric Documentation**: [Official Fabric Docs Link]
*   **React Native / Expo Documentation**: [Official RN / Expo Docs Link]
*   **FastAPI Documentation**: [Official FastAPI Docs Link]

---

**Last Updated**: September 2025
**Version**: 1.1 (Post React Native & Backend Migration)
**Maintainer**: Development Team
