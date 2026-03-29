'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, MessageSquare, CreditCard, UserCircle, Stethoscope, Menu, LogOut, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/components/LanguageContext'
import { useRouter } from 'next/navigation'

import { useEffect } from 'react'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const router = useRouter()
  
  const isSubscribed = typeof window !== 'undefined' ? localStorage.getItem('doctor_subscribed') === 'true' : false
  const trialOver = false // MOCK: trial disabled
  const showBarrier = trialOver && !isSubscribed && pathname !== '/doctor/subscription'

  useEffect(() => {
    if (showBarrier) {
      router.push('/doctor/subscription')
    }
  }, [showBarrier, router])

  const navigation = [
    { name: t('nav.earnings'), href: '/doctor', icon: LayoutDashboard },
    { name: t('nav.patients'), href: '/doctor/patients', icon: Activity },
    { name: t('nav.schedule'), href: '/doctor/schedule', icon: Calendar },
    { name: t('nav.chat'), href: '/doctor/chat', icon: MessageSquare },
    { name: t('nav.subscription'), href: '/doctor/subscription', icon: CreditCard },
    { name: t('nav.profile'), href: '/doctor/profile', icon: UserCircle },
  ]

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    localStorage.removeItem('doctor_subscribed')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 shadow-xl
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0
        flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
          <Stethoscope className="w-8 h-8 text-blue-400 mr-3" />
          <span className="text-2xl font-bold text-white tracking-tight">Doctor Portal</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-slate-500 hover:text-blue-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <UserCircle className="w-6 h-6 text-blue-600" />
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
