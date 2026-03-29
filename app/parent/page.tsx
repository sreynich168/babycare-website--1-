'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, MessageSquare, MapPin, Calendar, Heart, Activity, Star, MessageCircle, ShoppingBag, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

export default function ParentDashboard() {
  const { t } = useLanguage()
  const [userName, setUserName] = useState('Parent')

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
    }
  }, [])

  const quickActions = [
    {
      title: 'Pregnancy Guide',
      description: 'Read tips for every trimester.',
      icon: FileText,
      href: '/parent/documents',
      bgImage: '/pregnant-woman-meditating.png',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'AI Chatbot',
      description: 'Ask our smart assistant.',
      icon: MessageSquare,
      href: '/parent/chatbot',
      bgImage: '/Robot-About-Us.webp',
      bgSize: 'cover',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-100',
    },
    {
      title: 'Book Visit',
      description: 'Schedule a doctor visit.',
      icon: Calendar,
      href: '/parent/booking',
      bgImage: '/pregnant-mom-doctor.png',
      iconColor: 'text-pink-500',
      iconBg: 'bg-pink-100',
    },
    {
      title: 'Nearby Clinics',
      description: 'Find trusted hospitals.',
      icon: MapPin,
      href: '/parent/clinics',
      bgImage: '/nearby-clinics-card.png',
      bgSize: 'cover',
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-100',
    },
    {
      title: 'Baby Shop',
      description: 'Shop baby essentials.',
      icon: ShoppingBag,
      href: '/parent/shop',
      bgImage: '/shop-hero.png',
      bgSize: 'cover',
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-100',
    },
    {
      title: 'Book Teacher',
      description: 'Find home tutors.',
      icon: GraduationCap,
      href: '/parent/teachers',
      bgImage: '/book-teacher.jpg',
      bgSize: 'cover',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50',
    },
    {
      title: 'Doctor Chat',
      description: 'Consult your doctor.',
      icon: MessageCircle,
      href: '/parent/chat',
      bgImage: '/Chat.png',
      bgSize: '80%',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-100',
    },
    {
      title: 'Teacher Chat',
      description: 'Consult your teacher.',
      icon: MessageCircle,
      href: '/parent/teacher-chat',
      bgImage: '/teacher-chat-hero.png',
      bgSize: 'contain',
      iconColor: 'text-indigo-500',
      iconBg: 'bg-indigo-100',
    },
    {
      title: 'Baby Scan',
      description: 'AI-Powered growth scan.',
      icon: Heart,
      href: '/parent/baby-scan',
      bgImage: '/ultrasound-scan.png',
      bgSize: 'cover',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-400 to-rose-400 px-8 py-6 shadow-lg group border border-white/40">
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay opacity-30 transition-opacity group-hover:opacity-50 duration-500" />
        
        {/* Baby Sticker Animation */}
        <div className="absolute top-4 right-4 md:right-10 flex flex-col items-center animate-in slide-in-from-right-[200px] fade-in duration-1000 delay-300 z-20">
           <div className="bg-white text-pink-500 font-extrabold px-3 py-1 rounded-2xl rounded-br-none shadow-md text-sm mb-1 animate-bounce">
              Welcome!
           </div>
           <span className="text-4xl filter drop-shadow hover:scale-110 transition-transform cursor-pointer">👶🏃‍♀️✨</span>
        </div>

        <div className="relative z-10 max-w-xl animate-in fade-in slide-in-from-left-4 duration-700 ease-out">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight text-white drop-shadow-sm flex items-center gap-2">
            Hello, {userName}! <span className="inline-block animate-[bounce_2s_infinite]">👋</span>
          </h1>
          <p className="text-base font-medium text-pink-50 mb-4 leading-relaxed opacity-95">
            Step into your warm, safe space. You are in week 24 of your journey! ✨
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-white text-pink-600 hover:bg-pink-50 hover:scale-105 transition-transform rounded-2xl font-bold px-6 shadow-sm" asChild>
              <Link href="/parent/chatbot">Ask AI</Link>
            </Button>
            <Button variant="outline" className="border-white/60 text-white hover:bg-white/20 hover:border-white rounded-2xl font-bold px-6 bg-transparent" asChild>
              <Link href="/parent/documents">Daily Tips</Link>
            </Button>
          </div>
        </div>
        
        {/* Animated decorative shapes */}
        <Heart className="absolute -right-10 -top-10 w-48 h-48 text-white opacity-10 animate-[pulse_6s_ease-in-out_infinite] rotate-12" />
        <Star className="absolute top-6 right-[40%] w-8 h-8 text-white opacity-30 animate-[ping_4s_infinite]" />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickActions.map((action, index) => (
          <Link href={action.href} key={index} className="block animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
            <Card className="relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 h-56 rounded-3xl overflow-hidden group bg-white/90 backdrop-blur-md">
              {/* Header Image Half */}
              <div className="h-28 w-full overflow-hidden relative">
                <div 
                  className="absolute inset-0 bg-center transition-transform duration-700 group-hover:scale-110" 
                  style={{ backgroundImage: `url(${action.bgImage})`, backgroundSize: action.bgSize || 'cover', backgroundRepeat: 'no-repeat' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90" />
              </div>
              
              {/* Content Half */}
              <div className="px-5 pt-2 pb-5 relative">
                <div className={`absolute -top-8 left-5 w-14 h-14 rounded-2xl ${action.iconBg} ${action.iconColor} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 border-4 border-white`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="pt-8">
                  <h3 className="text-lg font-extrabold text-gray-800 tracking-tight">{action.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-tight mt-1">{action.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Summary */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center text-gray-800">
                  <Activity className="w-6 h-6 mr-2 text-rose-500" />
                  Health Overview
                </CardTitle>
                <CardDescription>Your essential health vitals this week</CardDescription>
              </div>
              <Button variant="ghost" className="text-pink-600 hover:bg-pink-50 hover:text-pink-700" asChild>
                <Link href="/parent/profile">Update</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-rose-50 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500 font-medium mb-1">Weight</p>
                <p className="text-3xl font-bold text-gray-900">65 <span className="text-base font-normal text-gray-500">kg</span></p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500 font-medium mb-1">Blood Pressure</p>
                <p className="text-2xl font-bold text-gray-900">110/70</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500 font-medium mb-1">Heart Rate</p>
                <p className="text-3xl font-bold text-gray-900">80 <span className="text-base font-normal text-gray-500">bpm</span></p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500 font-medium mb-1">Risk Status</p>
                <p className="text-xl font-bold text-emerald-600 mt-2">Low Risk</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-0" variant="outline" asChild>
                 <Link href="/parent/risk-prediction">Check Health Risk Progression</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-white rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center text-gray-800">
              <Calendar className="w-5 h-5 mr-2 text-pink-500" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">Dr. Emily Chen</h4>
                  <p className="text-sm text-gray-500">Prenatal Checkup</p>
                </div>
                <div className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">Tomorrow</div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-3">
                <Calendar className="w-4 h-4 mr-1" /> Wed, Sep 20 • 10:00 AM
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" /> Home Visit
              </div>
            </div>

            <Button className="w-full mt-2 bg-white text-pink-600 hover:bg-pink-50 border border-pink-200" variant="outline" asChild>
              <Link href="/parent/booking">Book New Visit</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
