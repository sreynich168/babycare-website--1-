'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, MessageSquare, FolderHeart, Calendar, MapPin, UserCircle, Activity, Heart, Menu, X, LogOut, ScanLine, GraduationCap, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/components/LanguageContext'
import { useRouter } from 'next/navigation'

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const router = useRouter()

  const navigation = [
    { name: t('nav.dashboard'), href: '/parent', icon: LayoutDashboard },
    { name: t('nav.documents'), href: '/parent/documents', icon: FileText },
    { name: t('nav.chatbot'), href: '/parent/chatbot', icon: MessageSquare },
    { name: t('nav.records'), href: '/parent/medical-records', icon: FolderHeart },
    { name: t('nav.booking'), href: '/parent/booking', icon: Calendar },
    { name: 'Book Teacher', href: '/parent/teachers', icon: GraduationCap },
    { name: 'Baby Shop', href: '/parent/shop', icon: ShoppingBag },
    { name: t('nav.clinics'), href: '/parent/clinics', icon: MapPin },
    { name: t('nav.risk'), href: '/parent/risk-prediction', icon: Activity },
    { name: 'Baby Scan', href: '/parent/baby-scan', icon: ScanLine },
    { name: t('nav.profile'), href: '/parent/profile', icon: UserCircle },
  ]

  return (
    <div className="min-h-screen bg-pink-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-pink-100 shadow-xl
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0
        flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-pink-50 bg-pink-50/50">
          <Heart className="w-8 h-8 text-pink-500 mr-3 fill-pink-500" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">BabyCare</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const isShop = item.href === '/parent/shop'
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? isShop 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md shadow-blue-200'
                      : 'bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md shadow-pink-200' 
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-pink-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-pink-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => router.push('/')}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative shadow-inner transition-colors duration-700 ${pathname === '/parent/shop' ? 'bg-blue-100/40' : "bg-[url('/mom-baby-bg.png')] bg-cover bg-fixed bg-center"}`}>
        {/* Soft Dreamy Overlay */}
        <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ease-in-out ${pathname === '/parent/shop' ? 'bg-transparent' : 'bg-white/30 backdrop-blur-sm' }`} />
        
        {/* Floating Icons Animation Layer for cuteness (Hidden on Shop for clarity) */}
        <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40 ${pathname === '/parent/shop' ? 'hidden' : ''}`}>
           <Heart className="absolute text-pink-400 w-20 h-20 animate-[pulse_6s_ease-in-out_infinite] top-[10%] left-[10%] rotate-12 fill-pink-100/50" />
           <MessageSquare className="absolute text-purple-400 w-12 h-12 animate-[bounce_8s_infinite] top-[25%] right-[15%] -rotate-12" />
           <FolderHeart className="absolute text-rose-400 w-24 h-24 animate-[pulse_10s_ease-in-out_infinite] bottom-[15%] left-[20%] rotate-45" />
           <Activity className="absolute text-orange-400 w-16 h-16 animate-[bounce_7s_infinite] bottom-[30%] right-[10%] rotate-[-20deg]" />
           <ScanLine className="absolute text-blue-300 w-28 h-28 animate-[pulse_12s_ease-in-out_infinite] top-[50%] left-[5%]" />
           <Heart className="absolute text-pink-300 w-10 h-10 animate-[bounce_9s_infinite] top-[60%] right-[25%] -rotate-12 fill-pink-50" />
        </div>

        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-pink-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 sticky top-0 shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-gray-500 hover:text-pink-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <UserCircle className="w-6 h-6 text-pink-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10 pb-20">
          {children}
        </main>
      </div>
    </div>
  )
}
