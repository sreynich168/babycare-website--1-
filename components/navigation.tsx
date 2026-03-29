'use client'

import { useState } from 'react'
import { Heart, Baby, Users, MessageCircle, Menu, X, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface NavigationProps {
  currentSection: string
  setCurrentSection: (section: string) => void
  language: string
}

export default function Navigation({ currentSection, setCurrentSection, language }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const translations = {
    en: {
      home: "Home",
      pregnancy: "Pregnancy Care",
      postpartum: "Postpartum Care",
      baby: "Baby Care",
      ai: "AI Assistant"
    },
    hi: {
      home: "होम",
      pregnancy: "गर्भावस्था देखभाल",
      postpartum: "प्रसवोत्तर देखभाल",
      baby: "शिशु देखभाल",
      ai: "AI सहायक"
    },
    km: {
      home: "ទំព័រដើម",
      pregnancy: "ការថែទាំពេលមានផ្ទៃពោះ",
      postpartum: "ការថែទាំក្រោយសម្រាល",
      baby: "ការថែទាំកុមារ",
      ai: "ជំនួយការ AI"
    }
  }

  const t = translations[language as keyof typeof translations]

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'pregnancy', label: t.pregnancy, icon: Heart },
    { id: 'postpartum', label: t.postpartum, icon: Users },
    { id: 'baby', label: t.baby, icon: Baby },
    { id: 'ai', label: t.ai, icon: MessageCircle },
  ]

  const NavContent = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.id}
            variant={currentSection === item.id ? "default" : "ghost"}
            className={`flex items-center gap-2 ${
              currentSection === item.id 
                ? "bg-pink-500 text-white hover:bg-pink-600" 
                : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
            }`}
            onClick={() => {
              setCurrentSection(item.id)
              setIsOpen(false)
            }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden lg:inline">{item.label}</span>
          </Button>
        )
      })}
    </>
  )

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-pink-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentSection('home')}
          >
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-pink-600">BabyCare</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavContent />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <Baby className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-pink-600">BabyCare</span>
                  </div>
                  <NavContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
