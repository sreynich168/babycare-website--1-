'use client'

import { Users, Heart, Baby, Shield, Clock, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface PostpartumCareProps {
  language: string
}

export default function PostpartumCare({ language }: PostpartumCareProps) {
  const translations = {
    en: {
      title: "Postpartum Care Guide",
      subtitle: "Supporting your recovery and adjustment to motherhood",
      recovery: "Physical Recovery",
      emotional: "Emotional Wellness",
      breastfeeding: "Breastfeeding",
      selfcare: "Self Care",
      support: "Support System"
    },
    hi: {
      title: "प्रसवोत्तर देखभाल गाइड",
      subtitle: "आपकी रिकवरी और मातृत्व के अनुकूलन में सहायता",
      recovery: "शारीरिक रिकवरी",
      emotional: "भावनात्मक कल्याण",
      breastfeeding: "स्तनपान",
      selfcare: "स्व-देखभाल",
      support: "सहायता प्रणाली"
    },
    km: {
      title: "មគ្គុទ្ទេសក៍ការថែទាំក្រោយសម្រាល",
      subtitle: "គាំទ្រការជាសះស្បើយ និងការសម្របខ្លួនទៅនឹងភាពជាម្តាយ",
      recovery: "ការជាសះស្បើយរាងកាយ",
      emotional: "សុខុមាលភាពផ្លូវចិត្ត",
      breastfeeding: "ការបំបៅដោះ",
      selfcare: "ការថែទាំខ្លួនឯង",
      support: "ប្រព័ន្ធគាំទ្រ"
    }
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <Tabs defaultValue="recovery" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-pink-100">
            <TabsTrigger value="recovery" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              {t.recovery}
            </TabsTrigger>
            <TabsTrigger value="emotional" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" />
              {t.emotional}
            </TabsTrigger>
            <TabsTrigger value="breastfeeding" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Baby className="w-4 h-4 mr-2" />
              {t.breastfeeding}
            </TabsTrigger>
            <TabsTrigger value="selfcare" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              {t.selfcare}
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              {t.support}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recovery" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Physical Healing Timeline</CardTitle>
                  <CardDescription>What to expect in your recovery journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Week 1-2: Immediate Recovery</h4>
                    <Progress value={25} className="mb-2" />
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Vaginal bleeding (lochia) is normal</li>
                      <li>• Rest as much as possible</li>
                      <li>• Take prescribed pain medication</li>
                      <li>• Keep incision clean (C-section)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Week 3-6: Gradual Improvement</h4>
                    <Progress value={60} className="mb-2" />
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Bleeding should decrease</li>
                      <li>• Start gentle walks</li>
                      <li>• Attend 6-week checkup</li>
                      <li>• Begin pelvic floor exercises</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Week 6+: Full Recovery</h4>
                    <Progress value={100} className="mb-2" />
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Cleared for normal activities</li>
                      <li>• Resume exercise gradually</li>
                      <li>• Intimate relations can resume</li>
                      <li>• Consider contraception options</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Warning Signs</CardTitle>
                  <CardDescription>When to contact your healthcare provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="/mother-baby-doctor-consultation.png"
                    alt="Medical consultation"
                    className="rounded-lg w-full mb-4"
                  />
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Call your doctor if you experience:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Heavy bleeding (soaking a pad per hour)</li>
                      <li>• Fever over 100.4°F (38°C)</li>
                      <li>• Severe abdominal pain</li>
                      <li>• Signs of infection at incision site</li>
                      <li>• Difficulty breathing or chest pain</li>
                      <li>• Severe headaches or vision changes</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emotional" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Understanding Baby Blues</CardTitle>
                  <CardDescription>Normal emotional changes after birth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/tired-happy-mother-baby.png"
                    alt="New mother with baby"
                    className="rounded-lg w-full"
                  />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Baby Blues (Days 3-10):</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Mood swings and crying spells</li>
                      <li>• Anxiety and irritability</li>
                      <li>• Feeling overwhelmed</li>
                      <li>• Difficulty sleeping</li>
                      <li>• Usually resolves on its own</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Postpartum Depression</CardTitle>
                  <CardDescription>When to seek professional help</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/mother-counselor-session.png"
                    alt="Counseling session"
                    className="rounded-lg w-full"
                  />
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Seek help if symptoms persist beyond 2 weeks:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Severe mood swings</li>
                      <li>• Loss of appetite</li>
                      <li>• Overwhelming fatigue</li>
                      <li>• Difficulty bonding with baby</li>
                      <li>• Thoughts of harming yourself or baby</li>
                    </ul>
                  </div>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600">
                    Find Support Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="breastfeeding" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Getting Started</CardTitle>
                  <CardDescription>Essential breastfeeding basics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/mother-breastfeeding-guide.png"
                    alt="Breastfeeding"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">Proper Latch:</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-1">
                        <li>• Baby's mouth covers most of areola</li>
                        <li>• Lips flanged outward</li>
                        <li>• No pain during feeding</li>
                        <li>• You can hear swallowing sounds</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Feeding Schedule:</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-1">
                        <li>• 8-12 times per day initially</li>
                        <li>• Every 2-3 hours</li>
                        <li>• Follow baby's hunger cues</li>
                        <li>• Night feedings are normal</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Common Challenges</CardTitle>
                  <CardDescription>Solutions for breastfeeding difficulties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                      <h4 className="font-semibold text-pink-800">Sore Nipples:</h4>
                      <p className="text-sm text-pink-700 mt-1">
                        Check latch, use lanolin cream, air dry after feeding
                      </p>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                      <h4 className="font-semibold text-pink-800">Low Milk Supply:</h4>
                      <p className="text-sm text-pink-700 mt-1">
                        Feed frequently, stay hydrated, get adequate rest
                      </p>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                      <h4 className="font-semibold text-pink-800">Engorgement:</h4>
                      <p className="text-sm text-pink-700 mt-1">
                        Apply warm compress before feeding, cold after feeding
                      </p>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                      <h4 className="font-semibold text-pink-800">Blocked Ducts:</h4>
                      <p className="text-sm text-pink-700 mt-1">
                        Massage gently, feed frequently, apply heat
                      </p>
                    </div>
                  </div>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600">
                    Contact Lactation Consultant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="selfcare" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Rest & Sleep</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/new-mother-resting.png"
                    alt="Rest and sleep"
                    className="rounded-lg w-full"
                  />
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Sleep when baby sleeps</li>
                    <li>• Accept help with household tasks</li>
                    <li>• Take short naps during the day</li>
                    <li>• Create a relaxing bedtime routine</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Nutrition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/healthy-postpartum-nutrition.png"
                    alt="Healthy nutrition"
                    className="rounded-lg w-full"
                  />
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Eat nutrient-dense foods</li>
                    <li>• Stay hydrated (8-10 glasses water)</li>
                    <li>• Continue prenatal vitamins</li>
                    <li>• Prepare easy, healthy snacks</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Gentle Exercise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/postpartum-gentle-exercise.png"
                    alt="Gentle exercise"
                    className="rounded-lg w-full"
                  />
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Start with short walks</li>
                    <li>• Practice deep breathing</li>
                    <li>• Try postnatal yoga</li>
                    <li>• Strengthen pelvic floor muscles</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Building Your Support Network</CardTitle>
                  <CardDescription>You don't have to do this alone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/family-support-network.png"
                    alt="Support network"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">Family & Friends:</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-1">
                        <li>• Ask for specific help (meals, cleaning)</li>
                        <li>• Let others hold baby while you rest</li>
                        <li>• Accept offers of assistance</li>
                        <li>• Communicate your needs clearly</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Professional Support:</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-1">
                        <li>• Postpartum doula services</li>
                        <li>• Lactation consultants</li>
                        <li>• Mental health counselors</li>
                        <li>• Pediatrician and OB/GYN</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Community Resources</CardTitle>
                  <CardDescription>Connect with other new mothers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/mothers-community-support.png"
                    alt="Community support"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-4">
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <h4 className="font-semibold text-pink-800 mb-2">Local Groups:</h4>
                      <ul className="text-sm text-pink-700 space-y-1">
                        <li>• New parent support groups</li>
                        <li>• Breastfeeding support circles</li>
                        <li>• Baby wearing groups</li>
                        <li>• Postpartum fitness classes</li>
                      </ul>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <h4 className="font-semibold text-pink-800 mb-2">Online Communities:</h4>
                      <ul className="text-sm text-pink-700 space-y-1">
                        <li>• Virtual mom groups</li>
                        <li>• Social media support networks</li>
                        <li>• Parenting forums and apps</li>
                        <li>• Video chat playgroups</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Download Section */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
            <Download className="mr-2 h-5 w-5" />
            Download Postpartum Care Guide
          </Button>
        </div>
      </div>
    </div>
  )
}
