'use client'

import { useState } from 'react'
import { Heart, Baby, MessageCircle, Globe, Download, ChevronRight, Star, Users, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import PregnancyCare from '@/components/pregnancy-care'
import PostpartumCare from '@/components/postpartum-care'
import BabyCareGuide from '@/components/baby-care'
import AIAssistant from '@/components/ai-assistant'
import LanguageSelector from '@/components/language-selector'

export default function BabyCareApp() {
  const [currentSection, setCurrentSection] = useState('home')
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const translations = {
    en: {
      title: "BabyCare",
      subtitle: "Caring for You and Your Baby – Every Step of the Way",
      description: "Your trusted companion through pregnancy, delivery, and beyond. Get personalized care guidance, expert advice, and 24/7 AI support in your preferred language.",
      features: {
        pregnancy: "Pregnancy Care",
        postpartum: "Postpartum Care", 
        baby: "Baby Care Guide",
        ai: "AI Assistant"
      },
      stats: {
        mothers: "Happy Mothers",
        languages: "Languages",
        tips: "Care Tips",
        support: "24/7 Support"
      },
      cta: "Start Your Journey",
      testimonials: "What Mothers Say"
    },
    hi: {
      title: "बेबीकेयर",
      subtitle: "आपकी और आपके बच्चे की देखभाल – हर कदम पर",
      description: "गर्भावस्था, प्रसव और उसके बाद आपका विश्वसनीय साथी। व्यक्तिगत देखभाल मार्गदर्शन, विशेषज्ञ सलाह, और आपकी पसंदीदा भाषा में 24/7 AI सहायता प्राप्त करें।",
      features: {
        pregnancy: "गर्भावस्था देखभाल",
        postpartum: "प्रसवोत्तर देखभाल",
        baby: "शिशु देखभाल गाइड", 
        ai: "AI सहायक"
      },
      stats: {
        mothers: "खुश माताएं",
        languages: "भाषाएं",
        tips: "देखभाल सुझाव",
        support: "24/7 सहायता"
      },
      cta: "अपनी यात्रा शुरू करें",
      testimonials: "माताओं का कहना"
    },
    km: {
      title: "ការថែទាំកុមារ",
      subtitle: "ការថែទាំអ្នក និងកូនរបស់អ្នក – គ្រប់ជំហានទាំងអស់",
      description: "ដៃគូដ៏ទុកចិត្តរបស់អ្នកពេញមួយដំណាក់កាលនៃការមានផ្ទៃពោះ ការសម្រាល និងបន្ទាប់ពីនោះ។ ទទួលបានការណែនាំការថែទាំផ្ទាល់ខ្លួន ដំបូន្មានពីអ្នកជំនាញ និងការគាំទ្រ AI ២៤/៧ ជាភាសាដែលអ្នកចូលចិត្ត។",
      features: {
        pregnancy: "ការថែទាំពេលមានផ្ទៃពោះ",
        postpartum: "ការថែទាំក្រោយសម្រាល",
        baby: "មគ្គុទ្ទេសក៍ការថែទាំកុមារ",
        ai: "ជំនួយការ AI"
      },
      stats: {
        mothers: "ម្តាយដែលសប្បាយចិត្ត",
        languages: "ភាសា",
        tips: "គន្លឹះការថែទាំ", 
        support: "ការគាំទ្រ ២៤/៧"
      },
      cta: "ចាប់ផ្តើមដំណើររបស់អ្នក",
      testimonials: "អ្វីដែលម្តាយនិយាយ"
    }
  }

  const t = translations[currentLanguage as keyof typeof translations]

  const renderSection = () => {
    switch (currentSection) {
      case 'pregnancy':
        return <PregnancyCare language={currentLanguage} />
      case 'postpartum':
        return <PostpartumCare language={currentLanguage} />
      case 'baby':
        return <BabyCareGuide language={currentLanguage} />
      case 'ai':
        return <AIAssistant language={currentLanguage} />
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-pink-100 to-pink-50 py-20">
              <div className="absolute inset-0 bg-[url('/soft-pink-baby-pattern.png')] opacity-5"></div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Badge className="bg-pink-200 text-pink-800 hover:bg-pink-300">
                        <Heart className="w-3 h-3 mr-1" />
                        Trusted by 50,000+ Mothers
                      </Badge>
                      <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                        {t.title}
                        <span className="text-pink-500"> 🌸</span>
                      </h1>
                      <p className="text-xl text-pink-600 font-medium">
                        {t.subtitle}
                      </p>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg" 
                        className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full text-lg"
                        onClick={() => setCurrentSection('pregnancy')}
                      >
                        {t.cta}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3 rounded-full text-lg"
                        onClick={() => setCurrentSection('ai')}
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Talk to AI Helper
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="relative z-10">
                      <img 
                        src="/pregnant-mother-pink.png"
                        alt="Happy mother with baby"
                        className="rounded-3xl shadow-2xl w-full max-w-md mx-auto"
                      />
                    </div>
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-300 rounded-full opacity-40 animate-pulse delay-1000"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-pink-500 mb-2">50K+</div>
                    <div className="text-gray-600">{t.stats.mothers}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-pink-500 mb-2">15+</div>
                    <div className="text-gray-600">{t.stats.languages}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-pink-500 mb-2">1000+</div>
                    <div className="text-gray-600">{t.stats.tips}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-pink-500 mb-2">24/7</div>
                    <div className="text-gray-600">{t.stats.support}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Complete Care Journey
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    From pregnancy to parenthood, we're here to support you every step of the way
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <Card 
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-pink-100 hover:border-pink-300"
                    onClick={() => setCurrentSection('pregnancy')}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                        <Heart className="w-8 h-8 text-pink-500" />
                      </div>
                      <CardTitle className="text-pink-700">{t.features.pregnancy}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        Week-by-week guidance, nutrition charts, safe exercises, and emotional support during pregnancy
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card 
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-pink-100 hover:border-pink-300"
                    onClick={() => setCurrentSection('postpartum')}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                        <Users className="w-8 h-8 text-pink-500" />
                      </div>
                      <CardTitle className="text-pink-700">{t.features.postpartum}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        Recovery support, breastfeeding tips, emotional wellness, and postpartum care guidance
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card 
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-pink-100 hover:border-pink-300"
                    onClick={() => setCurrentSection('baby')}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                        <Baby className="w-8 h-8 text-pink-500" />
                      </div>
                      <CardTitle className="text-pink-700">{t.features.baby}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        Newborn care, feeding guides, sleep schedules, and developmental milestones tracking
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card 
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-pink-100 hover:border-pink-300"
                    onClick={() => setCurrentSection('ai')}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                        <MessageCircle className="w-8 h-8 text-pink-500" />
                      </div>
                      <CardTitle className="text-pink-700">{t.features.ai}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        24/7 AI support for instant answers to your pregnancy and baby care questions
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    {t.testimonials}
                  </h2>
                  <p className="text-xl text-gray-600">
                    Real experiences from mothers around the world
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="border-pink-100">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src="/happy-mother-profile.png"
                          alt="Sarah"
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic">
                        "BabyCare was my lifesaver during pregnancy. The AI assistant answered all my midnight worries, and the multilingual support helped my mother-in-law understand everything too!"
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-pink-100">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src="/smiling-mother-baby.png"
                          alt="Priya"
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">Priya Sharma</h4>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic">
                        "The postpartum care section was incredibly helpful. As a first-time mom, I felt confident knowing I had reliable guidance available 24/7."
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-pink-100">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src="/happy-mother-newborn.png"
                          alt="Maria"
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">Maria Garcia</h4>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic">
                        "The baby care guides are so detailed and easy to follow. My husband and I both learned so much about caring for our newborn!"
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-pink-500 to-pink-400">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="text-xl text-pink-100 mb-8">
                    Join thousands of mothers who trust BabyCare for their pregnancy and parenting journey
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg"
                      className="bg-white text-pink-500 hover:bg-pink-50 px-8 py-3 rounded-full text-lg"
                      onClick={() => setCurrentSection('pregnancy')}
                    >
                      Get Started Now
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-pink-500 px-8 py-3 rounded-full text-lg"
                      onClick={() => setCurrentSection('ai')}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Care Guide
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <Navigation 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        language={currentLanguage}
      />
      
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector 
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
        />
      </div>

      {renderSection()}
    </div>
  )
}
