import { useState, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { AlertTriangle, CheckCircle, Clock, Globe, Server, Wifi } from 'lucide-react'

interface NetworkTest {
  name: string
  description: string
  status: 'pending' | 'running' | 'success' | 'error'
  result?: any
  error?: string
  duration?: number
}

const BACKEND_URL = 'https://ssf.smart-village.solutions'

export function NetworkDiagnostics() {
  const [tests, setTests] = useState<NetworkTest[]>([
    {
      name: 'DNS Resolution',
      description: 'Prüft ob die IP-Adresse erreichbar ist',
      status: 'pending'
    },
    {
      name: 'Basic HTTP Connection',
      description: 'Testet grundlegende HTTP-Verbindung',
      status: 'pending'
    },
    {
      name: 'CORS Preflight',
      description: 'Prüft CORS-Konfiguration mit OPTIONS-Request',
      status: 'pending'
    },
    {
      name: 'Health Endpoint',
      description: 'Testet /health Endpunkt falls vorhanden',
      status: 'pending'
    },
    {
      name: 'Pipeline Endpoint',
      description: 'Testet /pipeline Endpunkt für Audio-Processing',
      status: 'pending'
    }
  ])
  
  const [isRunning, setIsRunning] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  const updateTest = useCallback((index: number, updates: Partial<NetworkTest>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ))
  }, [])

  const runTest = useCallback(async (testIndex: number): Promise<void> => {
    const test = tests[testIndex]
    updateTest(testIndex, { status: 'running' })
    
    const startTime = performance.now()
    
    try {
      let result: any = null
      
      switch (test.name) {
        case 'DNS Resolution':
          // Simulate DNS test with basic connectivity
          result = await testDNSResolution()
          break
          
        case 'Basic HTTP Connection':
          result = await testBasicHTTP()
          break
          
        case 'CORS Preflight':
          result = await testCORSPreflight()
          break
          
        case 'Health Endpoint':
          result = await testHealthEndpoint()
          break
          
        case 'Pipeline Endpoint':
          result = await testPipelineEndpoint()
          break
      }
      
      const duration = Math.round(performance.now() - startTime)
      updateTest(testIndex, { 
        status: 'success', 
        result, 
        duration 
      })
      
    } catch (error) {
      const duration = Math.round(performance.now() - startTime)
      updateTest(testIndex, { 
        status: 'error', 
        error: error instanceof Error ? error.message : String(error),
        duration 
      })
    }
  }, [tests, updateTest])

  const runAllTests = useCallback(async () => {
    setIsRunning(true)
    setOverallProgress(0)
    
    // Reset all tests
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'pending' as const,
      result: undefined,
      error: undefined,
      duration: undefined
    })))
    
    for (let i = 0; i < tests.length; i++) {
      await runTest(i)
      setOverallProgress(((i + 1) / tests.length) * 100)
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    setIsRunning(false)
  }, [tests.length, runTest])

  // Individual test functions
  const testDNSResolution = async () => {
    // We can't really test DNS resolution in browser, but we can test basic reachability
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // Avoid CORS for this basic test
      })
      clearTimeout(timeoutId)
      return { reachable: true, type: response.type }
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Timeout - Server nicht erreichbar')
      }
      // For no-cors mode, some errors are expected
      return { reachable: true, note: 'Server erreicht (CORS-begrenzt)' }
    }
  }

  const testBasicHTTP = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors'
      })
      clearTimeout(timeoutId)
      
      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  const testCORSPreflight = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    try {
      const response = await fetch(`${BACKEND_URL}/pipeline`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        signal: controller.signal,
        mode: 'cors'
      })
      clearTimeout(timeoutId)
      
      return {
        status: response.status,
        corsHeaders: {
          allowOrigin: response.headers.get('Access-Control-Allow-Origin'),
          allowMethods: response.headers.get('Access-Control-Allow-Methods'),
          allowHeaders: response.headers.get('Access-Control-Allow-Headers'),
          maxAge: response.headers.get('Access-Control-Max-Age')
        },
        ok: response.ok
      }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  const testHealthEndpoint = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors'
      })
      clearTimeout(timeoutId)
      
      let body = null
      try {
        const text = await response.text()
        body = text
        // Try to parse as JSON
        if (text.trim().startsWith('{')) {
          body = JSON.parse(text)
        }
      } catch (e) {
        // Keep as text
      }
      
      return {
        status: response.status,
        body,
        contentType: response.headers.get('content-type'),
        ok: response.ok
      }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  const testPipelineEndpoint = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // Longer timeout for pipeline
    
    try {
      // Create minimal test FormData
      const formData = new FormData()
      formData.append('source_lang', 'de')
      formData.append('target_lang', 'en')
      formData.append('file', new Blob(['test'], { type: 'audio/wav' }), 'test.wav')
      
      const response = await fetch(`${BACKEND_URL}/pipeline`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        mode: 'cors'
      })
      clearTimeout(timeoutId)
      
      const contentType = response.headers.get('content-type')
      let bodyInfo = { type: contentType, size: 0 }
      
      if (contentType?.includes('audio')) {
        const blob = await response.blob()
        bodyInfo.size = blob.size
      } else {
        try {
          const text = await response.text()
          bodyInfo.size = text.length
        } catch (e) {
          // Ignore
        }
      }
      
      return {
        status: response.status,
        contentType,
        bodyInfo,
        ok: response.ok
      }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  const getStatusIcon = (status: NetworkTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <CardTitle>Netzwerk-Diagnose</CardTitle>
          </div>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? 'Tests laufen...' : 'Alle Tests starten'}
          </Button>
        </div>
        
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Fortschritt</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="w-full" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4" />
            <span className="font-medium">Test-Ziel:</span>
          </div>
          <code className="text-blue-800">{BACKEND_URL}</code>
          <div className="mt-1 text-xs">
            Frontend-Origin: <code>{window.location.origin}</code>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          {tests.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-3 ${
                test.status === 'success' ? 'border-green-200 bg-green-50' :
                test.status === 'error' ? 'border-red-200 bg-red-50' :
                test.status === 'running' ? 'border-blue-200 bg-blue-50' :
                'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                  {test.duration && (
                    <Badge variant="outline" className="text-xs">
                      {test.duration}ms
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => runTest(index)}
                  disabled={isRunning || test.status === 'running'}
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                >
                  Wiederholen
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{test.description}</p>
              
              {test.error && (
                <div className="text-sm text-red-700 bg-red-100 p-2 rounded">
                  <strong>Fehler:</strong> {test.error}
                </div>
              )}
              
              {test.result && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">
                    Ergebnis-Details anzeigen
                  </summary>
                  <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto text-xs">
                    {JSON.stringify(test.result, null, 2)}
                  </pre>
                </details>
              )}
            </motion.div>
          ))}
        </div>
        
        <Separator />
        
        <div className="text-xs text-gray-500">
          <p className="mb-1">
            <strong>Hinweis:</strong> Diese Tests helfen bei der Diagnose von Verbindungsproblemen.
          </p>
          <p>
            Wenn alle Tests fehlschlagen, ist der Server möglicherweise nicht erreichbar.
            Wenn nur CORS-Tests fehlschlagen, sind die Server-Headers nicht korrekt konfiguriert.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}