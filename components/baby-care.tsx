'use client'

import { Baby, Clock, Heart, Thermometer, Calendar, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface BabyCareGuideProps {
  language: string
}

export default function BabyCareGuide({ language }: BabyCareGuideProps) {
  const translations = {
    en: {
      title: "Baby Care Guide",
      subtitle: "Everything you need to know about caring for your newborn",
      feeding: "Feeding",
      sleeping: "Sleep",
      hygiene: "Hygiene",
      development: "Development",
      health: "Health & Safety"
    },
    hi: {
      title: "शिशु देखभाल गाइड",
      subtitle: "अपने नवजात शिशु की देखभाल के बारे में जानने योग्य सब कुछ",
      feeding: "भोजन",
      sleeping: "नींद",
      hygiene: "स्वच्छता",
      development: "विकास",
      health: "स्वास्थ्य और सुरक्षा"
    },
    km: {
      title: "មគ្គុទ្ទេសក៍ការថែទាំកុមារ",
      subtitle: "អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវដឹងអំពីការថែទាំកូនទើបនឹងកើត",
      feeding: "ការចិញ្ចឹម",
      sleeping: "ការគេង",
      hygiene: "អនាម័យ",
      development: "ការអភិវឌ្ឍន៍",
      health: "សុខភាព និងសុវត្ថិភាព"
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
              <Baby className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <Tabs defaultValue="feeding" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-pink-100">
            <TabsTrigger value="feeding" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" />
              {t.feeding}
            </TabsTrigger>
            <TabsTrigger value="sleeping" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              {t.sleeping}
            </TabsTrigger>
            <TabsTrigger value="hygiene" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Baby className="w-4 h-4 mr-2" />
              {t.hygiene}
            </TabsTrigger>
            <TabsTrigger value="development" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              {t.development}
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Thermometer className="w-4 h-4 mr-2" />
              {t.health}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feeding" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Feeding Schedule by Age</CardTitle>
                  <CardDescription>Guidelines for newborn to 12 months</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-pink-300 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-pink-100 text-pink-800">0-2 months</Badge>
                      </div>
                      <h4 className="font-semibold text-gray-800">Newborn Feeding</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• Breastfeed every 2-3 hours (8-12 times/day)</li>
                        <li>• Formula: 2-3 oz every 3-4 hours</li>
                        <li>• Follow baby's hunger cues</li>
                        <li>• Night feedings are essential</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-pink-300 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-pink-100 text-pink-800">2-4 months</Badge>
                      </div>
                      <h4 className="font-semibold text-gray-800">Growing Appetite</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• Breastfeed 6-8 times per day</li>
                        <li>• Formula: 4-5 oz every 3-4 hours</li>
                        <li>• Longer stretches between feeds</li>
                        <li>• Growth spurts may increase appetite</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-pink-300 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-pink-100 text-pink-800">4-6 months</Badge>
                      </div>
                      <h4 className="font-semibold text-gray-800">Introduction to Solids</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• Continue breast/formula feeding</li>
                        <li>• Start with single-grain cereals</li>
                        <li>• Introduce one food at a time</li>
                        <li>• Watch for allergic reactions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Feeding Tips & Techniques</CardTitle>
                  <CardDescription>Making feeding time easier for you and baby</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/baby-feeding-techniques.png"
                    alt="Baby feeding"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-4">
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <h4 className="font-semibold text-pink-800 mb-2">Burping Techniques:</h4>
                      <ul className="text-sm text-pink-700 space-y-1">
                        <li>• Over the shoulder method</li>
                        <li>• Sitting upright on your lap</li>
                        <li>• Face-down across your lap</li>
                        <li>• Burp every 2-3 oz during feeding</li>
                      </ul>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <h4 className="font-semibold text-pink-800 mb-2">Signs of Hunger:</h4>
                      <ul className="text-sm text-pink-700 space-y-1">
                        <li>• Rooting and sucking motions</li>
                        <li>• Putting hands to mouth</li>
                        <li>• Fussiness and restlessness</li>
                        <li>• Crying (late hunger cue)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sleeping" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Safe Sleep Guidelines</CardTitle>
                  <CardDescription>Creating a safe sleep environment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/safe-baby-sleep-environment.png"
                    alt="Safe sleep"
                    className="rounded-lg w-full"
                  />
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Safe Sleep Checklist:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✓ Always place baby on their back</li>
                      <li>✓ Use a firm sleep surface</li>
                      <li>✓ Keep crib bare (no blankets, toys)</li>
                      <li>✓ Room-share without bed-sharing</li>
                      <li>✓ Avoid smoke exposure</li>
                      <li>✓ Breastfeed if possible</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Sleep Patterns by Age</CardTitle>
                  <CardDescription>What to expect as your baby grows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-300 pl-4">
                      <Badge className="bg-blue-100 text-blue-800 mb-2">0-3 months</Badge>
                      <h4 className="font-semibold text-gray-800">Newborn Sleep</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• 14-17 hours total sleep</li>
                        <li>• 2-4 hour sleep stretches</li>
                        <li>• No day/night distinction yet</li>
                        <li>• Frequent night wakings normal</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-blue-300 pl-4">
                      <Badge className="bg-blue-100 text-blue-800 mb-2">3-6 months</Badge>
                      <h4 className="font-semibold text-gray-800">Developing Patterns</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• 12-15 hours total sleep</li>
                        <li>• Longer night sleep stretches</li>
                        <li>• 3-4 naps during the day</li>
                        <li>• Sleep training can begin</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-blue-300 pl-4">
                      <Badge className="bg-blue-100 text-blue-800 mb-2">6-12 months</Badge>
                      <h4 className="font-semibold text-gray-800">More Predictable</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• 11-14 hours total sleep</li>
                        <li>• 6-8 hour night stretches</li>
                        <li>• 2-3 naps per day</li>
                        <li>• Consistent bedtime routine</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hygiene" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Diaper Changing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/baby-diaper-changing-guide.png"
                    alt="Diaper changing"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Step-by-Step:</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. Gather all supplies first</li>
                      <li>2. Clean from front to back</li>
                      <li>3. Let skin air dry briefly</li>
                      <li>4. Apply diaper cream if needed</li>
                      <li>5. Secure new diaper snugly</li>
                    </ol>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Tip:</strong> Newborns need 8-12 diaper changes per day
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Bathing Baby</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/gentle-baby-bathing.png"
                    alt="Baby bathing"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Bath Basics:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 2-3 times per week initially</li>
                      <li>• Water temperature: 98-100°F</li>
                      <li>• Support head and neck always</li>
                      <li>• Use mild, fragrance-free soap</li>
                      <li>• Keep bath time short (5-10 min)</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Safety:</strong> Never leave baby alone, even for a second
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Nail & Hair Care</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/baby-nail-hair-care.png"
                    alt="Baby grooming"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Nail Trimming:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Use baby nail scissors</li>
                        <li>• Trim when baby is sleeping</li>
                        <li>• Cut straight across</li>
                        <li>• File rough edges</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Hair Care:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Gentle baby shampoo</li>
                        <li>• Soft brush for cradle cap</li>
                        <li>• Pat dry, don't rub</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Developmental Milestones</CardTitle>
                  <CardDescription>Key achievements to watch for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-300 pl-4">
                      <Badge className="bg-purple-100 text-purple-800 mb-2">0-3 months</Badge>
                      <h4 className="font-semibold text-gray-800">Early Development</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• Lifts head briefly during tummy time</li>
                        <li>• Follows objects with eyes</li>
                        <li>• Smiles responsively</li>
                        <li>• Makes cooing sounds</li>
                        <li>• Recognizes parent's voice</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-purple-300 pl-4">
                      <Badge className="bg-purple-100 text-purple-800 mb-2">3-6 months</Badge>
                      <h4 className="font-semibold text-gray-800">Growing Stronger</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• Rolls from tummy to back</li>
                        <li>• Sits with support</li>
                        <li>• Reaches for and grasps toys</li>
                        <li>• Laughs and squeals</li>
                        <li>• Shows interest in faces</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-purple-300 pl-4">
                      <Badge className="bg-purple-100 text-purple-800 mb-2">6-12 months</Badge>
                      <h4 className="font-semibold text-gray-800">Mobile & Social</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        <li>• Sits without support</li>
                        <li>• Crawls or scoots</li>
                        <li>• Says first words</li>
                        <li>• Plays peek-a-boo</li>
                        <li>• Shows stranger anxiety</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Stimulating Development</CardTitle>
                  <CardDescription>Activities to support your baby's growth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/baby-development-activities.png"
                    alt="Baby development activities"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Tummy Time:</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Start with 3-5 minutes, 2-3 times daily</li>
                        <li>• Gradually increase duration</li>
                        <li>• Always supervise closely</li>
                        <li>• Use toys to encourage lifting head</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Sensory Play:</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• High-contrast books and toys</li>
                        <li>• Different textures to explore</li>
                        <li>• Music and singing</li>
                        <li>• Gentle massage</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">When to Call the Doctor</CardTitle>
                  <CardDescription>Warning signs that need immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Emergency Signs:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Fever over 100.4°F (38°C) in newborns</li>
                      <li>• Difficulty breathing or blue lips</li>
                      <li>• Excessive vomiting or diarrhea</li>
                      <li>• Signs of dehydration</li>
                      <li>• Unusual lethargy or irritability</li>
                      <li>• Rash with fever</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Call Within 24 Hours:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Persistent crying for hours</li>
                      <li>• Changes in eating or sleeping patterns</li>
                      <li>• Unusual fussiness or behavior</li>
                      <li>• Concerns about development</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader>
                  <CardTitle className="text-pink-700">Vaccination Schedule</CardTitle>
                  <CardDescription>Keeping your baby protected</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src="/baby-health-checkup.png"
                    alt="Baby vaccination"
                    className="rounded-lg w-full"
                  />
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-300 pl-4">
                      <Badge className="bg-green-100 text-green-800 mb-1">Birth</Badge>
                      <p className="text-sm text-gray-600">Hepatitis B (1st dose)</p>
                    </div>
                    <div className="border-l-4 border-green-300 pl-4">
                      <Badge className="bg-green-100 text-green-800 mb-1">2 months</Badge>
                      <p className="text-sm text-gray-600">DTaP, IPV, Hib, PCV13, RV</p>
                    </div>
                    <div className="border-l-4 border-green-300 pl-4">
                      <Badge className="bg-green-100 text-green-800 mb-1">4 months</Badge>
                      <p className="text-sm text-gray-600">DTaP, IPV, Hib, PCV13, RV</p>
                    </div>
                    <div className="border-l-4 border-green-300 pl-4">
                      <Badge className="bg-green-100 text-green-800 mb-1">6 months</Badge>
                      <p className="text-sm text-gray-600">DTaP, IPV, Hib, PCV13, RV, Hepatitis B</p>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Important:</strong> Follow your pediatrician's recommended schedule
                    </p>
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
            Download Baby Care Guide
          </Button>
        </div>
      </div>
    </div>
  )
}
