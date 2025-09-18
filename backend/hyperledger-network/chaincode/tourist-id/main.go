package main

import (
    "encoding/json"
    "fmt"
    "time"
    "crypto/sha256"
    "encoding/hex"

    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type TouristIDContract struct {
    contractapi.Contract
}

type TouristID struct {
    ID                string    `json:"id"`
    AadharHash        string    `json:"aadharHash"`
    PassportHash      string    `json:"passportHash"`
    ItineraryHash     string    `json:"itineraryHash"`
    EmergencyContacts []string  `json:"emergencyContacts"`
    ValidFrom         time.Time `json:"validFrom"`
    ValidUntil        time.Time `json:"validUntil"`
    IsActive          bool      `json:"isActive"`
    SafetyScore       int       `json:"safetyScore"`
    CreatedBy         string    `json:"createdBy"`
    LastUpdated       time.Time `json:"lastUpdated"`
}

type LocationRecord struct {
    TouristID   string    `json:"touristId"`
    Latitude    float64   `json:"latitude"`
    Longitude   float64   `json:"longitude"`
    Timestamp   time.Time `json:"timestamp"`
    Address     string    `json:"address"`
    RiskLevel   string    `json:"riskLevel"`
}

type EmergencyAlert struct {
    ID          string    `json:"id"`
    TouristID   string    `json:"touristId"`
    AlertType   string    `json:"alertType"`
    Location    string    `json:"location"`
    Timestamp   time.Time `json:"timestamp"`
    Status      string    `json:"status"`
    Description string    `json:"description"`
}

func (s *TouristIDContract) CreateTouristID(ctx contractapi.TransactionContextInterface, 
    aadhar string, passport string, itinerary string, emergencyContacts []string) (*TouristID, error) {
    
    // Hash sensitive data
    aadharHash := s.hashData(aadhar)
    passportHash := s.hashData(passport)
    itineraryHash := s.hashData(itinerary)
    
    // Generate unique ID
    touristID := s.generateTouristID(aadharHash, passportHash)
    
    // Check if tourist ID already exists
    existingID, err := s.GetTouristID(ctx, touristID)
    if err == nil && existingID != nil {
        return nil, fmt.Errorf("Tourist ID already exists")
    }
    
    tourist := &TouristID{
        ID:                touristID,
        AadharHash:        aadharHash,
        PassportHash:      passportHash,
        ItineraryHash:     itineraryHash,
        EmergencyContacts: emergencyContacts,
        ValidFrom:         time.Now(),
        ValidUntil:        time.Now().AddDate(0, 0, 30), // 30 days validity
        IsActive:          true,
        SafetyScore:       100,
        CreatedBy:         ctx.GetClientIdentity().GetID(),
        LastUpdated:       time.Now(),
    }
    
    touristJSON, err := json.Marshal(tourist)
    if err != nil {
        return nil, err
    }
    
    err = ctx.GetStub().PutState(touristID, touristJSON)
    if err != nil {
        return nil, err
    }
    
    return tourist, nil
}

func (s *TouristIDContract) GetTouristID(ctx contractapi.TransactionContextInterface, 
    touristID string) (*TouristID, error) {
    
    touristJSON, err := ctx.GetStub().GetState(touristID)
    if err != nil {
        return nil, fmt.Errorf("Failed to read tourist ID: %v", err)
    }
    if touristJSON == nil {
        return nil, fmt.Errorf("Tourist ID does not exist")
    }
    
    var tourist TouristID
    err = json.Unmarshal(touristJSON, &tourist)
    if err != nil {
        return nil, err
    }
    
    return &tourist, nil
}

func (s *TouristIDContract) RecordLocation(ctx contractapi.TransactionContextInterface,
    touristID string, latitude float64, longitude float64, address string, riskLevel string) error {
    
    // Verify tourist ID exists and is active
    tourist, err := s.GetTouristID(ctx, touristID)
    if err != nil {
        return err
    }
    if !tourist.IsActive {
        return fmt.Errorf("Tourist ID is not active")
    }
    
    locationRecord := LocationRecord{
        TouristID: touristID,
        Latitude:  latitude,
        Longitude: longitude,
        Timestamp: time.Now(),
        Address:   address,
        RiskLevel: riskLevel,
    }
    
    locationKey := fmt.Sprintf("LOCATION_%s_%d", touristID, time.Now().Unix())
    locationJSON, err := json.Marshal(locationRecord)
    if err != nil {
        return err
    }
    
    return ctx.GetStub().PutState(locationKey, locationJSON)
}

func (s *TouristIDContract) TriggerEmergency(ctx contractapi.TransactionContextInterface,
    touristID string, alertType string, location string, description string) error {
    
    alertID := fmt.Sprintf("ALERT_%s_%d", touristID, time.Now().Unix())
    
    alert := EmergencyAlert{
        ID:          alertID,
        TouristID:   touristID,
        AlertType:   alertType,
        Location:    location,
        Timestamp:   time.Now(),
        Status:      "ACTIVE",
        Description: description,
    }
    
    alertJSON, err := json.Marshal(alert)
    if err != nil {
        return err
    }
    
    return ctx.GetStub().PutState(alertID, alertJSON)
}

func (s *TouristIDContract) UpdateSafetyScore(ctx contractapi.TransactionContextInterface,
    touristID string, newScore int) error {
    
    tourist, err := s.GetTouristID(ctx, touristID)
    if err != nil {
        return err
    }
    
    tourist.SafetyScore = newScore
    tourist.LastUpdated = time.Now()
    
    touristJSON, err := json.Marshal(tourist)
    if err != nil {
        return err
    }
    
    return ctx.GetStub().PutState(touristID, touristJSON)
}

func (s *TouristIDContract) hashData(data string) string {
    hasher := sha256.New()
    hasher.Write([]byte(data))
    return hex.EncodeToString(hasher.Sum(nil))
}

func (s *TouristIDContract) generateTouristID(aadharHash, passportHash string) string {
    combined := aadharHash + passportHash + fmt.Sprintf("%d", time.Now().Unix())
    hasher := sha256.New()
    hasher.Write([]byte(combined))
    return "TID_" + hex.EncodeToString(hasher.Sum(nil))[:16]
}

func main() {
    chaincode, err := contractapi.NewChaincode(&TouristIDContract{})
    if err != nil {
        fmt.Printf("Error creating tourist ID chaincode: %s", err.Error())
        return
    }
    
    if err := chaincode.Start(); err != nil {
        fmt.Printf("Error starting tourist ID chaincode: %s", err.Error())
    }
}
