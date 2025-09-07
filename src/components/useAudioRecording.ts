import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseAudioRecordingOptions {
  maxDuration?: number // in milliseconds
  onProgress?: (progress: number) => void
  onMaxDurationReached?: () => void
}

export interface UseAudioRecordingReturn {
  isRecording: boolean
  audioBlob: Blob | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  error: string | null
  clearError: () => void
  progress: number
  timeRemaining: number
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown'
  requestPermission: () => Promise<boolean>
}

export function useAudioRecording({
  maxDuration = 30000, // 30 seconds default
  onProgress,
  onMaxDurationReached
}: UseAudioRecordingOptions = {}): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(maxDuration)
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // Check initial permission status
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          setPermissionStatus(permission.state as 'granted' | 'denied' | 'prompt')
          
          // Listen for permission changes
          permission.onchange = () => {
            setPermissionStatus(permission.state as 'granted' | 'denied' | 'prompt')
            // Clear any existing errors when permission changes
            if (permission.state === 'granted') {
              setError(null)
            }
          }
        } else {
          // If permissions API is not supported, we'll check on first use
          setPermissionStatus('prompt')
        }
      } catch (error) {
        console.log('Permission API not supported')
        setPermissionStatus('prompt')
      }
    }
    
    checkPermission()
  }, [])

  const updateProgress = useCallback(() => {
    if (!startTimeRef.current) return

    const elapsed = Date.now() - startTimeRef.current
    const currentProgress = Math.min(elapsed / maxDuration, 1)
    const remaining = Math.max(maxDuration - elapsed, 0)

    setProgress(currentProgress)
    setTimeRemaining(remaining)
    onProgress?.(currentProgress)

    if (currentProgress >= 1) {
      onMaxDurationReached?.()
      return
    }

    progressTimerRef.current = setTimeout(updateProgress, 100)
  }, [maxDuration, onProgress, onMaxDurationReached])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('NO_MICROPHONE')
        return false
      }
      
      // Try to get user media to request permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      })
      
      // Stop the stream immediately since we just wanted to request permission
      stream.getTracks().forEach(track => track.stop())
      
      setPermissionStatus('granted')
      return true
    } catch (err) {
      console.error('Permission request failed:', err)
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setPermissionStatus('denied')
          setError('PERMISSION_DENIED')
        } else if (err.name === 'NotFoundError') {
          setPermissionStatus('denied')
          setError('NO_MICROPHONE')
        } else if (err.name === 'NotReadableError') {
          setError('MICROPHONE_BUSY')
        } else if (err.name === 'OverconstrainedError') {
          setError('MICROPHONE_CONSTRAINED')
        } else {
          setError('UNKNOWN_ERROR')
        }
      } else {
        setError('UNKNOWN_ERROR')
      }
      
      return false
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      startTimeRef.current = null
      
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }
  }, [isRecording])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)

      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('NO_MICROPHONE')
        return
      }

      // Request microphone permission and stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      })

      streamRef.current = stream
      chunksRef.current = []

      // Create MediaRecorder with fallback mime types
      let mediaRecorder: MediaRecorder
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        })
      } catch (e) {
        try {
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm'
          })
        } catch (e2) {
          try {
            mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'audio/mp4'
            })
          } catch (e3) {
            try {
              mediaRecorder = new MediaRecorder(stream)
            } catch (e4) {
              stream.getTracks().forEach(track => track.stop())
              setError('RECORDER_NOT_SUPPORTED')
              return
            }
          }
        }
      }

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType })
        setAudioBlob(audioBlob)
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setError('RECORDING_ERROR')
        stopRecording()
      }

      // Start recording
      mediaRecorder.start(100) // collect data every 100ms
      setIsRecording(true)
      setPermissionStatus('granted')
      startTimeRef.current = Date.now()
      setProgress(0)
      setTimeRemaining(maxDuration)
      updateProgress()

    } catch (err) {
      console.error('Error starting recording:', err)
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setPermissionStatus('denied')
          setError('PERMISSION_DENIED')
        } else if (err.name === 'NotFoundError') {
          setPermissionStatus('denied')
          setError('NO_MICROPHONE')
        } else if (err.name === 'NotReadableError') {
          setError('MICROPHONE_BUSY')
        } else if (err.name === 'OverconstrainedError') {
          setError('MICROPHONE_CONSTRAINED')
        } else if (err.name === 'SecurityError') {
          setPermissionStatus('denied')
          setError('PERMISSION_DENIED')
        } else {
          setError('UNKNOWN_ERROR')
        }
      } else {
        setError('UNKNOWN_ERROR')
      }
    }
  }, [maxDuration, updateProgress, stopRecording])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    error,
    clearError,
    progress,
    timeRemaining: Math.ceil(timeRemaining / 1000), // return in seconds
    permissionStatus,
    requestPermission
  }
}