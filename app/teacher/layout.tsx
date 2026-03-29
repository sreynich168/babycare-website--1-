'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  UserCircle, 
  GraduationCap, 
  Menu, 
  LogOut, 
  Activity,
  ChevronRight,
  BookOpen,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  const navigation = [
    { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { name: 'My Schedule', href: '/teacher/lessons', icon: Calendar },
    { name: 'Student Records', href: '/teacher/students', icon: Users },
    { name: 'Messages', href: '/teacher/chat', icon: MessageSquare },
    { name: 'Profile', href: '/teacher/profile', icon: UserCircle },
  ]

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
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
        fixed inset-y-0 left-0 z-50 w-72 bg-emerald-950 text-white shadow-2xl
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0
        flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-24 flex items-center px-8 bg-emerald-950/50 border-b border-emerald-900">
          <GraduationCap className="w-10 h-10 text-emerald-400 mr-3" />
          <span className="text-2xl font-black tracking-tighter">Teacher Portal</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-4 text-sm font-bold rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-emerald-300/60 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-emerald-300/40 group-hover:text-emerald-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-6 border-t border-emerald-900/50 bg-emerald-950/80">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-2xl h-12 font-bold"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout Session
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-[40] sticky top-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-slate-500 hover:text-emerald-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-7 h-7" />
          </Button>
          
          <div className="hidden lg:flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Server Status: Online</span>
          </div>

          <div className="flex-1" />
          
          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Prof.</p>
                  <p className="text-sm font-bold text-slate-900">Education Dept.</p>
               </div>
               <div className="w-12 h-12 rounded-[1rem] bg-emerald-100 flex items-center justify-center border-2 border-white shadow-xl shadow-emerald-100/50 transition-transform hover:scale-105">
                 <UserCircle className="w-7 h-7 text-emerald-600" />
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-12 z-10 pb-24 relative">
          {/* Decorative backgrounds inside main area */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
