"use client"

import { motion } from "motion/react"

interface AudioVisualizerProps {
  isRecording: boolean
  className?: string
}

export function AudioVisualizer({ isRecording, className = "" }: AudioVisualizerProps) {
  // Simuliere Audio-Daten mit verschiedenen Balken-Höhen
  const bars = Array.from({ length: 20 }, (_, i) => i)
  
  return (
    <div className={`flex items-center justify-center gap-1 h-12 ${className}`}>
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="bg-blue-500 w-1 rounded-full"
          initial={{ height: 4 }}
          animate={{
            height: isRecording 
              ? [4, Math.random() * 40 + 8, 4] 
              : 4,
          }}
          transition={{
            duration: 0.6,
            repeat: isRecording ? Infinity : 0,
            delay: bar * 0.05,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}