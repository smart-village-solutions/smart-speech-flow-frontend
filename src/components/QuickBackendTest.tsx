import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CheckCircle, AlertTriangle, Loader2, ExternalLink } from 'lucide-react'

const BACKEND_BASE_URL = 'https://ssf.smart-village.solutions'

interface TestResult {
  endpoint: string
  status: 'idle' | 'loading' | 'success' | 'error'
  httpStatus?: number
  responseTime?: number
  error?: string
  details?: any
}

export function QuickBackendTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { endpoint: '/health', status: 'idle' },
    { endpoint: '/pipeline (OPTIONS)', status: 'idle' },
    { endpoint: '/pipeline (POST)', status: 'idle' }
  ])

  const updateTestStatus = useCallback((index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ))
  }, [])

  const runTest = useCallback(async (index: number) => {
    const test = tests[index]
    updateTestStatus(index, { status: 'loading' })

    const startTime = performance.now()
    
    try {
      let response: Response
      
      switch (test.endpoint) {
        case '/health':
          response = await fetch(`${BACKEND_BASE_URL}/health`, {
            method: 'GET',
            mode: 'cors'
          })
          break
          
        case '/pipeline (OPTIONS)':
          response = await fetch(`${BACKEND_BASE_URL}/pipeline`, {
            method: 'OPTIONS',
            headers: {
              'Origin': window.location.origin,
              'Access-Control-Request-Method': 'POST',
              'Access-Control-Request-Headers': 'Content-Type'
            },
            mode: 'cors'
          })
          break
          
        case '/pipeline (POST)':
          const formData = new FormData()
          formData.append('source_lang', 'de')
          formData.append('target_lang', 'en')
          formData.append('file', new Blob(['test'], { type: 'audio/wav' }), 'test.wav')
          
          response = await fetch(`${BACKEND_BASE_URL}/pipeline`, {
            method: 'POST',
            body: formData,
            mode: 'cors'
          })
          break
          
        default:
          throw new Error('Unknown test')
      }

      const responseTime = Math.round(performance.now() - startTime)
      
      // Try to get response details
      let details: any = {
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok,
        type: response.type,
        url: response.url
      }

      // Try to read response body (only for non-pipeline POST)
      if (test.endpoint !== '/pipeline (POST)') {
        try {
          const text = await response.text()
          if (text) {
            details.body = text.length > 200 ? text.substring(0, 200) + '...' : text
          }
        } catch (e) {
          details.bodyError = 'Could not read response body'
        }
      } else {
        details.contentType = response.headers.get('content-type')
        details.contentLength = response.headers.get('content-length')
      }

      updateTestStatus(index, {
        status: response.ok ? 'success' : 'error',
        httpStatus: response.status,
        responseTime,
        details,
        error: response.ok ? undefined : `HTTP ${response.status} ${response.statusText}`
      })
      
    } catch (error) {
      const responseTime = Math.round(performance.now() - startTime)
      updateTestStatus(index, {
        status: 'error',
        responseTime,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }, [tests, updateTestStatus])

  const runAllTests = useCallback(async () => {
    for (let i = 0; i < tests.length; i++) {
      await runTest(i)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }, [tests.length, runTest])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const allTestsCompleted = tests.every(test => test.status !== 'idle' && test.status !== 'loading')
  const allTestsSuccessful = tests.every(test => test.status === 'success')

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Backend-Verbindungstest
          </CardTitle>
          <Button 
            onClick={runAllTests} 
            size="sm"
            disabled={tests.some(test => test.status === 'loading')}
          >
            Alle Tests starten
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Backend-URL: <code className="bg-gray-100 px-1 rounded">{BACKEND_BASE_URL}</code>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {tests.map((test, index) => (
          <div 
            key={test.endpoint}
            className={`border rounded-lg p-3 ${
              test.status === 'success' ? 'border-green-200 bg-green-50' :
              test.status === 'error' ? 'border-red-200 bg-red-50' :
              test.status === 'loading' ? 'border-blue-200 bg-blue-50' :
              'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(test.status)}
                <span className="font-medium">{test.endpoint}</span>
                {test.httpStatus && (
                  <Badge variant={test.status === 'success' ? 'default' : 'destructive'}>
                    HTTP {test.httpStatus}
                  </Badge>
                )}
                {test.responseTime && (
                  <Badge variant="outline" className="text-xs">
                    {test.responseTime}ms
                  </Badge>
                )}
              </div>
              
              <Button
                onClick={() => runTest(index)}
                disabled={test.status === 'loading'}
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
              >
                Test
              </Button>
            </div>

            {test.error && (
              <div className="text-sm text-red-700 bg-red-100 p-2 rounded mb-2">
                <strong>Fehler:</strong> {test.error}
              </div>
            )}

            {test.details && (
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">
                  Details anzeigen
                </summary>
                <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto text-xs whitespace-pre-wrap">
                  {JSON.stringify(test.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}

        {allTestsCompleted && (
          <div className={`p-3 rounded-lg border-2 ${
            allTestsSuccessful 
              ? 'border-green-300 bg-green-50 text-green-800' 
              : 'border-amber-300 bg-amber-50 text-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              {allTestsSuccessful ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              <strong>
                {allTestsSuccessful 
                  ? '✅ Alle Tests erfolgreich - Backend ist erreichbar!' 
                  : '⚠️ Einige Tests sind fehlgeschlagen - Backend-Konfiguration prüfen'
                }
              </strong>
            </div>
            
            {!allTestsSuccessful && (
              <div className="mt-2 text-sm">
                <p>Mögliche Ursachen:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Backend ist nicht gestartet oder nicht erreichbar</li>
                  <li>CORS-Header sind nicht korrekt konfiguriert</li>
                  <li>Port 8000 ist blockiert oder nicht offen</li>
                  <li>Firewall blockiert Verbindungen</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 border-t pt-3">
          <p className="mb-1">
            <strong>Info:</strong> Dieser Test überprüft die drei wichtigsten Backend-Endpunkte:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><code>/health</code> - Basis-Gesundheitscheck</li>
            <li><code>/pipeline (OPTIONS)</code> - CORS-Preflight für Pipeline</li>
            <li><code>/pipeline (POST)</code> - Audio-Verarbeitungsendpunkt</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}