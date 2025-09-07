"use client"

import { motion } from "motion/react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "./ui/button"

interface MicrophoneButtonProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  disabled?: boolean
  recordingProgress?: number // 0-1, where 1 is 100% complete
}

export function MicrophoneButton({
  isRecording,
  onStartRecording,
  onStopRecording,
  disabled = false,
  recordingProgress = 0
}: MicrophoneButtonProps) {
  const handleClick = () => {
    if (disabled) return
    
    if (isRecording) {
      onStopRecording()
    } else {
      onStartRecording()
    }
  }

  // Berechne die Farbe basierend auf dem Progress (15s grün -> 10s gelb -> 5s rot)
  const getProgressColor = (progress: number) => {
    if (progress < 0.5) {
      // Grün (0-15s = 0-50% Progress)
      return `hsl(120, 100%, 50%)`
    } else if (progress < 0.833) {
      // Gelb (15-25s = 50-83.3% Progress)
      return `hsl(60, 100%, 50%)`
    } else {
      // Rot (25-30s = 83.3-100% Progress)
      return `hsl(0, 100%, 50%)`
    }
  }

  // Berechne den Stroke-dashoffset für den Progress-Circle
  const radius = 44 // Radius für den Progress-Circle
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (recordingProgress * circumference)

  return (
    <div className="relative">
      {/* Timer Progress Circle */}
      {isRecording && (
        <div className="absolute inset-0 w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Hintergrund-Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="3"
            />
            {/* Progress-Circle */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={getProgressColor(recordingProgress)}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-colors duration-200"
            />
          </svg>
        </div>
      )}

      {/* Animierte Ringe bei Aufnahme */}
      {isRecording && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500/20"
            animate={{ scale: [1, 1.3], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500/20"
            animate={{ scale: [1, 1.3], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.7 }}
          />
        </>
      )}
      
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <Button
          size="icon"
          onClick={handleClick}
          disabled={disabled}
          className={`
            w-20 h-20 rounded-full relative z-10 shadow-lg
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <motion.div
            animate={{ rotate: isRecording ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isRecording ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}