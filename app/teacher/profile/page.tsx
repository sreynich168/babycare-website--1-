'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Camera, Mail, Phone, MapPin, Briefcase, Star, ClipboardList, PenTool, Globe, Award, ShieldCheck } from 'lucide-react'

export default function TeacherProfilePage() {
  const [userEmail, setUserEmail] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    subject: '',
    experience: 0,
    bio: '',
    location: '',
    price_per_hour: 30,
    avatar_base64: '',
    resume_base64: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) return
      try {
        const resp = await fetch('http://localhost:8000/api/teachers/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (resp.ok) {
          const data = await resp.json()
          setProfile({
            name: data.name || '',
            subject: data.subject || '',
            experience: data.experience || 0,
            bio: data.bio || '',
            location: data.location || '',
            price_per_hour: data.price_per_hour || 30,
            avatar_base64: data.avatar_base64 || '',
            resume_base64: data.resume_base64 || ''
          })
          setUserEmail(data.email)
        }
      } catch (err) {
        console.error("Failed to load profile", err)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    // 1. Always Save Locally first to ensure responsiveness and reliability
    localStorage.setItem('userName', profile.name)
    localStorage.setItem('babycare_custom_teacher_profile', JSON.stringify({ ...profile, id: 'teacher_custom' }))
    
    const token = localStorage.getItem('auth_token')
    let backendSuccess = false
    
    if (token) {
      try {
        const resp = await fetch('http://localhost:8000/api/teachers/me', {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profile)
        })
        if (resp.ok) {
           backendSuccess = true
        }
      } catch (err) {
        console.warn("Backend sync failed, but local data was saved.")
      }
    }

    setIsEditing(false)
    alert(backendSuccess ? "Teacher Profile updated and synced successfully!" : "Teacher Profile updated locally!")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_base64' | 'resume_base64') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, [field]: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <PenTool className="w-10 h-10 text-emerald-500" />
             Professional Profile
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Manage your academic identity and settings</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
          className={`h-12 px-8 rounded-2xl font-black transition-all ${isEditing ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200'}`}
        >
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-0 shadow-2xl bg-white rounded-[3rem] overflow-hidden group">
              <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 opacity-30 mix-blend-overlay" />
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              </div>
              <CardContent className="p-8 -mt-16 relative z-10 text-center">
                 <div className="relative inline-block group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl shadow-emerald-500/10 transition-transform group-hover:scale-[1.03]">
                       <div className="w-full h-full rounded-[2.2rem] bg-emerald-100 flex items-center justify-center text-emerald-600 overflow-hidden relative border border-emerald-50">
                          {profile.avatar_base64 ? (
                            <img src={profile.avatar_base64} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <GraduationCap className="w-16 h-16 opacity-20 absolute rotate-12" />
                              <span className="text-4xl font-black relative z-10 leading-none">{profile.name.substring(0, 1) || 'T'}</span>
                            </>
                          )}
                       </div>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="icon" className="absolute bottom-1 right-1 bg-white hover:bg-emerald-50 text-emerald-600 rounded-xl shadow-xl w-10 h-10 border border-emerald-50" onClick={() => fileInputRef.current?.click()}>
                        <Camera className="w-5 h-5" />
                      </Button>
                    )}
                 </div>

                 <h2 className="text-2xl font-black text-slate-900 mt-6 tracking-tight">{profile.name || 'Loading...'}</h2>
                 <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mt-1">{profile.subject || 'Expert Educator'}</p>
                 
                 <div className="flex justify-center items-center gap-1.5 mt-6 mb-8 px-4 py-2 bg-amber-50 rounded-2xl w-fit mx-auto shadow-inner border border-amber-100/50">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-black text-amber-600 text-sm">5.0 Rating</span>
                 </div>

                 <div className="grid grid-cols-1 gap-3 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                       <Mail className="w-4 h-4 text-emerald-300" /> {userEmail}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                       <MapPin className="w-4 h-4 text-emerald-300" /> {profile.location || 'Phnom Penh, KH'}
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white overflow-hidden relative">
              <div className="relative z-10">
                 <h4 className="font-black text-xs uppercase tracking-widest opacity-60 mb-2">Professional Resume</h4>
                 <p className="text-xl font-black italic tracking-tight mb-6">Expert Verification ✔</p>
                 <Button 
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={!isEditing}
                    className="w-full flex items-center justify-between gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 group hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-8 h-8 text-emerald-300" />
                      <div className="text-left">
                         <p className="font-black text-sm tracking-tight opacity-90">{profile.resume_base64 ? 'Resume Uploaded' : 'Upload Resume'}</p>
                         <p className="text-[10px] font-bold opacity-60 uppercase">PDF or Image</p>
                      </div>
                    </div>
                    {isEditing && <PenTool className="w-4 h-4 opacity-40" />}
                 </Button>
              </div>
           </Card>
        </div>

        {/* Profile Settings Content */}
        <div className="lg:col-span-2">
           <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-3xl rounded-[3rem] p-10 h-full border border-white/40">
              <CardHeader className="p-0 mb-10">
                 <CardTitle className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                    <Award className="w-7 h-7 text-emerald-500" />
                    Educational Identity
                 </CardTitle>
                 <CardDescription className="text-sm font-black text-slate-400 uppercase tracking-widest mt-2 opacity-60">Manage how parents see your credentials</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 group">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Teaching Display Name</Label>
                       <Input 
                        disabled={!isEditing} 
                        value={profile.name} 
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="h-14 rounded-2xl bg-white/80 border-slate-100 border-2 font-bold focus:border-emerald-400 shadow-sm transition-all" 
                       />
                    </div>
                    <div className="space-y-3 group">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Academic Subject</Label>
                       <Input 
                        disabled={!isEditing} 
                        value={profile.subject} 
                        onChange={e => setProfile({...profile, subject: e.target.value})}
                        className="h-14 rounded-2xl bg-white/80 border-slate-100 border-2 font-bold focus:border-emerald-400 shadow-sm transition-all" 
                       />
                    </div>
                    <div className="space-y-3 group">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Years of Experience</Label>
                       <Input 
                        disabled={!isEditing} 
                        type="number"
                        value={profile.experience} 
                        onChange={e => setProfile({...profile, experience: parseInt(e.target.value) || 0})}
                        className="h-14 rounded-2xl bg-white/80 border-slate-100 border-2 font-bold focus:border-emerald-400 shadow-sm transition-all" 
                       />
                    </div>
                    <div className="space-y-3 group">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Consultation Price ($/hr)</Label>
                       <Input 
                        disabled={!isEditing} 
                        type="number"
                        value={profile.price_per_hour} 
                        onChange={e => setProfile({...profile, price_per_hour: parseFloat(e.target.value) || 0})}
                        className="h-14 rounded-2xl bg-white/80 border-slate-100 border-2 font-bold focus:border-emerald-400 shadow-sm transition-all" 
                       />
                    </div>
                    <div className="space-y-3 group md:col-span-2">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Educational Philosophy (Bio)</Label>
                       <textarea 
                           disabled={!isEditing} 
                           className="w-full min-h-[120px] rounded-[2rem] bg-white/80 border-slate-100 border-2 font-bold focus:border-emerald-400 p-6 shadow-sm transition-all text-slate-600 text-sm leading-relaxed"
                           value={profile.bio}
                           onChange={e => setProfile({...profile, bio: e.target.value})}
                       />
                    </div>
                    <div className="space-y-3 group">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Location Area</Label>
                       <Input 
                        disabled={!isEditing} 
                        value={profile.location} 
                        onChange={e => setProfile({...profile, location: e.target.value})}
                        className="h-14 rounded-2xl bg-white/80 border-slate-100 border-2 font-bold focus:border-emerald-400 shadow-sm transition-all" 
                       />
                    </div>
                    <div className="space-y-3 group">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">Consultation Price ($/hr)</Label>
                       <Input 
                        disabled={!isEditing} 
                        type="number"
                        value={profile.price_per_hour} 
                        onChange={e => setProfile({...profile, price_per_hour: parseFloat(e.target.value)})}
                        className="h-14 rounded-2xl bg-white/80 border-slate-100 border-2 font-bold focus:border-emerald-400 shadow-sm transition-all" 
                       />
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'avatar_base64')} />
      <input type="file" ref={resumeInputRef} className="hidden" accept="image/*,application/pdf" onChange={e => handleFileUpload(e, 'resume_base64')} />
    </div>
  )
}
