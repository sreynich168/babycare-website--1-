'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, User, Mail, Lock, Phone, Stethoscope, GraduationCap, ShoppingBag, Sparkles, ArrowDown, ChevronRight, BookOpen, Clock, HeartPulse, UserCircle, X, Instagram, Facebook, Linkedin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

const signupSchema = z.object({
  role: z.enum(['customer', 'doctor', 'teacher']),
  username: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(8, { message: 'Valid phone required' }),
  password: z.string().min(6, { message: 'Password must be 6+ chars' }),
  experience: z.string().optional(),
}).refine(data => {
  if (data.role !== 'customer' && (!data.experience || parseInt(data.experience) < 0)) {
    return false;
  }
  return true;
}, {
  message: "Professional experience is required",
  path: ["experience"]
});

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

const BLOG_POSTS = [
  {
    title: "Premium Baby Shop Essentials",
    description: "Discover why 50K families trust our shop for organic cotton and safe toys. Quality you can feel for your little one.",
    image: "/blog-shop.png",
    date: "Sep 20, 2026",
    readTime: "4 min read",
    tag: "Shopping",
    content: "Our curated selection of baby essentials focuses on three pillars: Safety, Sustainability, and Softness. From hand-picked organic onesies to non-toxic wooden toys, every product we feature has been tested by our community of mothers and experts. Discover the difference of pure materials today."
  },
  {
    title: "Why Hire a Private Teacher?",
    description: "Individualized home education helps your child reach milestones faster. Meet our qualified expert tutors for your home.",
    image: "/blog-teacher.png",
    date: "Sep 18, 2026",
    readTime: "6 min read",
    tag: "Education",
    content: "Home-based early learning provides a pressure-free environment for toddlers to explore their curiosity. Our certified teachers specialize in Montessori and play-based methods that adapt to your child's personality and pace. Start building a stronger foundation of intelligence and emotional growth from year one."
  },
  {
    title: "Instant Doctor Consultations",
    description: "Get professional medical advice from the comfort of your home. No more waiting in lines or late-night hospital visits.",
    image: "/blog-doctor.png",
    date: "Sep 15, 2026",
    readTime: "5 min read",
    tag: "Healthcare",
    content: "When your little one is unwell, every minute matters. Our Tele-Doctor service connects you with certified pediatricians in under 10 minutes. Real-time video calls and prescription support ensure your baby gets the best care immediately, without the stress of a clinical atmosphere."
  }
]

export default function LandingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login')
  const [role, setRole] = useState<'customer' | 'doctor' | 'teacher'>('customer')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'customer', username: '', email: '', phone: '', password: '', experience: '' }
  })

  const destinationMap: Record<string, string> = {
    'doctor': '/doctor',
    'teacher': '/teacher',
    'patient': '/parent'
  }

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const resp = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!resp.ok) {
        let errorMsg = 'Access Denied'
        try {
          const errorData = await resp.json()
          errorMsg = errorData.detail || errorMsg
        } catch (e) {
          errorMsg = `Network Error (${resp.status})`
        }
        throw new Error(errorMsg)
      }
      
      const result = await resp.json()
      localStorage.setItem('auth_token', result.token)
      localStorage.setItem('userName', result.user.name)
      localStorage.setItem('userEmail', result.user.email)
      localStorage.setItem('userRole', result.user.role)
      
      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${result.user.name}.`,
      })
      router.push(destinationMap[result.user.role] || '/parent')
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSignup = async (data: SignupForm) => {
    setIsLoading(true)
    try {
      const payload = {
        name: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role === 'customer' ? 'patient' : data.role,
        experience: data.experience ? parseInt(data.experience) : null
      }
      
      const resp = await fetch('http://127.0.0.1:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!resp.ok) {
        let errorMsg = 'Could not create account'
        try {
          const errorData = await resp.json()
          errorMsg = errorData.detail || errorMsg
        } catch (e) {
          errorMsg = `Server unavailable`
        }
        throw new Error(errorMsg)
      }
      
      const result = await resp.json()
      localStorage.setItem('auth_token', result.token)
      localStorage.setItem('userName', result.user.name)
      localStorage.setItem('userEmail', result.user.email)
      localStorage.setItem('userRole', result.user.role)
      
      toast({
        title: "Account Ready!",
        description: `Welcome to the BabyCare family, ${result.user.name}!`,
      })
      router.push(destinationMap[result.user.role] || '/parent')
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: err.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 selection:bg-pink-200 font-sans">
      {/* ── CLEAN FANTASTIC NAVIGATION ── */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-pink-50/60 backdrop-blur-3xl border-b border-pink-200/30 h-24">
        <div className="max-w-7xl mx-auto px-10 h-full flex justify-between items-center">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 flex items-center justify-center shadow-[0_15px_40px_-5px_rgba(244,114,182,0.4)] group-hover:scale-110 transition-all duration-700 animate-float ring-4 ring-white/50">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-800 tracking-[-0.05em] leading-none">BabyCare</span>
              <span className="text-[11px] font-black text-pink-500 uppercase tracking-[0.4em] mt-1 opacity-80">Evolution</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                <a href="#" className="hover:text-pink-500 transition-colors" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
                <a href="#blog" className="hover:text-pink-500 transition-colors">About Us</a>
                <Dialog>
                   <DialogTrigger asChild>
                      <button className="hover:text-pink-500 transition-colors uppercase tracking-[0.2em] font-black">Contact</button>
                   </DialogTrigger>
                   <DialogContent className="max-w-xl p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl bg-white">
                      <div className="bg-slate-950 p-10 text-white space-y-4">
                         <h3 className="text-3xl font-black italic">Connect <span className="text-pink-500">Purely</span></h3>
                         <p className="text-slate-400 text-sm font-medium">We're always here for your family's journey.</p>
                      </div>
                      <div className="p-10 grid grid-cols-2 gap-6">
                         {[
                            { icon: <Instagram className="w-5 h-5" />, name: 'BabyCare', label: 'Instagram' },
                            { icon: <Facebook className="w-5 h-5" />, name: 'BabyCare', label: 'Facebook' },
                            { icon: <Linkedin className="w-5 h-5" />, name: 'BabyCare', label: 'LinkedIn' },
                            { icon: <Send className="w-5 h-5" />, name: 'BabyCare', label: 'Telegram' },
                            { icon: <Phone className="w-5 h-5 text-pink-500" />, name: '+855 (0) 123 4567', label: 'Phone' },
                            { icon: <Mail className="w-5 h-5 text-pink-500" />, name: 'hello@babycare.com', label: 'Email' }
                         ].map((social, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-pink-50 p-4 rounded-2xl transition-all">
                               <div className="w-10 h-10 rounded-xl bg-pink-100/50 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                                  {social.icon}
                               </div>
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{social.label}</p>
                                  <p className="text-xs font-bold text-slate-700">{social.name}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </DialogContent>
                </Dialog>
             </div>
             <Button className="bg-slate-900 hover:bg-black text-white rounded-2xl px-10 h-14 font-black shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 translate-y-0" onClick={() => { setActiveTab('signup');  document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Join Journey
             </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* ── HERO SECTION ── */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          <div 
             className="absolute inset-0 bg-cover bg-center scale-105"
             style={{ backgroundImage: "url('/hero-bg.png')" }} 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/95 via-pink-50/40 to-pink-100/60 backdrop-blur-[2px] z-10" />
          
          {/* Floating Abstract Shapes */}
          <div className="absolute top-[15%] left-[-15%] w-[800px] h-[800px] bg-pink-100/30 rounded-full blur-[160px] animate-pulse z-10" />
          <div className="absolute bottom-[15%] right-[-15%] w-[600px] h-[600px] bg-rose-200/20 rounded-full blur-[160px] animate-pulse z-10" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center w-full relative z-30 pt-28">
             {/* Left Content */}
             <div className="text-center lg:text-left space-y-10 animate-in fade-in slide-in-from-left-20 duration-1000">
                <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-pink-100/50 shadow-[0_10px_40px_rgba(255,182,193,0.15)] text-pink-500 text-[12px] font-black uppercase tracking-[0.3em]">
                   <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" /> Defined by Purest Feelings
                </div>
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-[5rem] font-black text-slate-900 leading-[1] tracking-tighter">
                     Always close to <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600">your baby.</span>
                  </h1>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-sm">
                     A premium experience designed for modern families. Connect with certified doctors, expert tutors, and find motherhood essentials in one safe space.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                         <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-pink-50 flex items-center justify-center overflow-hidden shadow-lg">
                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                         </div>
                      ))}
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-pink-500 flex items-center justify-center text-white text-[10px] font-black shadow-lg">50k+</div>
                   </div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Loved by <span className="text-pink-500">global families</span></p>
                </div>
             </div>

             {/* Right: Highly Visible Refined Auth Card */}
             <div id="auth-card" className="flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300">
                <div className="relative w-full max-w-[400px]">
                   <div className="mb-6 text-center group">
                      <p className="text-2xl font-black text-slate-900 tracking-tight drop-shadow-sm animate-float">
                         Hello, welcome to <span className="text-pink-500">BabyCare</span>
                      </p>
                      <div className="w-16 h-1 bg-pink-500 mx-auto mt-2 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                   </div>
                   <div className="absolute -inset-4 bg-gradient-to-br from-pink-200/50 to-rose-200/50 blur-2xl rounded-[3rem] -z-10" />
                   <Card className="w-full border-2 border-pink-300 shadow-[0_40px_80px_-20px_rgba(255,182,193,0.3)] rounded-[2.5rem] overflow-hidden bg-pink-200/95 backdrop-blur-xl ring-1 ring-white/40 p-6 lg:p-8">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex flex-col gap-5 mb-6">
                           <div className="text-center space-y-1">
                              <h2 className="text-2xl font-black italic text-purple-700 tracking-tight">
                                 {activeTab === 'login' ? 'LogIn' : 'SignUp'}
                              </h2>
                              <p className="text-[9px] text-slate-600 font-black italic uppercase tracking-widest leading-none">Experience pure care.</p>
                           </div>
                           <TabsList className="grid w-full grid-cols-2 p-1 bg-pink-300/40 rounded-xl border border-pink-300/30 h-12">
                             <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-lg font-black italic text-[9px] uppercase tracking-widest transition-all duration-700 text-slate-500 h-full">
                               LogIn
                             </TabsTrigger>
                             <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-lg font-black italic text-[9px] uppercase tracking-widest transition-all duration-700 text-slate-500 h-full">
                               SignUp
                             </TabsTrigger>
                           </TabsList>
                        </div>

                        {/* Login Form UI */}
                        <TabsContent value="login" className="space-y-3 mt-0 outline-none">
                          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                            <div className="space-y-1">
                              <Label className="text-slate-700 font-bold italic text-[9px] uppercase tracking-[0.2em] ml-4">Email Address</Label>
                              <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-pink-100 group-focus-within:bg-purple-700 transition-all duration-500">
                                  <Mail className="h-3.5 w-3.5 text-pink-400 group-focus-within:text-white transition-colors" />
                                </div>
                                <Input type="email" {...loginForm.register('email')} className="pl-14 rounded-xl h-12 bg-white border border-pink-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-700 transition-all font-bold italic text-slate-900 text-sm placeholder:text-slate-400" placeholder="your@email.com"/>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label className="text-slate-700 font-bold italic text-[9px] uppercase tracking-[0.2em] ml-4">Security Key</Label>
                              <div className="relative group">
                                 <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-pink-100 group-focus-within:bg-purple-700 transition-all duration-500">
                                   <Lock className="h-3.5 w-3.5 text-pink-400 group-focus-within:text-white transition-colors" />
                                 </div>
                                 <Input type="password" {...loginForm.register('password')} className="pl-14 rounded-xl h-12 bg-white border border-pink-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-700 transition-all font-bold italic text-slate-900 text-sm placeholder:text-slate-400" placeholder="••••••••"/>
                              </div>
                            </div>

                            <div className="flex justify-between items-center px-4">
                               <a href="#" className="text-[10px] font-black italic text-purple-700 hover:text-purple-800 uppercase tracking-widest underline underline-offset-4 decoration-purple-200">Forgot?</a>
                               <span className="text-[9px] text-slate-500 font-black italic">🔒 Secure</span>
                            </div>

                            <Button disabled={isLoading} className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-13 text-base font-black italic shadow-xl shadow-slate-200 transition-all hover:scale-[1.01] active:scale-95 group overflow-hidden">
                              {isLoading ? (
                                 <span>Processing...</span>
                              ) : (
                                 <span className="flex items-center gap-2">
                                    LogIn <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                 </span>
                              )}
                            </Button>
                          </form>
                        </TabsContent>

                        {/* Signup Form UI */}
                        <TabsContent value="signup" className="space-y-3 mt-0 outline-none max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                          <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                            <div className="space-y-1">
                              <Label className="text-slate-700 font-bold italic text-[9px] uppercase tracking-[0.3em] ml-4 text-center block">Authentication Tier</Label>
                              <RadioGroup value={role} onValueChange={(v: any) => { setRole(v); signupForm.setValue('role', v); }} className="grid grid-cols-3 gap-3">
                                 {['customer', 'doctor', 'teacher'].map((r) => (
                                   <div key={r} className="flex-1">
                                      <RadioGroupItem value={r} id={`r-${r}`} className="sr-only peer" />
                                      <Label htmlFor={`r-${r}`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-pink-100 bg-pink-100/10 peer-data-[state=checked]:border-purple-700 peer-data-[state=checked]:bg-white peer-data-[state=checked]:shadow-md transition-all duration-500 text-center cursor-pointer hover:bg-white group/tier">
                                         <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center shadow-sm group-hover/tier:scale-110 transition-transform">
                                            {r === 'customer' && <User className="h-4 w-4 text-pink-500" />}
                                            {r === 'doctor' && <Stethoscope className="h-4 w-4 text-blue-500" />}
                                            {r === 'teacher' && <GraduationCap className="h-4 w-4 text-emerald-500" />}
                                         </div>
                                         <span className="text-[8px] font-black italic uppercase text-slate-500 peer-data-[state=checked]:text-purple-700">{r === 'customer' ? 'Parent' : r}</span>
                                      </Label>
                                   </div>
                                 ))}
                              </RadioGroup>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-[9px] font-bold italic text-slate-700 uppercase tracking-[0.2em] ml-4">Full Identity</Label>
                                <Input {...signupForm.register('username')} className="rounded-xl h-11 bg-white border border-pink-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-700 text-sm font-bold italic text-slate-900 placeholder:text-slate-400" placeholder="Your Name"/>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[9px] font-bold italic text-slate-700 uppercase tracking-[0.2em] ml-4">Phone Direct</Label>
                                <Input {...signupForm.register('phone')} className="rounded-xl h-11 bg-white border border-pink-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-700 text-sm font-bold italic text-slate-900 placeholder:text-slate-400" placeholder="+855..."/>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-[9px] font-bold italic text-slate-700 uppercase tracking-[0.2em] ml-4">Email</Label>
                              <Input type="email" {...signupForm.register('email')} className="rounded-xl h-11 bg-white border border-pink-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-700 text-sm font-bold italic text-slate-900 placeholder:text-slate-400" placeholder="hello@future.com"/>
                            </div>

                            {role !== 'customer' && (
                               <div className="p-4 bg-gradient-to-br from-pink-100 to-white rounded-xl border border-pink-200 space-y-3 shadow-sm">
                                  <Label className="text-[9px] font-bold italic text-purple-700 uppercase tracking-[0.3em] flex items-center gap-2">
                                     <Sparkles className="h-3.5 w-3.5" /> Verified Exp.
                                  </Label>
                                  <div className="relative group">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-300 group-focus-within:text-purple-700 transition-colors" />
                                    <Input type="number" {...signupForm.register('experience')} className="pl-12 rounded-xl h-11 bg-white border border-pink-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-700 text-sm font-black italic text-slate-900" placeholder="Years active" />
                                  </div>
                               </div>
                            )}

                            <div className="space-y-1">
                              <Label className="text-[9px] font-bold italic text-slate-700 uppercase tracking-[0.2em] ml-4">Password</Label>
                              <Input type="password" {...signupForm.register('password')} className="rounded-xl h-11 bg-white border border-pink-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-700 text-sm font-bold italic text-slate-900 placeholder:text-slate-400" placeholder="Min. 8 characters"/>
                            </div>

                            <Button disabled={isLoading} className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-xl h-12 text-base font-black italic shadow-lg shadow-purple-200 transition-all active:scale-95">
                              {isLoading ? 'Registering...' : 'Confirm Registration'}
                            </Button>
                          </form>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="mt-14 pt-8 border-t border-pink-50/50 flex items-center justify-between gap-4">
                         <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.1em] leading-relaxed">Trusted by <br/> 50k Mothers</p>
                         <div className="flex gap-2">
                            <Heart className="w-4 h-4 text-pink-100 fill-pink-100" />
                            <Heart className="w-4 h-4 text-pink-200 fill-pink-200" />
                            <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
                         </div>
                      </div>
                   </Card>
                </div>
             </div>
          </div>
        </section>

        {/* ── BLOG SECTION ── */}
        <section id="blog" className="py-24 px-6 bg-pink-50 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-pink-100/30 to-transparent z-0" />
           <div className="max-w-7xl mx-auto space-y-16 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-[9px] font-black uppercase tracking-[0.2em] border border-pink-100">
                       Journal
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                       Pure Stories, <br />
                       <span className="text-pink-400">Pure Love.</span>
                    </h2>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                 {BLOG_POSTS.map((post, i) => (
                    <Dialog key={i}>
                      <DialogTrigger asChild>
                        <Card className="group border-none shadow-[0_10px_40px_rgba(255,182,193,0.1)] hover:shadow-[0_30px_60px_rgba(255,182,193,0.2)] transition-all duration-700 rounded-[3.5rem] overflow-hidden bg-white cursor-pointer ring-1 ring-pink-50/50">
                           <div className="relative h-72 overflow-hidden">
                              <div className="absolute inset-0 bg-pink-500/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                           </div>
                           <CardContent className="p-10 lg:p-12 space-y-8">
                              <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                 <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-pink-300" /> {post.readTime}</span>
                              </div>
                              <h3 className="text-3xl font-black text-slate-900 leading-[1.1] group-hover:text-pink-500 transition-colors">
                                 {post.title}
                              </h3>
                              <p className="text-lg text-slate-500 font-medium leading-relaxed line-clamp-2">
                                 {post.description}
                              </p>
                           </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-[3.5rem] border-none shadow-2xl bg-white">
                        <div className="relative h-96">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                        </div>
                        <div className="p-12 space-y-8">
                           <DialogTitle className="text-5xl font-black text-slate-900 tracking-tight leading-tight">{post.title}</DialogTitle>
                           <p className="text-xl text-slate-600 font-medium leading-relaxed">{post.content}</p>
                           <div className="pt-10 border-t border-pink-50 flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 rounded-2xl bg-pink-400 flex items-center justify-center shadow-lg shadow-pink-100">
                                    <Heart className="w-7 h-7 text-white fill-white" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-900 uppercase">Expert Guidance</span>
                                 </div>
                              </div>
                              <Button className="bg-slate-900 hover:bg-black text-white rounded-2xl h-14 px-10 font-black">Learn More</Button>
                           </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                 ))}
              </div>
           </div>
        </section>
      </main>

      {/* ── SMALL REFINED FOOTER ── */}
      <footer className="bg-slate-950 py-16 px-10 text-white rounded-t-[4rem] relative overflow-hidden">
         <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px]" />
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center">
                   <Heart className="w-5 h-5 text-white fill-white" />
                 </div>
                 <span className="text-2xl font-black tracking-tighter">BabyCare</span>
               </div>
               <p className="text-slate-400 text-sm italic font-medium leading-relaxed">Parenthood + Technology.</p>
            </div>
            <div className="space-y-4">
               <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-pink-400">Services</h4>
               <ul className="space-y-3 text-sm text-slate-400 font-bold">
                  {['Health Scanner', 'Doctor Chat', 'Essentials', 'Tutors'].map(item => (
                     <li key={item}><a href="#" className="hover:text-white transition-all">{item}</a></li>
                  ))}
               </ul>
            </div>
            <div className="space-y-4">
               <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-pink-400">Trust</h4>
               <ul className="space-y-3 text-sm text-slate-400 font-bold">
                  {['Privacy', 'Safety', 'Terms', 'Experts'].map(item => (
                     <li key={item}><a href="#" className="hover:text-white transition-all">{item}</a></li>
                  ))}
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-pink-400">Contact</h4>
               <div className="relative">
                  <Input className="bg-slate-900/50 border-slate-800 rounded-xl h-12 text-sm pr-12 focus:ring-pink-500" placeholder="Email"/>
                  <Button className="absolute right-1 top-1 bottom-1 bg-white text-slate-950 hover:bg-pink-500 hover:text-white rounded-lg px-3 transition-all"><ChevronRight className="w-4 h-4" /></Button>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-900 text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">© 2026 BabyCare Systems.</p>
         </div>
      </footer>
    </div>
  )
}
