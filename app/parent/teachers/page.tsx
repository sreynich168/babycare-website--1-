'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GraduationCap, Search, Star, MessageSquare, Calendar, Filter, Clock, MapPin, CheckCircle2, ChevronRight, X, Sparkles, Heart, User } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function BookTeacherPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [successBooking, setSuccessBooking] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const resp = await fetch('http://localhost:8000/api/teachers')
        let data = []
        if (resp.ok) {
          data = await resp.json()
        }

        // Merge with local custom profile if exists
        const custom = localStorage.getItem('babycare_custom_teacher_profile')
        if (custom) {
           const cp = JSON.parse(custom)
           // Add to top of list
           setTeachers([cp, ...data.filter((t: any) => t.id !== cp.id)])
        } else {
           if (data.length > 0) setTeachers(data)
           else throw new Error('Mock required')
        }
      } catch (err) {
        let baseMock = [
          { id: 't1', name: 'Prof. Anderson', subject: 'Early Childhood Development', rating: 4.9, price_per_hour: 30, bio: 'Specialized in sensory development and play-based learning.', avatar: 'PA' },
          { id: 't2', name: 'Dr. Emily Watson', subject: 'Language & Speech', rating: 4.8, price_per_hour: 35, bio: 'Helping children find their voice through creative storytelling.', avatar: 'EW' },
          { id: 't3', name: 'Coach Marcus', subject: 'Physical Education', rating: 4.7, price_per_hour: 25, bio: 'Building strength and coordination through fun outdoor activities.', avatar: 'CM' }
        ]
        const custom = localStorage.getItem('babycare_custom_teacher_profile')
        if (custom) {
           const cp = JSON.parse(custom)
           setTeachers([cp, ...baseMock])
        } else {
           setTeachers(baseMock)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTeachers()
  }, [])

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleConfirmBooking = async () => {
    if (!selectedTeacher) return
    const teacher = selectedTeacher
    const token = localStorage.getItem('auth_token')
    const userName = localStorage.getItem('userName') || 'Parent'
    const bookingData = {
      teacher_profile_id: parseInt(teacher.id) || 0,
      subject: teacher.subject || 'Standard Session',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      duration_hours: 1,
      address: 'Phnom Penh, KH' // Default
    }

    // 1. Try Backend
    if (token && teacher.id && !teacher.id.toString().startsWith('t')) {
       try {
         const resp = await fetch('http://localhost:8000/api/teachers/bookings', {
           method: 'POST',
           headers: { 
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(bookingData)
         })
         if (resp.ok) {
           setShowConfirm(false)
           setSuccessBooking({ teacherName: teacher.name, subject: teacher.subject })
           setShowSuccess(true)
           return
         }
       } catch (err) {
         console.error("Backend booking failed")
       }
    }

    // 2. Local Fallback
    const newBooking = {
      id: `teach_book_${Date.now()}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      parentName: userName,
      subject: teacher.subject,
      status: 'pending',
      date: bookingData.date,
      time: bookingData.time,
      isBackend: false
    }

    const raw = localStorage.getItem('babycare_teacher_bookings')
    let currentLocal = []
    if (raw) {
      try { currentLocal = JSON.parse(raw) } catch (e) {}
    }
    currentLocal.push(newBooking)
    localStorage.setItem('babycare_teacher_bookings', JSON.stringify(currentLocal))

    setShowConfirm(false)
    setSuccessBooking(newBooking)
    setShowSuccess(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-orange-500" />
            Book Home Tutors
          </h1>
          <p className="text-gray-500 font-medium text-lg">Find certified educators for your child's home learning journey.</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <Input 
            placeholder="Search by name or subject..." 
            className="pl-12 h-12 rounded-2xl bg-white border-gray-100 shadow-sm focus:border-orange-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 rounded-3xl bg-white/50 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTeachers.length > 0 ? filteredTeachers.map((teacher, idx) => (
            <Card key={idx} className="group border-0 shadow-xl bg-white/95 backdrop-blur-md rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="h-40 relative">
                 <img 
                   src="https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=400" 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                   alt="Teacher"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                 <div className="absolute bottom-4 left-6 flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                       Verified Expert
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                       Available Now
                    </div>
                 </div>
              </div>
              
              <CardContent className="p-8 pt-0 space-y-6 relative">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-gray-900 tracking-tight">{teacher.name}</h3>
                       <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">{teacher.subject || 'Early Childhood Specialist'}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl font-black text-sm">
                       <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {teacher.rating || '5.0'}
                    </div>
                 </div>

                 <p className="text-gray-500 font-medium leading-relaxed italic text-sm line-clamp-2">
                    {teacher.bio || "Dedicated to creating a soft learning environment where curiosity leads the way. Specialized in sensory development and play-based learning."}
                 </p>

                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                       <MapPin className="w-4 h-4 text-orange-500" /> Home Visits
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                       <Clock className="w-4 h-4 text-orange-500" /> ${teacher.price_per_hour || 25}/hr
                    </div>
                 </div>

                 <div className="flex gap-3 pt-4">
                    <Button 
                       className="flex-1 bg-slate-900 hover:bg-black text-white rounded-2xl h-14 font-black shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
                       onClick={() => { setSelectedTeacher(teacher); setShowConfirm(true); }}
                     >
                        Book Profile
                     </Button>
                    <Button 
                      variant="outline" 
                      className="w-14 h-14 rounded-2xl border-gray-100 hover:bg-orange-50 transition-all p-0"
                      asChild
                    >
                       <Link href={`/parent/teacher-chat?teacherId=${teacher.id}`}>
                          <MessageSquare className="w-6 h-6 text-orange-500" />
                       </Link>
                    </Button>
                 </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full py-20 bg-white/50 backdrop-blur-md rounded-[3rem] text-center space-y-4">
               <GraduationCap className="w-20 h-20 text-gray-200 mx-auto" />
               <h3 className="text-2xl font-bold text-gray-400">No teachers found</h3>
               <p className="text-gray-400">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
      {/* Step 1: Confirmation Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
         <DialogContent className="max-w-xl p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl bg-white">
            <div className="bg-pink-100 p-8 flex items-center justify-between border-b-4 border-pink-200">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md">
                     <GraduationCap className="w-8 h-8 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 italic">Booking Details</h3>
                    <p className="text-pink-600 font-bold uppercase tracking-widest text-[10px]">Review your teaching session</p>
                  </div>
               </div>
               <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-200" onClick={() => setShowConfirm(false)}>
                  <X className="w-6 h-6" />
               </Button>
            </div>
            
            <div className="p-10 space-y-8">
               {/* Teacher Profile Section */}
               <div className="flex gap-6 items-start pb-8 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border-4 border-white shadow-xl">
                     <img 
                        src="https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=200" 
                        className="w-full h-full object-cover"
                        alt="Profile"
                     />
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <h4 className="text-2xl font-black text-slate-900">{selectedTeacher?.name}</h4>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg font-black text-xs">
                           <Star className="w-3 h-3 fill-amber-500" /> {selectedTeacher?.rating || '5.0'}
                        </div>
                     </div>
                     <p className="text-sm font-bold text-pink-500 uppercase tracking-wider">{selectedTeacher?.subject}</p>
                     <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 italic font-medium">"{selectedTeacher?.bio || "Dedicated to creating a soft learning environment..."}"</p>
                  </div>
               </div>

               {/* Schedule Details */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Date</p>
                     <div className="flex items-center gap-2 font-bold text-slate-700">
                        <Calendar className="w-4 h-4 text-pink-500" /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                     </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Time</p>
                     <div className="flex items-center gap-2 font-bold text-slate-700">
                        <Clock className="w-4 h-4 text-pink-500" /> 10:00 AM (Default)
                     </div>
                  </div>
               </div>

               <Button 
                onClick={handleConfirmBooking}
                className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95"
               >
                  Confirm & Send Request
               </Button>
            </div>
         </DialogContent>
      </Dialog>
      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
         <DialogContent className="max-w-md p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl bg-white animate-in zoom-in-95 duration-500">
            <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
               <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20 border-4 border-white/20 scale-110">
                     <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black italic">Booking Confirmed!</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pure Education Journey</p>
                  </div>
               </div>
            </div>
            <div className="p-10 space-y-8 bg-white/50 backdrop-blur-xl">
               <Card className="border-0 bg-pink-50/50 rounded-[2rem] p-6 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6 text-pink-500" />
                     </div>
                     <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tutor</p>
                        <p className="text-lg font-black text-slate-900">{successBooking?.teacherName}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                        <GraduationCap className="w-6 h-6 text-purple-500" />
                     </div>
                     <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Subject</p>
                        <p className="text-sm font-bold text-slate-700">{successBooking?.subject || 'Early Childhood Learning'}</p>
                     </div>
                  </div>
               </Card>
               
               <div className="space-y-3">
                  <Button className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-slate-100 group transition-all" asChild>
                     <Link href="/parent/dashboard">
                        Go to Dashboard <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </Button>
                  <Button variant="ghost" className="w-full h-12 rounded-2xl font-black text-slate-400 hover:text-slate-900" onClick={() => setShowSuccess(false)}>
                     Book Another One
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  )
}
