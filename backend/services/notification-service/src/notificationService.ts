import * as admin from 'firebase-admin'
import { multilingualService } from '../../../shared/i18n-service/translationService'

interface NotificationPayload {
  token: string // FCM registration token
  title: string
  body: string
  data?: { [key: string]: string }
}

class NotificationService {
  constructor() {
    // Initialize Firebase Admin SDK if not already initialized
    if (!admin.apps.length) {
      // This assumes Firebase project credentials are set up as environment variables
      // or loaded from a service account key file.
      // For production, use `admin.credential.applicationDefault()`
      // For local development, you might need to specify a path to a service account key:
      // admin.initializeApp({
      //   credential: admin.credential.cert(require('./path/to/your/serviceAccountKey.json'))
      // });
      admin.initializeApp() // Assumes GOOGLE_APPLICATION_CREDENTIALS env var is set
    }
  }

  async sendNotification(payload: NotificationPayload): Promise<string> {
    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
        token: payload.token,
      }
      const response = await admin.messaging().send(message)
      console.log('Successfully sent message:', response)
      return response
    } catch (error: any) {
      console.error('Error sending message:', error)
      throw new Error(`Failed to send notification: ${error.message}`)
    }
  }

  async sendEmergencyNotification(token: string, touristId: string, alertType: string, language: string, data?: { [key: string]: string }): Promise<string> {
    const title = multilingualService.translate('emergency.panic_button_activated', language)
    const body = multilingualService.getEmergencyMessage(alertType, language)
    
    const payload: NotificationPayload = {
      token,
      title,
      body,
      data: { ...data, touristId, alertType, type: 'emergency' },
    }
    return this.sendNotification(payload)
  }
}

export const notificationService = new NotificationService()
