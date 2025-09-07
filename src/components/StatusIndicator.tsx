"use client"

import { motion } from "motion/react"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { getTranslation, type SupportedLanguage } from "./translations"

export type Status = "connected" | "disconnected" | "recording" | "translating" | "error"

interface StatusIndicatorProps {
  status: Status
  message?: string
  className?: string
  language: SupportedLanguage
}

export function StatusIndicator({ status, message, className = "", language }: StatusIndicatorProps) {
  const t = getTranslation(language)
  
  const statusConfig = {
    connected: {
      icon: Wifi,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      defaultMessage: t.connected
    },
    disconnected: {
      icon: WifiOff,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      defaultMessage: t.disconnected
    },
    recording: {
      icon: () => (
        <motion.div
          className="w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      ),
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      defaultMessage: t.recording
    },
    translating: {
      icon: Loader2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      defaultMessage: t.translating
    },
    error: {
      icon: WifiOff,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      defaultMessage: t.error
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon
  const displayMessage = message || config.defaultMessage

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${config.bgColor} ${className}`}>
      <div className={config.color}>
        {typeof Icon === 'function' ? (
          <Icon />
        ) : (
          <Icon className={`w-4 h-4 ${status === 'translating' ? 'animate-spin' : ''}`} />
        )}
      </div>
      <span className={`text-sm ${config.color}`}>
        {displayMessage}
      </span>
    </div>
  )
}