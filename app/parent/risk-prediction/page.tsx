'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Activity, AlertTriangle, CheckCircle2, FlaskConical, TrendingUp } from 'lucide-react'

export default function RiskPredictionPage() {
  const [formData, setFormData] = useState({
    age: 28,
    weight: 65,
    bloodPressureSys: 120,
    bloodPressureDia: 80,
    bloodSugar: 90
  })

  const [prediction, setPrediction] = useState<{ riskLevel: string, score: number, message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePredict = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Backend unreachable')
      
      const data = await response.json()
      setPrediction({
        riskLevel: data.riskLevel,
        score: data.score,
        message: data.message
      })
    } catch (error) {
      console.warn('Python backend not detected, using local prediction engine:', error)
      // Fallback local logic
      let score = 20
      if (formData.bloodPressureSys > 140 || formData.bloodPressureDia > 90) score += 40
      if (formData.bloodSugar > 140) score += 30
      if (formData.age > 35) score += 10
      
      let riskLevel = 'Low Risk'
      let message = 'Your metrics look great! Keep up the good work and maintain a healthy lifestyle.'
      
      if (score > 60) {
        riskLevel = 'High Risk'
        message = 'Please consult your doctor immediately. Your vital signs indicate potential complications.'
      } else if (score > 30) {
        riskLevel = 'Moderate Risk'
        message = 'Your vitals are slightly elevated. Monitor your stress and diet, and mention this at your next visit.'
      }
      setPrediction({ riskLevel, score, message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center mb-2">
          <FlaskConical className="w-8 h-8 mr-3 text-indigo-500" />
          Health Risk Prediction
        </h1>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-gray-600 font-medium">Advanced analysis of your vital signs.</p>
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Python AI-Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
             <CardTitle className="text-xl">Input Metrics</CardTitle>
             <CardDescription>Enter your latest readings for analysis.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700 font-semibold">Age (years)</Label>
              <Input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="rounded-xl h-11 focus-visible:ring-indigo-400"
              />
            </div>
             <div className="space-y-2">
              <Label className="font-semibold text-gray-700 font-semibold">Weight (kg)</Label>
              <Input 
                type="number" 
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                className="rounded-xl h-11 focus-visible:ring-indigo-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 font-semibold text-xs">Systolic BP (mmHg)</Label>
                <Input 
                  type="number" 
                  value={formData.bloodPressureSys}
                  onChange={(e) => setFormData({...formData, bloodPressureSys: parseInt(e.target.value)})}
                  className="rounded-xl h-11 focus-visible:ring-indigo-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 font-semibold text-xs">Diastolic BP (mmHg)</Label>
                <Input 
                  type="number" 
                  value={formData.bloodPressureDia}
                  onChange={(e) => setFormData({...formData, bloodPressureDia: parseInt(e.target.value)})}
                  className="rounded-xl h-11 focus-visible:ring-indigo-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700 font-semibold">Blood Sugar (mg/dL)</Label>
              <Input 
                type="number" 
                value={formData.bloodSugar}
                onChange={(e) => setFormData({...formData, bloodSugar: parseInt(e.target.value)})}
                className="rounded-xl h-11 focus-visible:ring-indigo-400"
              />
            </div>
          </CardContent>
          <CardFooter className="p-6 bg-gray-50 border-t border-gray-100">
             <Button 
               className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 shadow-md font-bold text-lg"
               onClick={handlePredict}
               disabled={isLoading}
             >
               {isLoading ? 'Analyzing...' : 'Analyze Risk'}
             </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-white rounded-3xl overflow-hidden h-full">
            <CardHeader className="border-b border-indigo-100 bg-white/50">
               <CardTitle className="text-xl flex items-center">
                 <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                 Prediction Results
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
              {!prediction ? (
                <div className="text-gray-400 flex flex-col items-center">
                  <Activity className="w-16 h-16 mb-4 opacity-20" />
                  <p>Enter your metrics and click Analyze to see your risk prediction.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-500 w-full">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                    prediction.riskLevel === 'Low Risk' ? 'bg-green-100 text-green-500' : 
                    prediction.riskLevel === 'Moderate Risk' ? 'bg-orange-100 text-orange-500' : 'bg-red-100 text-red-500'
                  }`}>
                    {prediction.riskLevel === 'Low Risk' ? <CheckCircle2 className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
                  </div>
                  
                  <div>
                    <h3 className={`text-2xl font-bold ${
                      prediction.riskLevel === 'Low Risk' ? 'text-green-600' : 
                      prediction.riskLevel === 'Moderate Risk' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {prediction.riskLevel}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Risk Score Index: {prediction.score}/100</p>
                  </div>

                  <Progress 
                    value={prediction.score} 
                    className={`h-3 w-full bg-gray-100 ${
                      prediction.riskLevel === 'Low Risk' ? '[&>div]:bg-green-500' : 
                      prediction.riskLevel === 'Moderate Risk' ? '[&>div]:bg-orange-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                  
                  <div className="bg-white p-4 rounded-2xl border border-indigo-50 text-left shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">{prediction.message}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
