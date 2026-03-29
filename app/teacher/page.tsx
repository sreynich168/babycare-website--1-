'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, BookOpen, Users, Star, Calendar, MessageSquare, Briefcase, Activity } from 'lucide-react'
import Link from 'next/link'

export default function TeacherDashboard() {
  const [userName, setUserName] = useState('Teacher')
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
    }

    const loadData = () => {
       const raw = localStorage.getItem('babycare_teacher_bookings')
       if (raw) {
          try {
             const parsed = JSON.parse(raw)
             setBookings(parsed)
          } catch (e) {}
       }
       setLoading(false)
    }
    loadData()
  }, [])

  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length

  const quickStats = [
    { title: 'Total Lessons', value: confirmedCount.toString(), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'New Requests', value: pendingCount.toString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Rating', value: '5.0', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Students', value: confirmedCount.toString(), icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-10 shadow-lg group border border-white/40">
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay opacity-30" />
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight text-white drop-shadow-sm flex items-center gap-3">
            Welcome, Prof. {userName}! <GraduationCap className="w-8 h-8 text-emerald-100" />
          </h1>
          <p className="text-lg font-medium text-emerald-50 mb-6 leading-relaxed opacity-95">
            Your educational journey with your students begins here. You have 3 lessons scheduled for today. ✨
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-2xl font-bold px-8 h-12 shadow-sm" asChild>
              <Link href="/teacher/lessons">View Schedule</Link>
            </Button>
            <Button variant="outline" className="border-white/60 text-white hover:bg-white/20 rounded-2xl font-bold px-8 h-12 bg-transparent" asChild>
              <Link href="/teacher/profile">Edit Profile</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden hover:shadow-md transition-all">
             <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.title}</h3>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Classes */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center text-gray-800">
                <Calendar className="w-6 h-6 mr-2 text-emerald-500" />
                Upcoming Lessons
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {bookings.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-400 font-medium italic bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 uppercase tracking-widest text-[10px]">
                 No student inquiries yet
              </div>
            )}
            
            {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').slice(0, 4).map((book, i) => (
              <div key={book.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all group overflow-hidden relative">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${book.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${book.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <span className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">TIME</span>
                        <span className="text-sm">10:00</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-800 tracking-tight">{book.subject || 'Standard Session'}</h4>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                           <Users className="w-3 h-3 text-emerald-500" />
                           Student: {book.parentName}’s child
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {book.status === 'pending' && <span className="text-[10px] font-black text-amber-500 uppercase px-2 py-0.5 bg-amber-50 rounded-lg">Awaiting</span>}
                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform border rounded-xl" asChild>
                       <Link href="/teacher/lessons"><ChevronRight className="w-4 h-4 text-gray-300" /></Link>
                    </Button>
                  </div>
              </div>
            ))}
            
            <Button className="w-full h-12 mt-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-2xl border-none" asChild>
               <Link href="/teacher/lessons">Manage All Student Schedule</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Messaging Area */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-white rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center text-gray-800">
              <MessageSquare className="w-6 h-6 mr-2 text-blue-500" />
              Parent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
               {[1, 2].map(i => (
                 <div key={i} className="p-4 bg-white rounded-2xl shadow-sm border border-blue-100">
                   <p className="text-xs font-bold text-gray-400 mb-1">2 hours ago</p>
                   <p className="text-sm font-bold text-gray-800 line-clamp-2">Hello Prof! I would like to schedule a home session for Sunday afternoon...</p>
                 </div>
               ))}
            </div>
            <Button className="w-full h-12 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100">
              Open Chat Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ChevronRight(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    )
}
