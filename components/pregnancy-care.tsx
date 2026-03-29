'use client'

import { useState } from 'react'
import { Heart, Calendar, Apple, Dumbbell, Brain, Download, CheckCircle, AlertCircle, Baby } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface PregnancyCareProps {
  language: string
}

export default function PregnancyCare({ language }: PregnancyCareProps) {
  const [selectedWeek, setSelectedWeek] = useState(20)

  const translations = {
    en: {
      title: "Pregnancy Care Guide",
      subtitle: "Your complete guide through every week of pregnancy",
      weekByWeek: "Week by Week",
      nutrition: "Nutrition",
      exercise: "Exercise",
      wellness: "Wellness",
      checklist: "Checklist",
      currentWeek: "Week",
      babySize: "Baby Size",
      symptoms: "Common Symptoms",
      tips: "Tips for This Week",
      download: "Download Guide"
    },
    hi: {
      title: "गर्भावस्था देखभाल गाइड",
      subtitle: "गर्भावस्था के हर सप्ताह के लिए आपकी संपूर्ण गाइड",
      weekByWeek: "सप्ताह दर सप्ताह",
      nutrition: "पोषण",
      exercise: "व्यायाम",
      wellness: "कल्याण",
      checklist: "चेकलिस्ट",
      currentWeek: "सप्ताह",
      babySize: "बच्चे का आकार",
      symptoms: "सामान्य लक्षण",
      tips: "इस सप्ताह के लिए सुझाव",
      download: "गाइड डाउनलोड करें"
    },
    km: {
      title: "មគ្គុទ្ទេសក៍ការថែទាំពេលមានផ្ទៃពោះ",
      subtitle: "មគ្គុទ្ទេសក៍ពេញលេញរបស់អ្នកពេញមួយសប្តាហ៍នៃការមានផ្ទៃពោះ",
      weekByWeek: "សប្តាហ៍ម្តងៗ",
      nutrition: "អាហារូបត្ថម្ភ",
      exercise: "ការធ្វើលំហាត់ប្រាណ",
      wellness: "សុខុមាលភាព",
      checklist: "បញ្ជីពិនិត្យ",
      currentWeek: "សប្តាហ៍",
      babySize: "ទំហំកូន",
      symptoms: "រោគសញ្ញាទូទៅ",
      tips: "គន្លឹះសម្រាប់សប្តាហ៍នេះ",
      download: "ទាញយកមគ្គុទ្ទេសក៍"
    }
  }

  const t = translations[language as keyof typeof translations]

  const weekData = {
    20: {
      babySize: "Banana (6.5 inches)",
      symptoms: ["Back pain", "Heartburn", "Leg cramps", "Increased appetite"],
      tips: [
        "Start sleeping on your side",
        "Take prenatal vitamins daily",
        "Stay hydrated with 8-10 glasses of water",
        "Schedule your anatomy scan"
      ]
    }
  }

  const nutritionTips = [
    {
      title: "Folic Acid",
      description: "400-800 mcg daily to prevent birth defects",
      foods: ["Leafy greens", "Citrus fruits", "Fortified cereals"]
    },
    {
      title: "Iron",
      description: "27mg daily to prevent anemia",
      foods: ["Lean meat", "Beans", "Spinach", "Tofu"]
    },
    {
      title: "Calcium",
      description: "1000mg daily for baby's bone development",
      foods: ["Dairy products", "Sardines", "Broccoli"]
    }
  ]

  const exercises = [
    {
      name: "Walking",
      duration: "30 minutes daily",
      benefits: "Improves circulation, reduces swelling",
      safety: "Low impact, safe throughout pregnancy"
    },
    {
      name: "Swimming",
      duration: "20-30 minutes",
      benefits: "Full body workout, reduces joint stress",
      safety: "Excellent for all trimesters"
    },
    {
      name: "Prenatal Yoga",
      duration: "45 minutes, 2-3 times/week",
      benefits: "Flexibility, stress relief, better sleep",
      safety: "Avoid hot yoga and deep twists"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <Tabs defaultValue="week-by-week" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-pink-100">
            <TabsTrigger value="week-by-week" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              {t.weekByWeek}
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Apple className="w-4 h-4 mr-2" />
              {t.nutrition}
            </TabsTrigger>
            <TabsTrigger value="exercise" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Dumbbell className="w-4 h-4 mr-2" />
              {t.exercise}
            </TabsTrigger>
            <TabsTrigger value="wellness" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              {t.wellness}
            </TabsTrigger>
            <TabsTrigger value="checklist" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              {t.checklist}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week-by-week" className="space-y-8">
            <Card className="border-pink-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-pink-700">
                      {t.currentWeek} {selectedWeek}
                    </CardTitle>
                    <CardDescription>
                      You're halfway through your pregnancy journey!
                    </CardDescription>
                  </div>
                  <Badge className="bg-pink-500 text-white text-lg px-4 py-2">
                    50% Complete
                  </Badge>
                </div>
                <Progress value={50} className="mt-4" />
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Baby className="w-5 h-5 mr-2 text-pink-500" />
                        {t.babySize}
                      </h3>
                      <p className="text-gray-600">{weekData[20].babySize}</p>
                      <img 
                        src="/20-week-ultrasound.png"
                        alt="Baby development"
                        className="rounded-lg mt-4 w-full max-w-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-pink-500" />
                        {t.symptoms}
                      </h3>
                      <ul className="space-y-2">
                        {weekData[20].symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-pink-500" />
                        {t.tips}
                      </h3>
                      <ul className="space-y-2">
                        {weekData[20].tips.map((tip, index) => (
                          <li key={index} className="flex items-start text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {nutritionTips.map((nutrient, index) => (
                <Card key={index} className="border-pink-200">
                  <CardHeader>
                    <CardTitle className="text-pink-700">{nutrient.title}</CardTitle>
                    <CardDescription>{nutrient.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Best Sources:</h4>
                    <ul className="space-y-1">
                      {nutrient.foods.map((food, foodIndex) => (
                        <li key={foodIndex} className="flex items-center text-sm text-gray-600">
                          <Apple className="w-3 h-3 mr-2 text-pink-400" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exercise" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {exercises.map((exercise, index) => (
                <Card key={index} className="border-pink-200">
                  <CardHeader>
                    <CardTitle className="text-pink-700">{exercise.name}</CardTitle>
                    <CardDescription>{exercise.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Benefits:</h4>
                      <p className="text-sm text-gray-600">{exercise.benefits}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Safety:</h4>
                      <p className="text-sm text-gray-600">{exercise.safety}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Mental Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/pregnant-meditation-wellness.png"
                    alt="Mental wellness"
                    className="rounded-lg w-full"
                  />
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Practice daily meditation (10-15 minutes)</li>
                    <li>• Join pregnancy support groups</li>
                    <li>• Talk to your partner about concerns</li>
                    <li>• Consider prenatal counseling if needed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Sleep & Rest</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/pregnant-sleep-comfort.png"
                    alt="Sleep wellness"
                    className="rounded-lg w-full"
                  />
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Sleep on your left side</li>
                    <li>• Use pregnancy pillows for support</li>
                    <li>• Maintain consistent sleep schedule</li>
                    <li>• Avoid screens 1 hour before bed</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6">
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-700">Pregnancy Checklist</CardTitle>
                <CardDescription>Essential tasks for each trimester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">First Trimester (1-12 weeks)</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Schedule first prenatal visit
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Start prenatal vitamins
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Quit smoking and alcohol
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Research healthcare providers
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">Second Trimester (13-27 weeks)</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Schedule anatomy scan
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Start shopping for baby items
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Consider childbirth classes
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Plan maternity leave
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">Third Trimester (28-40 weeks)</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Pack hospital bag
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Install car seat
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Finalize birth plan
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Prepare nursery
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Section */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
            <Download className="mr-2 h-5 w-5" />
            {t.download}
          </Button>
        </div>
      </div>
    </div>
  )
}
