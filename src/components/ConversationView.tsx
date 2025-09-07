"use client"

import { ScrollArea } from "./ui/scroll-area"
import { motion } from "motion/react"
import { getTranslation, type SupportedLanguage } from "./translations"
import { Play, Volume2 } from "lucide-react"
import { useState } from "react"

interface Message {
  id: string
  original: string
  translated: string
  timestamp: Date
  audioUrl?: string
}

interface ConversationViewProps {
  messages: Message[]
  className?: string
  language: SupportedLanguage
}

export function ConversationView({ messages, className = "", language }: ConversationViewProps) {
  const t = getTranslation(language)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const handlePlayAudio = async (audioUrl: string, messageId: string) => {
    try {
      // Stop any currently playing audio
      if (playingAudio) {
        setPlayingAudio(null)
      }

      setPlayingAudio(messageId)
      
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        setPlayingAudio(null)
      }
      
      audio.onerror = () => {
        setPlayingAudio(null)
        console.error('Audio playback failed')
      }
      
      await audio.play()
    } catch (error) {
      setPlayingAudio(null)
      console.error('Failed to play audio:', error)
    }
  }
  
  return (
    <ScrollArea className={`w-full ${className}`}>
      <div className="space-y-6 p-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>{t.startTranslation}</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              {/* Original Message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3">
                  <p>{message.original}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
              
              {/* Translated Message */}
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3">
                  <p>{message.translated}</p>
                  
                  {/* Audio Player für übersetzte Sprache */}
                  {message.audioUrl && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handlePlayAudio(message.audioUrl!, message.id)}
                        disabled={playingAudio === message.id}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
                      >
                        {playingAudio === message.id ? (
                          <Volume2 className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        <span>
                          {playingAudio === message.id ? 'Wird abgespielt...' : 'Übersetzung anhören'}
                        </span>
                      </button>
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1">
                    {t.translated} • {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}