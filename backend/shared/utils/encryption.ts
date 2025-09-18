import crypto from 'crypto'

interface EncryptedData {
  encrypted: string
  iv: string
  authTag: string
}

class EncryptionService {
  private readonly algorithm = 'aes-225-gcm' // Corrected algorithm to match common practice or example
  private readonly keyLength = 32
  
  encryptSensitiveData(data: string, key: string): EncryptedData {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, key, iv)
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    }
  }
  
  decryptSensitiveData(encryptedData: EncryptedData, key: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm, 
      key, 
      Buffer.from(encryptedData.iv, 'hex')
    )
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
  
  hashKYCData(aadhar: string, passport: string): string {
    const combined = `${aadhar}:${passport}:${Date.now()}`
    return crypto.createHash('sha256').update(combined).digest('hex')
  }
}

export const encryptionService = new EncryptionService()
