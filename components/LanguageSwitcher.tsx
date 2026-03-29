'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage, languageNames, Language } from './LanguageContext'
import { Globe, ChevronDown } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-200 text-sm font-medium border border-white/30"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{languageNames[language].split(' ')[0]}</span>
        <span className="hidden sm:inline text-xs opacity-80">{languageNames[language].split(' ').slice(1).join(' ')}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200">
          {(Object.keys(languageNames) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setIsOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-pink-50 transition-colors flex items-center gap-2 ${
                language === lang ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-700'
              }`}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
