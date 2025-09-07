import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ApiService } from './api-service'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ChevronDown, ChevronUp, Play, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

interface DebugConsoleProps {
  onBackendStatusChange?: (healthy: boolean) => void
}

export function DebugConsole({ onBackendStatusChange }: DebugConsoleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const runConnectivityTest = useCallback(async () => {
    setIsLoading(true)
    try {
      // Reset backend status for fresh test
      ApiService.resetBackendStatus()
      
      const result = await ApiService.testConnectivity()
      setTestResults(result)
      setLastCheck(new Date())
      
      if (onBackendStatusChange) {
        onBackendStatusChange(result.success)
      }
    } catch (error) {
      console.error('Debug connectivity test failed:', error)
      setTestResults({
        success: false,
        error: 'Test-Fehler: ' + (error instanceof Error ? error.message : String(error))
      })
    } finally {
      setIsLoading(false)
    }
  }, [onBackendStatusChange])

  const runAudioTest = useCallback(async () => {
    setIsLoading(true)
    try {
      // Create a dummy audio blob for testing
      const dummyAudio = new Blob(['dummy audio data'], { type: 'audio/wav' })
      
      const result = await ApiService.processAudio(dummyAudio, 'de', 'en')
      
      setTestResults(prev => ({
        ...prev,
        audioTest: result,
        audioTestTimestamp: new Date()
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        audioTest: {
          success: false,
          error: 'Audio-Test-Fehler: ' + (error instanceof Error ? error.message : String(error))
        },
        audioTestTimestamp: new Date()
      }))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const copyToClipboard = useCallback((data: any) => {
    const text = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(text).then(() => {
      console.log('Debug data copied to clipboard')
    })
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto border-amber-200 bg-amber-50/50">
      <CardHeader 
        className="cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <CardTitle className="text-lg text-amber-800">
              Backend Debug-Konsole
            </CardTitle>
            {testResults && (
              <Badge variant={testResults.success ? "default" : "destructive"}>
                {testResults.success ? 'Verbunden' : 'Fehler'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {lastCheck && (
              <span className="text-xs text-amber-700">
                Letzter Test: {lastCheck.toLocaleTimeString()}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-amber-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-600" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4">
              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={runConnectivityTest}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Wifi className="w-4 h-4 mr-2" />
                  )}
                  Verbindung testen
                </Button>
                
                <Button
                  onClick={runAudioTest}
                  disabled={isLoading || !testResults?.success}
                  size="sm"
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Audio-Pipeline testen
                </Button>

                {testResults && (
                  <Button
                    onClick={() => copyToClipboard(testResults)}
                    size="sm"
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    📋 Ergebnisse kopieren
                  </Button>
                )}
              </div>

              <Separator className="bg-amber-200" />

              {/* Test Results */}
              {testResults && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {testResults.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-600" />
                    )}
                    <h4 className="font-medium text-amber-800">
                      Verbindungstest-Ergebnisse
                    </h4>
                  </div>

                  {testResults.success ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 font-medium">✅ Backend erreichbar</p>
                      <p className="text-sm text-green-700 mt-1">
                        Erfolgreiche Verbindung via: {testResults.method}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 font-medium">❌ Verbindung fehlgeschlagen</p>
                      <p className="text-sm text-red-700 mt-1">
                        {testResults.error}
                      </p>
                    </div>
                  )}

                  {/* Detailed Test Results */}
                  {testResults.details?.testResults && (
                    <details className="bg-white border border-amber-200 rounded-lg p-3">
                      <summary className="cursor-pointer font-medium text-amber-800 hover:text-amber-900">
                        🔍 Detaillierte Test-Ergebnisse ({testResults.details.testResults.length} Tests)
                      </summary>
                      <div className="mt-3 space-y-2">
                        {testResults.details.testResults.map((test: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded p-2 text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={test.success ? "default" : "secondary"}>
                                {test.strategy}
                              </Badge>
                              {test.success ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-red-600">✗</span>
                              )}
                              {test.status && (
                                <span className="text-gray-600">HTTP {test.status}</span>
                              )}
                              {test.responseTime && (
                                <span className="text-blue-600">{test.responseTime}ms</span>
                              )}
                            </div>
                            
                            {test.corsHeaders && (
                              <div className="text-xs text-gray-600 space-y-1">
                                {test.corsHeaders.allowOrigin && (
                                  <div>Origin: {test.corsHeaders.allowOrigin}</div>
                                )}
                                {test.corsHeaders.allowMethods && (
                                  <div>Methods: {test.corsHeaders.allowMethods}</div>
                                )}
                              </div>
                            )}
                            
                            {test.error && (
                              <div className="text-xs text-red-600 mt-1">
                                Error: {test.error}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {/* Audio Test Results */}
                  {testResults.audioTest && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-amber-800">🎧 Audio-Pipeline Test</h4>
                      {testResults.audioTest.success ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-800">✅ Audio-Verarbeitung funktioniert</p>
                          {testResults.audioTest.audioUrl && (
                            <p className="text-sm text-green-700 mt-1">
                              Audio-URL generiert: {testResults.audioTest.audioUrl.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-800">❌ Audio-Verarbeitung fehlgeschlagen</p>
                          <p className="text-sm text-red-700 mt-1">
                            {testResults.audioTest.error}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Manual Tests */}
              <details className="bg-white border border-amber-200 rounded-lg p-3">
                <summary className="cursor-pointer font-medium text-amber-800 hover:text-amber-900">
                  🧪 Manuelle Test-Befehle
                </summary>
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">Browser-Console Test:</p>
                    <code className="block bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      {`fetch('https://ssf.smart-village.solutions/health').then(r => console.log('Status:', r.status, 'Headers:', [...r.headers.entries()]))`}
                    </code>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">CURL Command:</p>
                    <code className="block bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      curl -v https://ssf.smart-village.solutions/health
                    </code>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">CORS Preflight Test:</p>
                    <code className="block bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      {`curl -X OPTIONS https://ssf.smart-village.solutions/pipeline -H "Origin: ${window.location.origin}" -v`}
                    </code>
                  </div>
                </div>
              </details>

              {/* Network Information */}
              <div className="text-xs text-amber-700 space-y-1">
                <div>Backend-URL: https://ssf.smart-village.solutions</div>
                <div>Frontend-Origin: {window.location.origin}</div>
                <div>User-Agent: {navigator.userAgent.substring(0, 100)}...</div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}