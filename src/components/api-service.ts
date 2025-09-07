// API Service für die Backend-Kommunikation
const API_BASE_URL = 'https://ssf.smart-village.solutions'

// Timeout für API-Requests (5 Sekunden)
const REQUEST_TIMEOUT = 20000 // Timeout für API-Requests (20 Sekunden)

// Debug-Logging aktivieren
const DEBUG_ENABLED = true

// Logger-Hilfsfunktion
function debugLog(category: string, message: string, data?: any) {
  if (!DEBUG_ENABLED) return

  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [API-${category}]`

  if (data !== undefined) {
    console.log(`${prefix} ${message}`, data)
  } else {
    console.log(`${prefix} ${message}`)
  }
}

// Helper-Funktion für fetch mit erweiterten Debugging-Funktionen
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const requestId = Math.random().toString(36).substring(7)
  const startTime = performance.now()

  debugLog('REQUEST', `[${requestId}] Starting request`, {
    url,
    method: options.method || 'GET',
    headers: options.headers,
    bodyType: options.body?.constructor?.name || 'none'
  })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    debugLog('TIMEOUT', `[${requestId}] Request timed out after ${REQUEST_TIMEOUT}ms`)
    controller.abort()
  }, REQUEST_TIMEOUT)

  try {
    const requestOptions = {
      ...options,
      signal: controller.signal,
      mode: 'cors' as RequestMode, // Explizit CORS-Modus setzen
      headers: {
        ...options.headers,
        'Accept': 'application/json, audio/wav, audio/*, */*',
      }
    }

    const response = await fetch(url, requestOptions)
    clearTimeout(timeoutId)

    const responseTime = Math.round(performance.now() - startTime)

    debugLog('RESPONSE', `[${requestId}] Response received (${responseTime}ms)`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok,
      type: response.type,
      url: response.url
    })

    return response
  } catch (error) {
    clearTimeout(timeoutId)
    const responseTime = Math.round(performance.now() - startTime)

    debugLog('ERROR', `[${requestId}] Request failed (${responseTime}ms)`, {
      error: error instanceof Error ? error.message : String(error),
      errorType: error?.constructor?.name,
      errorStack: error instanceof Error ? error.stack : undefined
    })

    throw error
  }
}

export interface TranslationResponse {
  success: boolean
  originalText?: string
  translatedText?: string
  audioUrl?: string
  error?: string
}

export interface BackendResponse {
  success: boolean
  originalText?: string
  translatedText?: string
  audioBase64?: string
  error?: string
}

export interface LanguageMapping {
  [key: string]: string
}

// Sprach-Mapping für Backend-Kompatibilität
const LANGUAGE_MAPPING: LanguageMapping = {
  'de': 'de', // Deutsch
  'en': 'en', // Englisch
  'ar': 'ar', // Arabisch
  'tr': 'tr', // Türkisch
  'am': 'am', // Amharisch
  'fa': 'fa', // Persisch
  'ru': 'ru', // Russisch
  'uk': 'uk'  // Ukrainisch
}

export class ApiService {
  // Cache für Backend-Status um wiederholte Anfragen zu vermeiden
  private static backendStatus: {
    checked: boolean;
    healthy: boolean;
    lastChecked: number
  } = {
    checked: false,
    healthy: false,
    lastChecked: 0
  }

  /**
   * Erweiterte Backend-Konnektivitätstests
   */
  static async testConnectivity(): Promise<{
    success: boolean;
    method?: string;
    error?: string;
    details?: any
  }> {
    // Verwende Cache wenn kürzlich getestet (innerhalb der letzten 5 Minuten)
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    if (this.backendStatus.checked && (now - this.backendStatus.lastChecked < fiveMinutes)) {
      return {
        success: this.backendStatus.healthy,
        method: this.backendStatus.healthy ? `${API_BASE_URL}/health` : undefined,
        error: this.backendStatus.healthy ? undefined : 'Backend bereits als nicht erreichbar markiert'
      }
    }

    console.log('🔍 Starting comprehensive backend connectivity test...')

    // Mehrere Test-Strategien probieren
    const testStrategies = [
      { name: 'Health Check', url: `${API_BASE_URL}/health`, method: 'GET' },
      { name: 'Root Path', url: API_BASE_URL, method: 'GET' },
      { name: 'Pipeline OPTIONS', url: `${API_BASE_URL}/pipeline`, method: 'OPTIONS' }
    ]

    const testResults: any[] = []
    let successfulTest: any = null

    for (const strategy of testStrategies) {
      try {
        console.log(`🧪 Testing: ${strategy.name} (${strategy.method} ${strategy.url})`)

        const startTime = performance.now()
        const response = await fetchWithTimeout(strategy.url, {
          method: strategy.method,
          headers: strategy.method === 'OPTIONS' ? {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
          } : {}
        })
        const endTime = performance.now()

        const testResult = {
          strategy: strategy.name,
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          responseTime: Math.round(endTime - startTime),
          headers: Object.fromEntries(response.headers.entries()),
          corsHeaders: {
            allowOrigin: response.headers.get('Access-Control-Allow-Origin'),
            allowMethods: response.headers.get('Access-Control-Allow-Methods'),
            allowHeaders: response.headers.get('Access-Control-Allow-Headers')
          }
        }

        testResults.push(testResult)

        if (response.ok && !successfulTest) {
          successfulTest = testResult
          console.log(`✅ ${strategy.name} successful:`, testResult)
        } else {
          console.log(`⚠️ ${strategy.name} failed:`, testResult)
        }

      } catch (error) {
        const testResult = {
          strategy: strategy.name,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          errorType: error instanceof DOMException ? error.name : error?.constructor?.name || 'Unknown'
        }

        testResults.push(testResult)
        console.log(`❌ ${strategy.name} error:`, testResult)
      }
    }

    const now2 = Date.now()

    if (successfulTest) {
      console.log('✅ Backend connectivity established!')
      this.backendStatus = { checked: true, healthy: true, lastChecked: now2 }
      return {
        success: true,
        method: successfulTest.strategy,
        details: { testResults, successful: successfulTest }
      }
    } else {
      console.log('❌ All connectivity tests failed!')
      this.backendStatus = { checked: true, healthy: false, lastChecked: now2 }

      // Analysiere Fehlertypen für bessere Fehlermeldung
      const errorTypes = testResults.map(r => r.errorType || 'HTTP_ERROR').filter(Boolean)
      const uniqueErrors = [...new Set(errorTypes)]

      let errorMessage = 'Backend nicht erreichbar'
      if (uniqueErrors.includes('AbortError')) {
        errorMessage = 'Timeout - Server antwortet nicht innerhalb von 5 Sekunden'
      } else if (uniqueErrors.includes('TypeError') || errorTypes.some(e => e.includes('Failed to fetch'))) {
        errorMessage = 'CORS-Blockierung oder Netzwerkfehler'
      } else if (testResults.some(r => r.status >= 500)) {
        errorMessage = 'Server-Fehler (HTTP 5xx)'
      } else if (testResults.some(r => r.status === 404)) {
        errorMessage = 'Endpunkt nicht gefunden (HTTP 404)'
      }

      return {
        success: false,
        error: errorMessage,
        details: { testResults, errorAnalysis: uniqueErrors }
      }
    }
  }

  /**
   * Erweiterte Audio-Verarbeitung mit detailliertem Debugging
   */
  static async processAudio(
    audioBlob: Blob,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationResponse> {
    const startTime = performance.now()

    try {
      // Audio-Blob validieren
      if (!audioBlob || audioBlob.size === 0) {
        return {
          success: false,
          error: 'Kein gültiges Audio empfangen (leere Datei)'
        }
      }

      console.log(`📤 Audio Upload Details:`, {
        size: `${(audioBlob.size / 1024).toFixed(2)} KB`,
        type: audioBlob.type,
        sourceLanguage,
        targetLanguage
      })

      // FormData für den Upload vorbereiten
      const formData = new FormData()

      // Audio-Datei hinzufügen mit korrektem MIME-Type
      formData.append('file', audioBlob, 'recording.wav')

      // Sprachen mit Backend-Mapping hinzufügen
      const mappedSourceLang = LANGUAGE_MAPPING[sourceLanguage] || sourceLanguage
      const mappedTargetLang = LANGUAGE_MAPPING[targetLanguage] || targetLanguage

      formData.append('source_lang', mappedSourceLang)
      formData.append('target_lang', mappedTargetLang)

      console.log(`🚀 Sending to pipeline: ${mappedSourceLang} → ${mappedTargetLang}`)

      // Request-Details für Debugging
      const requestDetails = {
        url: `${API_BASE_URL}/pipeline`,
        method: 'POST',
        formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
          key,
          value: value instanceof File ? `File(${value.size}B, ${value.type})` : value
        }))
      }
      console.log('🔍 Request Details:', requestDetails)

      // API-Aufruf an Pipeline-Endpunkt
      const response = await fetchWithTimeout(`${API_BASE_URL}/pipeline`, {
        method: 'POST',
        body: formData,
        // Keine Content-Type Header setzen - Browser macht das automatisch für FormData
      })

      const responseTime = Math.round(performance.now() - startTime)

      // Response-Details für Debugging
      const responseDetails = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responseTime: `${responseTime}ms`,
        ok: response.ok
      }
      console.log('📥 Response Details:', responseDetails)

      if (!response.ok) {
        // Detaillierte Fehleranalyse
        let errorDetails = `HTTP ${response.status} - ${response.statusText}`

        try {
          const errorBody = await response.text()
          console.log('❌ Error Response Body:', errorBody)
          errorDetails += errorBody ? ` - ${errorBody}` : ''
        } catch (e) {
          console.log('⚠️ Could not read error response body')
        }

        return {
          success: false,
          error: `Server-Fehler: ${errorDetails}`
        }
      }

      // Content-Type Analyse
      const contentType = response.headers.get('content-type')
      console.log('🎧 Response Content-Type:', contentType)

      if (contentType && contentType.includes('audio')) {
        // Response ist eine Audio-Datei
        console.log('✅ Received audio response, converting to blob...')

        const audioBuffer = await response.arrayBuffer()
        const responseAudioBlob = new Blob([audioBuffer], { type: contentType })
        const audioUrl = URL.createObjectURL(responseAudioBlob)

        console.log(`🎵 Audio created:`, {
          size: `${(responseAudioBlob.size / 1024).toFixed(2)} KB`,
          type: responseAudioBlob.type,
          url: audioUrl.substring(0, 50) + '...'
        })

        return {
          success: true,
          audioUrl,
          originalText: `Audio verarbeitet (${mappedSourceLang})`,
          translatedText: `Übersetzung empfangen (${mappedTargetLang})`
        }

      } else if (contentType && contentType.includes('json')) {
        // JSON-Response mit möglicherweise strukturierten Daten
        try {
          const jsonData = await response.json()
          console.log('📋 JSON Response:', jsonData)

          // Prüfe auf Backend-Erfolg
          if (jsonData.success === false) {
            return {
              success: false,
              error: `Backend-Fehler: ${jsonData.error || 'Unbekannter Fehler'}`
            }
          }

          // Prüfe auf das neue Backend-Format mit audioBase64
          if (jsonData.success === true && jsonData.audioBase64) {
            console.log('🔄 Processing Base64 audio data...', {
              hasOriginalText: !!jsonData.originalText,
              hasTranslatedText: !!jsonData.translatedText,
              base64Length: jsonData.audioBase64.length,
              base64Preview: jsonData.audioBase64.substring(0, 50) + '...'
            })

            try {
              // Konvertiere Base64 zu Audio-Blob
              const audioData = atob(jsonData.audioBase64)
              const audioArray = new Uint8Array(audioData.length)
              for (let i = 0; i < audioData.length; i++) {
                audioArray[i] = audioData.charCodeAt(i)
              }

              const audioBlob = new Blob([audioArray], { type: 'audio/wav' })
              const audioUrl = URL.createObjectURL(audioBlob)

              console.log(`🎵 Audio from Base64 created successfully:`, {
                originalSize: `${jsonData.audioBase64.length} chars`,
                blobSize: `${(audioBlob.size / 1024).toFixed(2)} KB`,
                type: audioBlob.type,
                url: audioUrl.substring(0, 50) + '...',
                originalText: jsonData.originalText,
                translatedText: jsonData.translatedText
              })

              return {
                success: true,
                audioUrl,
                originalText: jsonData.originalText || 'Audio verarbeitet',
                translatedText: jsonData.translatedText || 'Übersetzung empfangen'
              }
            } catch (base64Error) {
              console.error('❌ Base64 Audio Conversion Error:', base64Error)
              return {
                success: false,
                error: 'Fehler beim Konvertieren der Audio-Daten'
              }
            }
          }

          // Legacy-Support für alte Formate
          if (jsonData.audioUrl || jsonData.audio_url) {
            return {
              success: true,
              audioUrl: jsonData.audioUrl || jsonData.audio_url,
              originalText: jsonData.originalText || jsonData.original_text || 'Audio verarbeitet',
              translatedText: jsonData.translatedText || jsonData.translated_text || 'Übersetzung empfangen'
            }
          } else if (jsonData.error) {
            return {
              success: false,
              error: `Backend-Fehler: ${jsonData.error}`
            }
          } else {
            return {
              success: false,
              error: 'Unvollständige JSON-Response (weder audioBase64 noch audioUrl gefunden)'
            }
          }
        } catch (e) {
          console.error('❌ JSON Parsing Error:', e)
          return {
            success: false,
            error: 'Fehlerhafte JSON-Response vom Server'
          }
        }

      } else {
        // Unbekannter Response-Type - trotzdem versuchen zu lesen
        const responseText = await response.text()
        console.error('❓ Unexpected response format:', {
          contentType,
          bodyPreview: responseText.substring(0, 200),
          bodyLength: responseText.length
        })

        return {
          success: false,
          error: `Unerwartetes Antwortformat: ${contentType || 'unknown'}`
        }
      }

    } catch (error) {
      const responseTime = Math.round(performance.now() - startTime)
      console.error('💥 API Error Details:', {
        error,
        errorType: error?.constructor?.name,
        errorMessage: error instanceof Error ? error.message : String(error),
        responseTime: `${responseTime}ms`,
        audioSize: audioBlob?.size,
        languages: { sourceLanguage, targetLanguage }
      })

      let errorMessage = 'Verbindungsfehler zum Server'

      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = `Anfrage-Timeout: Server antwortet nicht innerhalb von ${REQUEST_TIMEOUT/1000} Sekunden`
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'CORS-Fehler: Server erlaubt keine Cross-Origin-Anfragen oder ist nicht erreichbar'
      } else if (error instanceof TypeError && error.message.includes('NetworkError')) {
        errorMessage = 'Netzwerkfehler: Server ist nicht erreichbar'
      } else if (error instanceof TypeError && error.message.includes('Load failed')) {
        errorMessage = 'Netzwerk-Load-Fehler: Verbindung zum Server fehlgeschlagen'
      } else if (error instanceof Error) {
        errorMessage = `API-Fehler: ${error.message}`
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Health-Check für Backend-Verfügbarkeit (verwendet Cache)
   */
  static async checkHealth(): Promise<boolean> {
    const result = await this.testConnectivity()
    return result.success
  }

  /**
   * Setzt den Backend-Status zurück (für manuelle Wiederholung)
   */
  static resetBackendStatus(): void {
    this.backendStatus = { checked: false, healthy: false, lastChecked: 0 }
  }

  /**
   * Verfügbare Sprachen vom Backend abrufen
   */
  static async getAvailableLanguages(): Promise<string[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/languages`)

      if (response.ok) {
        const languages = await response.json()
        return languages
      } else {
        // Fallback auf unterstützte Sprachen
        return Object.keys(LANGUAGE_MAPPING)
      }
    } catch (error) {
      console.error('Failed to fetch languages:', error)
      // Fallback auf unterstützte Sprachen
      return Object.keys(LANGUAGE_MAPPING)
    }
  }
}