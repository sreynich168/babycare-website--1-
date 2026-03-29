'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, GraduationCap, MapPin, Phone, MessageSquare, ClipboardList, Activity } from 'lucide-react'
import Link from 'next/link'

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('babycare_teacher_bookings')
    if (raw) {
      try {
        const bookings = JSON.parse(raw)
        // Students are parents who have confirmed bookings
        const confirmed = bookings.filter((b: any) => b.status === 'confirmed')
        setStudents(confirmed)
      } catch (e) {}
    }
    setLoading(false)
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
             <Users className="w-8 h-8 text-emerald-500" />
             My Student Records
          </h1>
          <p className="text-gray-500 font-medium">Keep track of your active students and their learning progress.</p>
        </div>
      </div>

      {students.length === 0 && !loading ? (
        <Card className="border-2 border-dashed border-gray-100 bg-gray-50/50 p-20 text-center rounded-[3rem]">
          <GraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400">No active students yet</h3>
          <p className="text-gray-400">Approve lesson requests to populate your student list.</p>
          <Button className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-2xl px-8 shadow-lg shadow-emerald-500/20" asChild>
             <Link href="/teacher/lessons">Go to Requests</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all group">
              <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 p-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/20 rounded-full -mr-10 -mt-10 blur-2xl" />
                 <div className="flex items-center gap-4 relative z-10">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-xl">
                       <AvatarFallback className="bg-emerald-500 text-white font-black text-xl">{student.parentName.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                       <CardTitle className="text-xl font-black text-gray-900 tracking-tight">{student.parentName}’s Child</CardTitle>
                       <CardDescription className="font-bold text-emerald-600 text-xs uppercase tracking-widest">{student.subject}</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                       <MapPin className="w-4 h-4 text-emerald-500" /> 
                       Home Visit Learning
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                       <Activity className="w-4 h-4 text-emerald-500" /> 
                       Progress: Beginner
                    </div>
                 </div>

                 <div className="flex gap-3 pt-4 border-t border-slate-50">
                    <Button variant="outline" className="flex-1 rounded-2xl h-12 border-slate-100 hover:bg-emerald-50 font-bold" asChild>
                       <Link href="/teacher/chat"><MessageSquare className="w-4 h-4 mr-2 text-emerald-500" /> Chat</Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50">
                       <ClipboardList className="w-5 h-5" />
                    </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
