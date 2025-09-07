"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"
import { getTranslation, type SupportedLanguage } from "./translations"

interface PasswordLoginProps {
  onAuthenticated: () => void
  language: SupportedLanguage
}

const SYSTEM_PASSWORD = "translator2024" // Systempasswort

export function PasswordLogin({ onAuthenticated, language }: PasswordLoginProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const t = getTranslation(language)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simuliere kurze Überprüfungszeit für bessere UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === SYSTEM_PASSWORD) {
      onAuthenticated()
    } else {
      setError(t.wrongPassword)
      setPassword("")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
            >
              <Lock className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {t.loginTitle}
            </h1>
            <p className="text-gray-600">
              {t.loginSubtitle}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t.password}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="pr-12"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              disabled={!password.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.checking}
                </div>
              ) : (
                t.login
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            {t.securePrivate}
          </div>
        </div>
      </motion.div>
    </div>
  )
}