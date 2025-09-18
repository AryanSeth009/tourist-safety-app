class MultilingualService {
  private translations: Map<string, Map<string, string>> = new Map()
  
  constructor() {
    this.loadTranslations()
  }
  
  private loadTranslations() {
    // Load translations for supported languages
    const languages = [
      'en', 'hi', 'bn', 'te', 'ta', 'ml', 'kn', 'gu', 'mr', 'pa', 'as', 'or'
    ]
    
    languages.forEach(lang => {
      try {
        const translations = require(`./translations/${lang}.json`)
        this.translations.set(lang, new Map(Object.entries(translations)))
      } catch (error) {
        console.error(`Failed to load translation for ${lang}:`, error)
      }
    })
  }
  
  translate(key: string, language: string, params?: Record<string, string>): string {
    const langTranslations = this.translations.get(language) || this.translations.get('en')
    let translation = langTranslations?.get(key) || key
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value)
      })
    }
    
    return translation
  }
  
  // Emergency message translations
  getEmergencyMessage(type: string, language: string): string {
    const messages: { [key: string]: string } = {
      panic_button: 'emergency.panic_button_activated',
      geofence_violation: 'emergency.geofence_violation',
      prolonged_inactivity: 'emergency.prolonged_inactivity',
      route_deviation: 'emergency.route_deviation'
    }
    
    return this.translate(messages[type] || messages.panic_button, language)
  }
}

export const multilingualService = new MultilingualService()
