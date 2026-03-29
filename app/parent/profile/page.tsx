'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UserCircle, Camera, Save, Activity, Heart, Edit3, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Parent',
    age: 28,
    weight: 65,
    height: 165,
    dueDate: '2024-05-15'
  })
  
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    const storedPic = localStorage.getItem('userProfilePic')
    if (storedName) {
      setProfile(prev => ({ ...prev, name: storedName }))
    }
    if (storedPic) {
      setProfilePic(storedPic)
    }
  }, [])
  
  const handleSave = () => {
    setIsEditing(false)
    localStorage.setItem('userName', profile.name)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfilePic(base64String)
        localStorage.setItem('userProfilePic', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center mb-2">
          <UserCircle className="w-8 h-8 mr-3 text-pink-500" />
          My Profile
        </h1>
        <p className="text-gray-600 font-medium">Manage your personal information and health metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden text-center flex flex-col items-center justify-center p-6 h-fit">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-100 mb-4 bg-pink-50 flex items-center justify-center relative">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-20 h-20 text-pink-300" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <Camera className="w-8 h-8 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-pink-600 font-semibold mb-6">Expecting Mother</p>
          
          <div className="w-full bg-pink-50 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Due Date</span>
               <span className="font-semibold text-gray-900">{profile.dueDate}</span>
            </div>
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
          </div>
        </Card>

        <Card className="md:col-span-2 border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 pb-4">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your health metrics accurately.</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-full text-pink-600 border-pink-200 hover:bg-pink-50">
                <Edit3 className="w-4 h-4 mr-2" /> Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                <Input 
                  id="name" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                  className="rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-pink-400 disabled:opacity-100 disabled:bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-700 font-semibold">Age</Label>
                <div className="relative">
                  <Input 
                    id="age" 
                    type="number"
                    value={profile.age} 
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                    disabled={!isEditing}
                    className="rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-pink-400 disabled:opacity-100 disabled:bg-gray-100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">yrs</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-gray-700 font-semibold flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-pink-500" /> Weight
                </Label>
                <div className="relative">
                  <Input 
                    id="weight" 
                    type="number"
                    value={profile.weight} 
                    onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value)})}
                    disabled={!isEditing}
                    className="rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-pink-400 disabled:opacity-100 disabled:bg-gray-100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-gray-700 font-semibold">Height</Label>
                 <div className="relative">
                  <Input 
                    id="height" 
                    type="number"
                    value={profile.height} 
                    onChange={(e) => setProfile({...profile, height: parseInt(e.target.value)})}
                    disabled={!isEditing}
                    className="rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-pink-400 disabled:opacity-100 disabled:bg-gray-100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="dueDate" className="text-gray-700 font-semibold">Estimated Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={profile.dueDate} 
                  onChange={(e) => setProfile({...profile, dueDate: e.target.value})}
                  disabled={!isEditing}
                  className="rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-pink-400 disabled:opacity-100 disabled:bg-gray-100"
                />
              </div>
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="bg-gray-50 border-t border-gray-100 p-6 flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-full">Cancel</Button>
              <Button onClick={handleSave} className="rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-md">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
