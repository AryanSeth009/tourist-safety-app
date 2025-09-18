from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import numpy as np
import tensorflow as tf # Assuming TensorFlow is installed for model loading
from datetime import datetime

app = FastAPI(title="Tourist Safety AI Service")

class LocationPoint(BaseModel):
    latitude: float
    longitude: float
    timestamp: datetime
    speed: float

class AnomalyRequest(BaseModel):
    tourist_id: str
    location_history: List[LocationPoint]
    planned_itinerary: List[Dict]

class AnomalyResponse(BaseModel):
    is_anomalous: bool
    risk_level: str
    confidence: float
    reasons: List[str]
    safety_score: int

class AnomalyDetectionModel:
    def __init__(self):        
        # Placeholder for loading a pre-trained TensorFlow model
        # In a real scenario, this would load a model from disk, e.g.,
        # self.model = tf.keras.models.load_model('models/anomaly_detection_model.h5')
        print("AnomalyDetectionModel initialized. (No model loaded in placeholder)")
        self.model = None # Placeholder
    
    def detect_anomalies(self, request: AnomalyRequest) -> AnomalyResponse:
        # Placeholder for feature extraction logic
        features = self.extract_features(request.location_history, request.planned_itinerary)
        
        # Placeholder for anomaly detection logic
        # In a real scenario, self.model.predict would be used here
        anomaly_score = 0.5 # Dummy score
        
        return AnomalyResponse(
            is_anomalous=anomaly_score > 0.7,
            risk_level=self.get_risk_level(anomaly_score),
            confidence=float(anomaly_score),
            reasons=self.get_anomaly_reasons(features, anomaly_score),
            safety_score=self.calculate_safety_score(features, anomaly_score)
        )
    
    def extract_features(self, locations: List[LocationPoint], itinerary: List[Dict]) -> np.ndarray:
        # Feature extraction logic
        # - Speed patterns
        # - Route deviation from planned itinerary
        # - Time spent in high-risk areas
        # - Unusual movement patterns
        # - Night time activity
        print("Extracting features...")
        return np.array([0.1, 0.2, 0.3]) # Dummy features

    def get_risk_level(self, anomaly_score: float) -> str:
        if anomaly_score > 0.8: return "HIGH"
        if anomaly_score > 0.5: return "MEDIUM"
        return "LOW"

    def get_anomaly_reasons(self, features: np.ndarray, anomaly_score: float) -> List[str]:
        reasons = []
        if anomaly_score > 0.7: reasons.append("Unusual activity detected")
        return reasons

    def calculate_safety_score(self, features: np.ndarray, anomaly_score: float) -> int:
        return max(0, 100 - int(anomaly_score * 100))

model = AnomalyDetectionModel()

@app.post("/detect-anomaly", response_model=AnomalyResponse)
async def detect_anomaly(request: AnomalyRequest):
    try:
        result = model.detect_anomalies(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
