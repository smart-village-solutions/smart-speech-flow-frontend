"use client"

import { motion } from "motion/react"
import { Mic, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./ui/button"
import { getTranslation, type SupportedLanguage } from "./translations"

interface MicrophonePermissionProps {
  onRequestPermission: () => Promise<boolean>
  language: SupportedLanguage
  isLoading?: boolean
}

export function MicrophonePermission({ 
  onRequestPermission, 
  language, 
  isLoading = false 
}: MicrophonePermissionProps) {
  const t = getTranslation(language)

  const handleRequestPermission = async () => {
    await onRequestPermission()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-sm mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
          <Mic className="w-8 h-8 text-blue-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">
            {t.microphonePermissionTitle}
          </h3>
          <p className="text-sm text-gray-600">
            {t.microphonePermissionDescription}
          </p>
        </div>

        <Button 
          onClick={handleRequestPermission}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              {t.requesting}
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              {t.allowMicrophone}
            </>
          )}
        </Button>

        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              {t.microphonePermissionHelp}
            </p>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Chrome/Edge:</strong> Look for the microphone icon in the address bar</p>
            <p><strong>Firefox:</strong> Check the shield icon for blocked permissions</p>
            <p><strong>Safari:</strong> Go to Safari &gt; Settings &gt; Websites &gt; Microphone</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}