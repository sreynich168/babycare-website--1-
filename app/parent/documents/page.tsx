'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Baby, HeartPulse, FileText, CheckCircle2, Sparkles, AlertCircle, Apple, Dumbbell } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'

export default function DocumentsPage() {
  const documents = {
    prepregnancy: [
      {
        title: 'Preparing Your Body',
        description: 'Steps to take before conception to ensure a healthy pregnancy.',
        image: '/images/documents/preconception.png',
        icon: <Dumbbell className="w-5 h-5" />,
        content: [
          'Preconception Checkup: Visit your doctor to discuss your medical history, vaccinations, and any medications you are taking.',
          'Folic Acid (400mcg/day): Start taking folic acid at least one month before trying to conceive to prevent neural tube defects.',
          'Maintain a Healthy Weight: Achieving a healthy BMI can improve fertility and reduce pregnancy complications.',
          'Exercise Regularly: Build stamina with moderate exercise like walking, swimming, or cycling.',
          'Stop Smoking & Alcohol: Both can affect fertility and increase risks for the baby. It is best to quit before trying to conceive.'
        ]
      },
      {
        title: 'Nutrition & Vitamins',
        description: 'What to eat and which supplements to take before pregnancy.',
        image: '/images/documents/nutrition.png',
        icon: <Apple className="w-5 h-5" />,
        content: [
          'Iron-Rich Foods: Boost your iron stores with lean meats, beans, and spinach to prepare for increased blood volume.',
          'Calcium for Bones: Ensure adequate calcium intake (1000mg/day) from dairy, fortified plant milks, or almonds.',
          'Prenatal Vitamins: Start a daily prenatal vitamin to fill nutritional gaps.',
          'Healthy Fats: Include Omega-3s from walnuts, chia seeds, or fish like salmon for baby\'s brain development.',
          'Limit Caffeine: Reduce caffeine intake to less than 200mg per day (about one 12oz cup of coffee).'
        ]
      },
      {
        title: 'Foods to Avoid',
        description: 'Crucial safety guide on what to skip for a healthy start.',
        image: '/images/documents/avoid.png',
        icon: <AlertCircle className="w-5 h-5" />,
        content: [
          'Raw & Undercooked Meats: Avoid to prevent toxoplasmosis and other bacterial infections.',
          'Unpasteurized Dairy: Skip soft cheeses like brie or camembert unless labelled "pasteurized".',
          'High-Mercury Fish: Avoid shark, swordfish, and king mackerel; choose low-mercury options like shrimp or salmon.',
          'Raw Seafood & Sushi: Raw fish can contain harmful parasites or bacteria.',
          'Alcohol: There is no safe amount of alcohol during pregnancy or when trying to conceive.'
        ]
      }
    ],
    prenatal: [
      {
        title: 'First Trimester (Weeks 1-13)',
        description: 'Early development and managing common symptoms.',
        image: '/images/documents/preconception.png',
        content: [
          'Early Prenatal Care: Your first appointment is the most important milestone for baby\'s health.',
          'Manage Fatigue: Your body is working hard. Prioritize rest and 8-10 hours of sleep.',
          'Morning Sickness: Eat small, frequent meals and keep dry crackers by your bed.',
          'Hydration: Drink 8-10 glasses of water daily to support amniotic fluid production.',
          'Emotional Wellbeing: Mood swings are normal due to hormones. Seek support if you feel overwhelmed.'
        ]
      },
      {
        title: 'Second Trimester (Weeks 14-27)',
        description: 'The "golden period" of pregnancy and fetal growth.',
        image: '/images/documents/prenatal.png',
        content: [
          'Monitor Growth: Regular BP and weight checks. You may start feeling movement around weeks 18-22.',
          'Wellness Exercise: Maintain fitness with prenatal yoga, walking, or swimming.',
          'Balanced Diet: Continue nutrient-dense foods; baby is developing bones and organs rapidly.',
          'Anultrasound Check: Usually around week 20 to assess baby\'s anatomy and development.',
          'Planning Ahead: Begin discussing birth preferences and start preparing the nursery.'
        ]
      },
      {
        title: 'Managing Morning Sickness',
        description: 'Professional tips to ease nausea and maintain energy.',
        image: '/images/documents/nutrition.png',
        content: [
          'Ginger Relief: Ginger tea or candies can naturally soothe nausea.',
          'Protein Snacks: Eat high-protein snacks like nuts or yogurt before bed to stabilize blood sugar.',
          'Scent Management: Avoid strong cooking smells or perfumes that trigger nausea.',
          'Acupressure: Consider sea-bands or acupressure points on the wrist.',
          'Consult Doctor: If you cannot keep any fluids down, contact your provider immediately.'
        ]
      }
    ],
    during: [
      {
        title: 'Recognizing Labor Signs',
        description: 'Knowing when it is time to head to the hospital.',
        image: '/images/documents/labor.png',
        content: [
          'The 5-1-1 Rule: Contractions 5 mins apart, lasting 1 min, for at least 1 hour.',
          'Water Breaking: A sudden gush or steady trickle of fluid means it\'s time to call.',
          'True vs. Braxton Hicks: True contractions get longer, stronger, and closer together.',
          'Nesting Instinct: A sudden burst of energy to clean or organize often precedes labor.',
          'Call Immediately: If you notice heavy bleeding or a significant decrease in baby\'s movement.'
        ]
      },
      {
        title: 'The Hospital Bag Checklist',
        description: 'Everything you and your baby will need for your stay.',
        image: '/images/documents/labor_prep.png',
        content: [
          'For Mom: Comfortable robe, nursing bras, toiletries, long phone charger, and lip balm.',
          'For Baby: Newborn onesies, receiving blankets, and a properly installed car seat.',
          'Documents: ID, insurance card, and multiple copies of your birth plan.',
          'Comfort Items: Your own pillow, essential oil diffuser, or a calming music playlist.',
          'Post-Delivery: Maternity pads and comfortable, loose-fitting clothes for the trip home.'
        ]
      },
      {
        title: 'Breathing & Relaxation',
        description: 'Techniques to manage pain and stay calm during labor.',
        image: '/images/documents/prenatal_yoga.png',
        content: [
          'Slow Breathing: Deep breaths in through the nose and out through the mouth during contractions.',
          'Visualization: Imagine a peaceful place or the "opening" of your body to stay relaxed.',
          'Partner Support: Counter-pressure on the lower back or gentle massage from your partner.',
          'Movement: Changing positions, swaying, or using a birthing ball can help baby descend.',
          'Mindset: Focus on one contraction at a time. Each one brings you closer to meeting your baby.'
        ]
      }
    ],
    postnatal: [
      {
        title: 'Newborn Care Basics',
        description: 'Essential guide for the first days with your baby.',
        image: '/images/documents/newborn_care.png',
        content: [
          'Safe Sleep: Always place baby on their back on a firm, flat surface without blankets or toys.',
          'Feeding Frequency: Newborns eat 8-12 times in 24 hours. Watch for early hunger cues.',
          'Diaper Health: Expect 6-8 wet diapers daily once feeding is well-established.',
          'Umbilical Care: Keep the stump clean and dry; it typically falls off in 1-3 weeks.',
          'Tummy Time: Start short sessions (3-5 mins) of supervised tummy time while baby is awake.'
        ]
      },
      {
        title: 'Postpartum Mother Recovery',
        description: 'Caring for your physical and mental health after birth.',
        image: '/images/documents/preconception_wellness.png',
        content: [
          'Rest & Sleep: "Sleep when the baby sleeps" is vital for your physical recovery.',
          'Hydration & Fiber: Drink plenty of water and eat fiber-rich foods to help with digestion.',
          'Emotional Health: "Baby blues" are common, but if sadness lasts >2 weeks, consult your doctor.',
          'Physical Care: Use sitz baths and keep any incisions (C-section or tears) clean and dry.',
          'Gentle Movement: Short walks can help prevent blood clots and boost your mood.'
        ]
      },
      {
        title: 'Breastfeeding Success',
        description: 'Mastering the latch and maintaining your supply.',
        image: '/images/documents/healthy_foods.png',
        content: [
          'Deep Latch: Ensure baby takes a large portion of the breast, not just the nipple.',
          'Supply & Demand: The more often you nurse, the more milk your body will produce.',
          'Stay Hydrated: Keep a water bottle nearby every time you sit down to nurse.',
          'Nipple Care: Use lanolin cream or expressed breast milk to soothe any soreness.',
          'Get Support: Contact a lactation consultant early if you have pain or latch concerns.'
        ]
      }
    ]
  }

  const renderDocCards = (docs: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {docs.map((doc, idx) => (
        <Dialog key={idx}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-md rounded-3xl group cursor-pointer hover:-translate-y-2 overflow-hidden h-full flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src={doc.image} 
                  alt={doc.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium">Click to Read Lesson</span>
                </div>
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-pink-500">
                  {doc.icon || <FileText className="w-5 h-5" />}
                  <span className="text-[10px] uppercase tracking-widest font-bold">Health Guide</span>
                </div>
                <CardTitle className="text-xl text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1">{doc.title}</CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2 mt-2">{doc.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-pink-500 text-sm font-bold flex items-center group-hover:gap-2 transition-all">
                  Read Full Lesson <Sparkles className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-xl border-pink-100 rounded-[2rem] overflow-hidden shadow-2xl p-0">
            <div className="relative h-64 w-full">
              <Image src={doc.image} alt={doc.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="bg-pink-500/90 text-white p-2 rounded-xl backdrop-blur-sm">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-pink-600 font-bold tracking-tighter text-sm uppercase">Medical Lesson</span>
                 </div>
                 <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight">{doc.title}</DialogTitle>
              </div>
            </div>
            
            <DialogDescription className="px-8 pt-2 text-gray-600 font-medium text-lg leading-relaxed">
              {doc.description}
            </DialogDescription>

            <ScrollArea className="max-h-[50vh] px-8 pb-8 pt-4">
              <div className="space-y-4 pr-4">
                {doc.content.map((paragraph: string, i: number) => {
                   const [title, ...rest] = paragraph.split(':')
                   const body = rest.join(':')
                   
                   return (
                      <div key={i} className="flex items-start gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100 transition-colors hover:bg-pink-50/30 group">
                        <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 group-hover:border-pink-200 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 mb-0.5">{title}</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
                        </div>
                      </div>
                   )
                })}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-sm font-bold mb-4">
          <Sparkles className="w-4 h-4" /> Comprehensive Care Guides
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start">
          Mother & Baby Care Library
        </h1>
        <p className="text-gray-600 text-lg mt-3 max-w-2xl leading-relaxed">
          Expert-curated lessons covering every milestone from pre-conception to postnatal recovery. All guidelines follow international health standards.
        </p>
      </div>

      <Tabs defaultValue="prepregnancy" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-2 md:grid-cols-4 p-1.5 bg-gray-100/50 backdrop-blur-md rounded-[1.5rem] shadow-inner border border-gray-200 gap-1 h-auto">
          <TabsTrigger value="prepregnancy" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs uppercase tracking-tight">
            <HeartPulse className="w-4 h-4 mr-2" /> Pre-Pregnancy
          </TabsTrigger>
          <TabsTrigger value="prenatal" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs uppercase tracking-tight">
            <BookOpen className="w-4 h-4 mr-2" /> Prenatal
          </TabsTrigger>
          <TabsTrigger value="during" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs uppercase tracking-tight">
            <Baby className="w-4 h-4 mr-2" /> Labor
          </TabsTrigger>
          <TabsTrigger value="postnatal" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all duration-300 flex items-center justify-center font-bold text-xs uppercase tracking-tight">
            <HeartPulse className="w-4 h-4 mr-2" /> Post-Pregnancy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prepregnancy" className="animate-in fade-in slide-in-from-left-4 duration-500">
          {renderDocCards(documents.prepregnancy)}
        </TabsContent>
        <TabsContent value="prenatal" className="animate-in fade-in slide-in-from-left-4 duration-500">
          {renderDocCards(documents.prenatal)}
        </TabsContent>
        <TabsContent value="during" className="animate-in fade-in slide-in-from-left-4 duration-500">
          {renderDocCards(documents.during)}
        </TabsContent>
        <TabsContent value="postnatal" className="animate-in fade-in slide-in-from-left-4 duration-500">
          {renderDocCards(documents.postnatal)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
