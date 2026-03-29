'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Cloud, FileText, Upload, MoreVertical, Search, FileImage } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function MedicalRecordsPage() {
  const [files, setFiles] = useState<any[]>([
    { name: 'Ultrasound_Week20.pdf', date: 'Oct 12, 2023', size: '2.4 MB', type: 'pdf' },
    { name: 'BloodTest_Results.png', date: 'Sep 28, 2023', size: '1.1 MB', type: 'image' },
    { name: 'Doctor_Notes_Visit3.pdf', date: 'Sep 15, 2023', size: '0.8 MB', type: 'pdf' },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('babycare_medical_records')
    if (saved) {
      try {
        setFiles(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      const newFile = {
        name: file.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        dataUrl: ev.target?.result as string
      }
      
      const updatedFiles = [newFile, ...files]
      setFiles(updatedFiles)
      localStorage.setItem('babycare_medical_records', JSON.stringify(updatedFiles))
    }
    reader.readAsDataURL(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = (file: any) => {
    if (file.dataUrl) {
      const a = document.createElement('a')
      a.href = file.dataUrl
      a.download = file.name
      a.click()
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center mb-2">
            <Cloud className="w-8 h-8 mr-3 text-blue-500" />
            Medical Records
          </h1>
          <p className="text-gray-600">Securely synced with Google Drive.</p>
        </div>
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white rounded-full px-6 shadow-md"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,image/*" 
          onChange={handleFileUpload} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search documents by name or date..." 
              className="pl-10 h-12 rounded-2xl bg-white border-blue-100 focus-visible:ring-blue-400"
            />
          </div>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="bg-blue-50/50 border-b border-blue-100">
              <CardTitle className="text-xl">Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {files.map((file, idx) => (
                  <div key={idx} 
                       className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer"
                       onClick={() => handleDownload(file)}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${file.type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                        {file.type === 'pdf' ? <FileText className="w-6 h-6 text-red-500" /> : <FileImage className="w-6 h-6 text-blue-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.date} • {file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-white rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-blue-500" />
                Drive Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={45} className="h-3 bg-blue-100 [&>div]:bg-blue-500" />
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">6.7 GB Used</span>
                <span className="text-gray-500">15 GB Total</span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Your files are privately stored and encrypted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
