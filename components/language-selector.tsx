'use client'

import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageSelectorProps {
  currentLanguage: string
  setCurrentLanguage: (language: string) => void
}

export default function LanguageSelector({ currentLanguage, setCurrentLanguage }: LanguageSelectorProps) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
  ]

  const currentLang = languages.find(lang => lang.code === currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white/90 backdrop-blur-sm border-pink-200 hover:bg-pink-50">
          <Globe className="w-4 h-4 mr-2" />
          <span className="mr-1">{currentLang?.flag}</span>
          <span className="hidden sm:inline">{currentLang?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setCurrentLanguage(language.code)}
            className={`cursor-pointer ${
              currentLanguage === language.code ? 'bg-pink-50 text-pink-600' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
