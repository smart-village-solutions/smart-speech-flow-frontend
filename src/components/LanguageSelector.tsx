"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ArrowLeftRight } from "lucide-react"
import { Button } from "./ui/button"
import { getTranslation, type SupportedLanguage } from "./translations"

interface Language {
  code: string
  name: string
  flag: string
}

interface LanguageSelectorProps {
  sourceLanguage: string
  targetLanguage: string
  onSourceLanguageChange: (language: string) => void
  onTargetLanguageChange: (language: string) => void
  onSwapLanguages: () => void
  uiLanguage: SupportedLanguage
}

const languages: Language[] = [
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "am", name: "አማርኛ", flag: "🇪🇹" },
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Українська", flag: "🇺🇦" }
]

export function LanguageSelector({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onSwapLanguages,
  uiLanguage
}: LanguageSelectorProps) {
  const t = getTranslation(uiLanguage)
  
  return (
    <div className="flex items-center gap-3 w-full max-w-md mx-auto">
      <div className="flex-1">
        <Select value={sourceLanguage} onValueChange={onSourceLanguageChange}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{t.languages[lang.code as keyof typeof t.languages]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onSwapLanguages}
        className="h-12 w-12 rounded-full"
      >
        <ArrowLeftRight className="h-4 w-4" />
      </Button>
      
      <div className="flex-1">
        <Select value={targetLanguage} onValueChange={onTargetLanguageChange}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{t.languages[lang.code as keyof typeof t.languages]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}