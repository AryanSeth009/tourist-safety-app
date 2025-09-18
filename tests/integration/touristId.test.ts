import request from 'supertest'
import { app } from '../../backend/api-gateway/src/app'

describe('Tourist ID Integration Tests', () => {
  test('Should create tourist ID and store on blockchain', async () => {
    const kycData = {
      aadhar: '1234-5678-9012',
      passport: 'A12345678',
      name: 'Test Tourist',
      phone: '+91-9876543210',
      email: 'test@tourist.com'
    }
    
    const response = await request(app)
      .post('/api/tourist/create-id')
      .send({
        kycData,
        itinerary: ['Delhi', 'Guwahati', 'Shillong'],
        emergencyContacts: ['\'91-9876543210']
      })
      .expect(201) // Expecting 201 Created
    
    expect(response.body).toHaveProperty('touristId')
    expect(response.body.touristId).toMatch(/^TID_[a-f0-9]{16}$/)
  })
  
  test('Should handle emergency panic button', async () => {
    const response = await request(app)
      .post('/api/emergency/panic')
      .set('Authorization', 'Bearer valid-tourist-token') // Placeholder for a valid token
      .send({
        location: {
          latitude: 26.1445,
          longitude: 91.7362
        }
      })
      .expect(200) // Expecting 200 OK
    
    expect(response.body.status).toBe('EMERGENCY_RECORDED')
    expect(response.body).toHaveProperty('efirNumber')
  })
})
