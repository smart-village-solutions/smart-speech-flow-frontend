"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { LanguageSelector } from "./components/LanguageSelector"
import { MicrophoneButton } from "./components/MicrophoneButton"
import { AudioVisualizer } from "./components/AudioVisualizer"
import { ConversationView } from "./components/ConversationView"
import { StatusIndicator, Status } from "./components/StatusIndicator"
import { MicrophonePermission } from "./components/MicrophonePermission"
import { DebugConsole } from "./components/DebugConsole"
import { QuickBackendTest } from "./components/QuickBackendTest"
import { motion } from "motion/react"
import { getTranslation, type SupportedLanguage } from "./components/translations"
import { useAudioRecording } from "./components/useAudioRecording"
import { ApiService } from "./components/api-service"

interface Message {
  id: string
  original: string
  translated: string
  timestamp: Date
  audioUrl?: string
}

export default function App() {
  const [sourceLanguage, setSourceLanguage] = useState("de")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [status, setStatus] = useState<Status>("connected")
  const [messages, setMessages] = useState<Message[]>([])
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null)
  const [isCheckingBackend, setIsCheckingBackend] = useState(false)

  // UI-Sprache basiert auf der Eingabesprache
  const uiLanguage = sourceLanguage as SupportedLanguage
  const t = getTranslation(uiLanguage)

  const checkBackendHealth = useCallback(async () => {
    setIsCheckingBackend(true)
    
    try {
      // Setze Status zurück für manuelle Wiederholung
      ApiService.resetBackendStatus()
      
      // Teste Konnektivität
      const connectivity = await ApiService.testConnectivity()
      
      setBackendHealthy(connectivity.success)
      if (!connectivity.success) {
        setStatus("error")
      } else {
        setStatus("connected")
      }
    } catch (error) {
      console.error('Backend health check failed:', error)
      setBackendHealthy(false)
      setStatus("error")
    } finally {
      setIsCheckingBackend(false)
    }
  }, [])

  // Einmaliger Backend-Check beim Start (kein periodischer Check)
  useEffect(() => {
    checkBackendHealth()
  }, [checkBackendHealth])

  // Audio recording hook
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    error: recordingError,
    clearError,
    progress: recordingProgress,
    timeRemaining,
    permissionStatus,
    requestPermission
  } = useAudioRecording({
    maxDuration: 30000, // 30 seconds
    onMaxDurationReached: () => {
      // Automatically stop when max duration is reached
      setStatus("translating")
      stopRecording()
    }
  })

  const handleRequestPermission = useCallback(async (): Promise<boolean> => {
    setIsRequestingPermission(true)
    try {
      const granted = await requestPermission()
      return granted
    } finally {
      setIsRequestingPermission(false)
    }
  }, [requestPermission])

  const handleStopRecording = useCallback(() => {
    setStatus("translating")
    stopRecording()
  }, [stopRecording])

  const handleStartRecording = useCallback(async () => {
    try {
      setStatus("recording")
      await startRecording()
    } catch (error) {
      console.error('Failed to start recording:', error)
      setStatus("connected")
    }
  }, [startRecording])

  // Process audio when recording stops and audioBlob is available
  useEffect(() => {
    if (audioBlob && !isRecording) {
      processAudioWithBackend(audioBlob)
    }
  }, [audioBlob, isRecording])

  const processAudioWithBackend = async (audioBlob: Blob) => {
    try {
      setStatus("translating")

      // Prüfe Backend-Verfügbarkeit
      if (backendHealthy === false) {
        // Fallback auf Mock-Daten, wenn Backend nicht verfügbar
        console.log('Backend not available, using mock data...')
        await processAudioWithMockData()
        return
      }

      console.log('Processing audio with backend...')
      const result = await ApiService.processAudio(audioBlob, sourceLanguage, targetLanguage)

      console.log('🔍 Backend result:', {
        success: result.success,
        hasAudioUrl: !!result.audioUrl,
        hasOriginalText: !!result.originalText,
        hasTranslatedText: !!result.translatedText,
        error: result.error
      })

      if (result.success && result.audioUrl) {
        const newMessage: Message = {
          id: Date.now().toString(),
          original: result.originalText || t.audioProcessed,
          translated: result.translatedText || t.translationReceived,
          timestamp: new Date(),
          audioUrl: result.audioUrl
        }

        console.log('✅ Adding new message:', {
          id: newMessage.id,
          original: newMessage.original,
          translated: newMessage.translated,
          hasAudio: !!newMessage.audioUrl
        })

        setMessages(prev => [...prev, newMessage])
        setStatus("connected")

        // Automatische Wiedergabe der übersetzten Sprache
        if (result.audioUrl) {
          try {
            const audio = new Audio(result.audioUrl)
            audio.play().catch(err => {
              console.warn('Auto-play failed:', err)
              // Auto-play ist blockiert, aber das ist ok - Benutzer kann manuell abspielen
            })
          } catch (err) {
            console.warn('Audio playback error:', err)
          }
        }
      } else {
        // Backend-Fehler - Fallback auf Mock-Daten
        console.error('❌ Backend processing failed:', result.error)
        setBackendHealthy(false)
        await processAudioWithMockData()
      }
    } catch (error) {
      console.error('Audio processing error:', error)
      
      // Bei Netzwerkfehlern Backend als nicht verfügbar markieren und Mock-Daten verwenden
      setBackendHealthy(false)
      await processAudioWithMockData()
    }
  }

  const processAudioWithMockData = async () => {
    // Simuliere realistische Verarbeitungszeit
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Erweiterte Mock-Daten mit verschiedenen Sätzen
    const mockPhrases = {
      de: [
        { original: "Hallo, wie geht es dir heute?", translated: "Hello, how are you doing today?" },
        { original: "Können Sie mir bitte helfen?", translated: "Can you please help me?" },
        { original: "Wo ist der nächste Bahnhof?", translated: "Where is the nearest train station?" },
        { original: "Ich hätte gerne einen Kaffee.", translated: "I would like a coffee, please." },
        { original: "Wie viel kostet das?", translated: "How much does this cost?" }
      ],
      en: [
        { original: "Hello, how are you doing today?", translated: "Hallo, wie geht es dir heute?" },
        { original: "Can you help me, please?", translated: "Können Sie mir bitte helfen?" },
        { original: "Where is the bathroom?", translated: "Wo ist die Toilette?" },
        { original: "Thank you very much!", translated: "Vielen Dank!" },
        { original: "What time is it?", translated: "Wie spät ist es?" }
      ],
      ar: [
        { original: "أهلاً، كيف حالك اليوم؟", translated: "Hello, how are you today?" },
        { original: "هل يمكنك مساعدتي؟", translated: "Can you help me?" },
        { original: "أين المطعم؟", translated: "Where is the restaurant?" }
      ],
      tr: [
        { original: "Merhaba, bugün nasılsın?", translated: "Hello, how are you today?" },
        { original: "Yardım edebilir misiniz?", translated: "Can you help me?" },
        { original: "Teşekkür ederim.", translated: "Thank you." }
      ],
      am: [
        { original: "ሰላም፣ ዛሬ እንዴት ነዎት?", translated: "Hello, how are you today?" },
        { original: "እባክዎ ይረዱኝ?", translated: "Please help me?" },
        { original: "አመሰግናለሁ", translated: "Thank you" }
      ],
      fa: [
        { original: "سلام، امروز چطورید؟", translated: "Hello, how are you today?" },
        { original: "لطفاً کمکم کنید", translated: "Please help me" },
        { original: "متشکرم", translated: "Thank you" }
      ],
      ru: [
        { original: "Привет, как дела сегодня?", translated: "Hello, how are you today?" },
        { original: "Помогите мне, пожалуйста", translated: "Help me, please" },
        { original: "Спасибо большое", translated: "Thank you very much" }
      ],
      uk: [
        { original: "Привіт, як справи сьогодні?", translated: "Hello, how are you today?" },
        { original: "Допоможіть мені, будь ласка", translated: "Help me, please" },
        { original: "Дуже дякую", translated: "Thank you very much" }
      ]
    }
    
    // Wähle zufälligen Satz aus der entsprechenden Sprache
    const phrases = mockPhrases[sourceLanguage as keyof typeof mockPhrases] || mockPhrases.de
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)]
    
    const newMessage: Message = {
      id: Date.now().toString(),
      original: `🎤 ${selectedPhrase.original}`,
      translated: `🤖 ${selectedPhrase.translated} (Demo)`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setStatus("connected")
  }

  // Show recording error if any
  useEffect(() => {
    if (recordingError) {
      console.error('Recording error:', recordingError)
      setStatus("connected")
    }
  }, [recordingError])

  const handleSwapLanguages = useCallback(() => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
  }, [sourceLanguage, targetLanguage])

  // Get error message based on error type
  const getErrorMessage = useCallback((error: string) => {
    switch (error) {
      case 'PERMISSION_DENIED':
        return t.microphonePermissionError
      case 'NO_MICROPHONE':
        return t.noMicrophoneError
      case 'MICROPHONE_BUSY':
        return t.microphoneBusyError
      case 'MICROPHONE_CONSTRAINED':
        return t.microphoneConstrainedError
      case 'RECORDER_NOT_SUPPORTED':
        return t.recorderNotSupportedError
      case 'RECORDING_ERROR':
        return t.recordingError
      case 'UNKNOWN_ERROR':
        return t.unknownError
      default:
        return t.recordingError
    }
  }, [t])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-gray-100"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {t.voiceTranslator}
              </h1>
              {backendHealthy === false && (
                <div className="mt-3 space-y-4">
                  <QuickBackendTest />
                  <DebugConsole onBackendStatusChange={setBackendHealthy} />
                </div>
              )}
            </div>
            <StatusIndicator status={status} language={uiLanguage} />
          </div>
          
          <LanguageSelector
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onSourceLanguageChange={setSourceLanguage}
            onTargetLanguageChange={setTargetLanguage}
            onSwapLanguages={handleSwapLanguages}
            uiLanguage={uiLanguage}
          />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Conversation Area */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <ConversationView 
            messages={messages} 
            className="h-full min-h-[400px]"
            language={uiLanguage}
          />
        </div>

        {/* Voice Input Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 border-t border-gray-100 bg-white/50 backdrop-blur-sm"
        >
          <div className="max-w-md mx-auto space-y-6">
            {/* Audio Visualizer */}
            <div className="flex justify-center">
              <AudioVisualizer 
                isRecording={isRecording}
                className="transition-all duration-300"
              />
            </div>

            {/* Microphone Button */}
            <div className="flex justify-center">
              {(permissionStatus === 'denied' || recordingError === 'PERMISSION_DENIED') && !isRecording ? (
                <MicrophonePermission 
                  onRequestPermission={handleRequestPermission}
                  language={uiLanguage}
                  isLoading={isRequestingPermission}
                />
              ) : (
                <MicrophoneButton
                  isRecording={isRecording}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  disabled={status === "translating"}
                  recordingProgress={recordingProgress}
                />
              )}
            </div>

            {/* Instructions */}
            {permissionStatus !== 'denied' && recordingError !== 'PERMISSION_DENIED' && (
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  {isRecording 
                    ? t.speakNow 
                    : t.pressAndSpeak
                  }
                </p>
                
                {/* Demo-Modus Hinweis */}
                {backendHealthy === false && !isRecording && (
                  <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    📺 Demo-Modus: Spracheingaben werden simuliert
                  </p>
                )}
              
              {/* Verbleibende Zeit während Aufnahme */}
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm space-y-1"
                >
                  <p className="text-gray-500">
                    {t.timeRemaining} {timeRemaining}s
                  </p>
                  <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    <motion.div
                      className="h-full rounded-full transition-colors duration-200"
                      style={{
                        backgroundColor: recordingProgress < 0.5 
                          ? `hsl(120, 100%, 50%)` // Grün (0-15s)
                          : recordingProgress < 0.833 
                          ? `hsl(60, 100%, 50%)` // Gelb (15-25s)
                          : `hsl(0, 100%, 50%)`, // Rot (25-30s)
                        width: `${recordingProgress * 100}%`
                      }}
                      animate={{ width: `${recordingProgress * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </motion.div>
              )}

              {status === "translating" && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-blue-600 text-sm"
                >
                  {t.translatingMessage}
                </motion.p>
              )}

                {recordingError && recordingError !== 'PERMISSION_DENIED' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-2"
                  >
                    <p className="text-red-600 text-sm max-w-xs mx-auto">
                      {getErrorMessage(recordingError)}
                    </p>
                    <button
                      onClick={() => {
                        // Clear error and reset status
                        clearError()
                        setStatus("connected")
                      }}
                      className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                    >
                      {t.retryRecording}
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  )
}