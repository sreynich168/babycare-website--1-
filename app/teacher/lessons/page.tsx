'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react'

export default function TeacherLessonsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    const token = localStorage.getItem('auth_token')
    let allBookings = []

    // 1. Try localStorage
    const raw = localStorage.getItem('babycare_teacher_bookings')
    if (raw) {
      try { allBookings = JSON.parse(raw) } catch (e) {}
    }

    // 2. Try Backend
    if (token) {
      try {
        const resp = await fetch('http://localhost:8000/api/teachers/bookings/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (resp.ok) {
          const backendBookings = await resp.json()
          // Map backend fields to frontend names if needed
          const mapped = backendBookings.map((b: any) => ({
             id: b.id.toString(),
             parentName: b.parent_name,
             subject: b.subject,
             date: b.date,
             time: b.time,
             status: b.status,
             isBackend: true
          }))
          
          // Merge (prefer backend if same ID)
          mapped.forEach((mb: any) => {
             if (!allBookings.find((ab: any) => ab.id === mb.id)) {
                allBookings.push(mb)
             }
          })
        }
      } catch (err) {
        console.error("Backend load failed", err)
      }
    }

    setBookings(allBookings)
    setLoading(false)
  }

  const handleAction = async (id: string, status: 'confirmed' | 'rejected') => {
    const token = localStorage.getItem('auth_token')
    const booking = bookings.find(b => b.id === id)

    // 1. Backend Update
    if (token && booking?.isBackend) {
       try {
         await fetch(`http://localhost:8000/api/teachers/bookings/${id}`, {
           method: 'PUT',
           headers: { 
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({ action: status === 'confirmed' ? 'confirm' : 'reject' })
         })
       } catch (err) {
         console.error("Failed to update backend booking")
       }
    }

    // 2. Local State Update
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b)
    setBookings(updated)
    localStorage.setItem('babycare_teacher_bookings', JSON.stringify(updated))
  }

  const pending = bookings.filter(b => b.status === 'pending')
  const active = bookings.filter(b => b.status === 'confirmed')

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
             <Calendar className="w-8 h-8 text-emerald-500" />
             Lesson Schedule
          </h1>
          <p className="text-gray-500 font-medium">Approve and manage your tutoring sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Pending Requests */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 px-2 flex items-center gap-2">
             Pending Requests <Badge variant="secondary" className="bg-amber-100 text-amber-700">{pending.length}</Badge>
          </h2>
          {pending.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-100 bg-gray-50/50 p-12 text-center rounded-3xl">
              <p className="text-gray-400 font-medium italic">No pending lesson requests.</p>
            </Card>
          ) : (
            pending.map(req => (
              <Card key={req.id} className="border-0 shadow-lg rounded-[2rem] overflow-hidden group">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="bg-amber-400 p-6 md:w-48 flex flex-col items-center justify-center text-white">
                     <Clock className="w-8 h-8 mb-2 opacity-80" />
                     <span className="text-2xl font-black">{req.time}</span>
                     <span className="text-[10px] font-bold uppercase tracking-widest">{req.date}</span>
                  </div>
                  <div className="p-8 flex-1 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-black">
                          {req.parentName.substring(0, 1)}
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-gray-900">{req.parentName}’s Child</h3>
                          <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">{req.subject}</p>
                       </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                       <Button onClick={() => handleAction(req.id, 'confirmed')} className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl px-6">
                          Approve
                       </Button>
                       <Button onClick={() => handleAction(req.id, 'rejected')} variant="outline" className="flex-1 md:flex-none text-rose-500 border-rose-100 hover:bg-rose-50 rounded-xl h-12">
                          Ignore
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Confirmed Lessons */}
        <div className="space-y-4 pt-4">
           <h2 className="text-xl font-bold text-gray-800 px-2 flex items-center gap-2">
             Confirmed Schedule <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{active.length}</Badge>
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {active.map(app => (
                <Card key={app.id} className="border-0 shadow-md rounded-2xl bg-white/50 backdrop-blur-md">
                   <CardContent className="p-6 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                           <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="font-bold text-gray-900">{app.parentName}’s Child</p>
                           <p className="text-xs text-gray-500 font-medium">{app.date} • {app.time}</p>
                        </div>
                     </div>
                     <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                   </CardContent>
                </Card>
              ))}
              {active.length === 0 && (
                <p className="col-span-full text-center py-8 text-gray-400 italic">No lessons confirmed yet.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
