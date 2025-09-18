# AI/ML Anomaly Detection Service

This service provides an API for detecting anomalies in tourist behavior based on location history and planned itineraries. It uses a FastAPI backend with a placeholder for a TensorFlow model for anomaly detection.

## Setup

1.  **Navigate to the service directory:**
    ```bash
    cd backend/services/ai-anomaly-service
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the service:**
    ```bash
    uvicorn main:app --reload
    ```

## API Endpoints

-   **POST `/detect-anomaly`**: Detects anomalies in tourist behavior.

    Request Body (JSON):
    ```json
    {
      "tourist_id": "string",
      "location_history": [
        {
          "latitude": 0,
          "longitude": 0,
          "timestamp": "2024-01-01T12:00:00Z",
          "speed": 0
        }
      ],
      "planned_itinerary": [
        {}
      ]
    }
    ```

    Response Body (JSON):
    ```json
    {
      "is_anomalous": true,
      "risk_level": "HIGH",
      "confidence": 0.9,
      "reasons": [
        "Unusual activity detected"
      ],
      "safety_score": 50
    }
    ```

## Placeholder Model

Currently, the `AnomalyDetectionModel` uses placeholder logic for feature extraction and anomaly detection. In a production environment, you would train and load a real TensorFlow model (`models/anomaly_detection_model.h5`) for accurate predictions.
