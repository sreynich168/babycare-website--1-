'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, CheckCircle2, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = () => {
    const raw = localStorage.getItem('babycare_doctor_appointments')
    let parsed = []
    if (raw) {
      try {
        parsed = JSON.parse(raw)
      } catch (e) {
        console.error('Failed to parse appointments', e)
      }
    }

    if (parsed && parsed.length > 0) {
      setAppointments(parsed)
    } else {
      // Mock some data if empty to show it works
      const mockAppts = [
        {
          id: 'mock_1',
          patientName: 'Sarah Johnson',
          time: '10:00 AM',
          date: new Date().toISOString().split('T')[0],
          type: 'Home Visit',
          status: 'Confirmed',
          location: '123 Maple St, Springfield',
          avatar: 'SJ'
        },
        {
          id: 'mock_2',
          patientName: 'Michael Chen',
          time: '02:30 PM',
          date: new Date().toISOString().split('T')[0],
          type: 'Home Visit',
          status: 'Confirmed',
          location: '456 Oak Lane, Riverside',
          avatar: 'MC'
        }
      ]
      setAppointments(mockAppts)
      localStorage.setItem('babycare_doctor_appointments', JSON.stringify(mockAppts))
    }
    setLoading(false)
  }

  const handleComplete = (id: string) => {
    const updated = appointments.map(a => 
      a.id === id ? { ...a, status: 'Completed' } : a
    )
    setAppointments(updated)
    localStorage.setItem('babycare_doctor_appointments', JSON.stringify(updated))
  }

  // Filter appointments for the selected date (Mock: just show all for simplicity in demo)
  const todaysAppts = appointments.filter(a => a.status !== 'Completed')
  const completedAppts = appointments.filter(a => a.status === 'Completed')

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center mb-2">
            <Calendar className="w-8 h-8 mr-3 text-blue-500" />
            Your Schedule
          </h1>
          <p className="text-slate-500 font-medium">View and manage your daily home visits and consultations.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Button variant="ghost" size="icon" className="rounded-xl"><ChevronLeft className="w-4 h-4" /></Button>
          <div className="px-4 font-bold text-slate-700">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Confirmed Visits ({todaysAppts.length})</h2>
          </div>

          {todaysAppts.length === 0 ? (
            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-500">No visits scheduled today</h3>
                <p className="text-slate-400">Your upcoming patient visits will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {todaysAppts.map((appt) => (
                <Card key={appt.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-32 bg-blue-500 flex flex-col items-center justify-center p-4 text-white text-center">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Time</span>
                        <span className="text-xl font-black">{appt.time}</span>
                      </div>
                      <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-slate-100 shadow-sm">
                            <AvatarFallback className="bg-slate-100 text-slate-700 font-bold">{appt.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{appt.patientName}</h4>
                            <div className="flex items-center text-sm text-slate-500 font-medium">
                              <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                              {typeof appt.location === 'object' 
                                ? `${appt.location.homeNumber}, ${appt.location.address}, ${appt.location.city}`
                                : appt.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 py-1.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider mb-2 sm:mb-0">
                            {appt.type}
                          </Badge>
                          <Button 
                            onClick={() => handleComplete(appt.id)}
                            className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl px-6 h-10 shadow-lg"
                          >
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {completedAppts.length > 0 && (
            <div className="pt-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 opacity-50 italic">Successfully Completed</h2>
              <div className="space-y-3">
                {completedAppts.map((appt) => (
                  <Card key={appt.id} className="border-0 shadow-sm bg-slate-50/50 opacity-60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{appt.patientName}</p>
                          <p className="text-xs text-slate-500 font-medium">{appt.time} • {typeof appt.location === 'object' ? `${appt.location.homeNumber}, ${appt.location.city}` : appt.location}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-emerald-500 border-emerald-200">Done</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Calendar Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg">Calendar Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="font-bold text-slate-400">{day}</div>
                ))}
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-10 w-10 flex items-center justify-center rounded-xl cursor-pointer transition-all ${
                      i + 1 === selectedDate.getDate() 
                      ? 'bg-blue-500 text-white font-black shadow-lg shadow-blue-200' 
                      : 'hover:bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-slate-100 space-y-4">
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-slate-500 font-medium">Daily Availability</span>
                   <span className="text-blue-600 font-bold">8h remaining</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[40%] rounded-full shadow-inner" />
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-500 to-blue-600 text-white overflow-hidden p-6 relative">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-1 tracking-tight italic uppercase text-[10px] opacity-80">Next Patient</h4>
              <p className="text-2xl font-black tracking-tighter italic mb-4">Preparation Check</p>
              <ul className="space-y-2 text-sm font-medium opacity-90 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 opacity-50" /> Review medical history</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 opacity-50" /> Confirm travel route</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 opacity-50" /> Pack visit essentials</li>
              </ul>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-xl">Prepare Now</Button>
            </div>
            <Activity className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 rotate-12" />
          </Card>
        </div>
      </div>
    </div>
  )
}
