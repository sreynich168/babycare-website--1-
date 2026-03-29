'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserCircle, Camera, Save, Star, MapPin, Award, Facebook, Instagram, Linkedin, Youtube, CheckCircle2 } from 'lucide-react'

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState({
    id: `doc_${Date.now()}`,
    name: 'Dr. Emily Chen',
    specialty: 'Obstetrician & Gynecologist',
    age: 42,
    experience: 15,
    nationality: 'American',
    bio: 'Dedicated obstetrician holding over 15 years of experience in managing high-risk pregnancies and offering compassionate prenatal care.',
    location: 'New York',
    clinicAddress: '123 Health Ave, Medical District, NY',
    instagram: '@dremilychen',
    facebook: 'Emily Chen MD',
    linkedin: 'emilychenmd',
    youtube: 'EmilyChenHealth',
    rating: 4.9,
    reviews: 128,
    price: 50,
    avatar: 'EC',
    resume: ''
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const resp = await fetch('http://localhost:8000/api/doctors/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (resp.ok) {
          const data = await resp.json()
          setProfile({
            id: data.id.toString(),
            name: data.name,
            specialty: data.specialty || '',
            age: 42, // backend doesn't have age yet
            experience: data.experience || 0,
            nationality: data.nationality || '',
            bio: data.bio || '',
            location: data.location || '',
            clinicAddress: data.clinic_address || '',
            instagram: data.instagram || '',
            facebook: data.facebook || '',
            linkedin: data.linkedin || '',
            youtube: data.youtube || '',
            rating: data.rating || 5.0,
            reviews: data.review_count || 0,
            price: data.price || 50,
            avatar: data.avatar_base64 || data.name.substring(0,2).toUpperCase(),
            resume: data.resume_base64 || ''
          })
        }
      } catch (e) {
        console.error("Failed to load profile", e)
      }
    }
    fetchProfile()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large (max 5MB)")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large (max 5MB)")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, resume: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsEditing(false)
    try {
      const token = localStorage.getItem('auth_token')
      const payload = {
        specialty: profile.specialty,
        experience: profile.experience,
        bio: profile.bio,
        location: profile.location,
        clinic_address: profile.clinicAddress,
        nationality: profile.nationality,
        price_per_consultation: profile.price,
        instagram: profile.instagram,
        facebook: profile.facebook,
        linkedin: profile.linkedin,
        youtube: profile.youtube,
        avatar_base64: profile.avatar.startsWith('data:') ? profile.avatar : null,
        resume_base64: profile.resume.startsWith('data:') ? profile.resume : null
      }
      const resp = await fetch('http://localhost:8000/api/doctors/me', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      }
    } catch (e) {
      console.error("Failed to save profile", e)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center mb-2">
          <UserCircle className="w-8 h-8 mr-3 text-blue-500" />
          Doctor Profile
        </h1>
        <p className="text-slate-500 font-medium">Manage how patients see you on the platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card Preview */}
        <Card className="lg:col-span-1 border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden text-center flex flex-col items-center p-8 sticky top-24">
          <div className="relative group cursor-pointer w-40 h-40 mb-6 mx-auto">
            <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-blue-100 bg-blue-50 flex items-center justify-center shadow-inner relative">
              {profile.avatar && profile.avatar.startsWith('data:image') ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : profile.avatar && profile.avatar.length <= 2 ? (
                <span className="text-5xl font-bold text-blue-400">{profile.avatar}</span>
              ) : (
                <UserCircle className="w-24 h-24 text-blue-300" />
              )}
            </div>
            <label htmlFor="avatar-upload" className={`absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
               <Camera className="w-8 h-8 text-white" />
               <input type="file" id="avatar-upload" accept="image/*" className="hidden" disabled={!isEditing} onChange={handleImageUpload} />
            </label>
            <div className="absolute -bottom-3 -right-3 bg-white p-1 rounded-full shadow-lg">
               <CheckCircle2 className="w-8 h-8 text-blue-500 fill-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
          <p className="text-blue-600 font-bold tracking-wide mt-1 uppercase text-xs">{profile.specialty}</p>
          
          <div className="flex items-center gap-1 mt-4 mb-6 bg-orange-50 px-4 py-2 rounded-full">
            <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="font-bold text-orange-700 text-lg">{profile.rating}</span>
            <span className="text-orange-400 font-medium ml-1">({profile.reviews} reviews)</span>
          </div>
          
          <div className="w-full grid grid-cols-2 gap-4 text-left border-t border-slate-100 pt-6">
             <div>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center"><Award className="w-3 h-3 mr-1" /> Experience</p>
               <p className="font-bold text-slate-800">{profile.experience} Years</p>
             </div>
             <div>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center"><MapPin className="w-3 h-3 mr-1" /> Nationality</p>
               <p className="font-bold text-slate-800">{profile.nationality}</p>
             </div>
          </div>

          <div className="w-full flex justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
             {profile.instagram && <Instagram className="w-5 h-5 text-slate-400 hover:text-pink-600 cursor-pointer transition-colors" />}
             {profile.facebook && <Facebook className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />}
             {profile.linkedin && <Linkedin className="w-5 h-5 text-slate-400 hover:text-blue-700 cursor-pointer transition-colors" />}
             {profile.youtube && <Youtube className="w-5 h-5 text-slate-400 hover:text-red-600 cursor-pointer transition-colors" />}
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 border-0 shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 pb-4">
            <div>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Keep your information up to date for patients.</CardDescription>
            </div>
             {!isEditing ? (
              <div className="flex gap-2 items-center">
                 {savedSuccess && <span className="text-sm text-emerald-500 font-bold flex items-center mr-2 animate-in fade-in slide-in-from-right-2"><CheckCircle2 className="w-4 h-4 mr-1"/> Saved</span>}
                 <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-full text-blue-600 border-blue-200 hover:bg-blue-50">
                    Edit Profile
                 </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                 <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="rounded-full text-slate-500 hover:bg-slate-100">Cancel</Button>
                 <Button size="sm" onClick={handleSave} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                   <Save className="w-4 h-4 mr-2" /> Save to Network
                 </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">Full Name</Label>
                <Input 
                  id="name" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                  className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 disabled:opacity-100 disabled:bg-slate-100 disabled:text-slate-600 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-slate-700 font-semibold">Specialty</Label>
                <Input 
                  id="specialty" 
                  value={profile.specialty} 
                  onChange={(e) => setProfile({...profile, specialty: e.target.value})}
                  disabled={!isEditing}
                  className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 disabled:opacity-100 disabled:bg-slate-100 disabled:text-slate-600 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-slate-700 font-semibold">Nationality</Label>
                <Select disabled={!isEditing} value={profile.nationality} onValueChange={(val) => setProfile({...profile, nationality: val})}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-400 h-12">
                    <SelectValue placeholder="Select Nationality" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="Afghan">Afghan</SelectItem>
                    <SelectItem value="Albanian">Albanian</SelectItem>
                    <SelectItem value="Algerian">Algerian</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="Argentinian">Argentinian</SelectItem>
                    <SelectItem value="Armenian">Armenian</SelectItem>
                    <SelectItem value="Australian">Australian</SelectItem>
                    <SelectItem value="Austrian">Austrian</SelectItem>
                    <SelectItem value="Azerbaijani">Azerbaijani</SelectItem>
                    <SelectItem value="Bangladeshi">Bangladeshi</SelectItem>
                    <SelectItem value="Belgian">Belgian</SelectItem>
                    <SelectItem value="Bolivian">Bolivian</SelectItem>
                    <SelectItem value="Brazilian">Brazilian</SelectItem>
                    <SelectItem value="British">British</SelectItem>
                    <SelectItem value="Bulgarian">Bulgarian</SelectItem>
                    <SelectItem value="Cambodian">Cambodian</SelectItem>
                    <SelectItem value="Canadian">Canadian</SelectItem>
                    <SelectItem value="Chilean">Chilean</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Colombian">Colombian</SelectItem>
                    <SelectItem value="Croatian">Croatian</SelectItem>
                    <SelectItem value="Cuban">Cuban</SelectItem>
                    <SelectItem value="Czech">Czech</SelectItem>
                    <SelectItem value="Danish">Danish</SelectItem>
                    <SelectItem value="Dutch">Dutch</SelectItem>
                    <SelectItem value="Egyptian">Egyptian</SelectItem>
                    <SelectItem value="Ethiopian">Ethiopian</SelectItem>
                    <SelectItem value="Filipino">Filipino</SelectItem>
                    <SelectItem value="Finnish">Finnish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Georgian">Georgian</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Ghanaian">Ghanaian</SelectItem>
                    <SelectItem value="Greek">Greek</SelectItem>
                    <SelectItem value="Guatemalan">Guatemalan</SelectItem>
                    <SelectItem value="Hungarian">Hungarian</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="Indonesian">Indonesian</SelectItem>
                    <SelectItem value="Iranian">Iranian</SelectItem>
                    <SelectItem value="Iraqi">Iraqi</SelectItem>
                    <SelectItem value="Irish">Irish</SelectItem>
                    <SelectItem value="Israeli">Israeli</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Jamaican">Jamaican</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Jordanian">Jordanian</SelectItem>
                    <SelectItem value="Kazakh">Kazakh</SelectItem>
                    <SelectItem value="Kenyan">Kenyan</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                    <SelectItem value="Kuwaiti">Kuwaiti</SelectItem>
                    <SelectItem value="Lao">Lao</SelectItem>
                    <SelectItem value="Lebanese">Lebanese</SelectItem>
                    <SelectItem value="Libyan">Libyan</SelectItem>
                    <SelectItem value="Malaysian">Malaysian</SelectItem>
                    <SelectItem value="Mexican">Mexican</SelectItem>
                    <SelectItem value="Moroccan">Moroccan</SelectItem>
                    <SelectItem value="Mozambican">Mozambican</SelectItem>
                    <SelectItem value="Myanmar">Myanmar</SelectItem>
                    <SelectItem value="Nepali">Nepali</SelectItem>
                    <SelectItem value="New Zealander">New Zealander</SelectItem>
                    <SelectItem value="Nigerian">Nigerian</SelectItem>
                    <SelectItem value="Norwegian">Norwegian</SelectItem>
                    <SelectItem value="Pakistani">Pakistani</SelectItem>
                    <SelectItem value="Peruvian">Peruvian</SelectItem>
                    <SelectItem value="Polish">Polish</SelectItem>
                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                    <SelectItem value="Romanian">Romanian</SelectItem>
                    <SelectItem value="Russian">Russian</SelectItem>
                    <SelectItem value="Saudi Arabian">Saudi Arabian</SelectItem>
                    <SelectItem value="Serbian">Serbian</SelectItem>
                    <SelectItem value="Singaporean">Singaporean</SelectItem>
                    <SelectItem value="South African">South African</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="Sri Lankan">Sri Lankan</SelectItem>
                    <SelectItem value="Swedish">Swedish</SelectItem>
                    <SelectItem value="Swiss">Swiss</SelectItem>
                    <SelectItem value="Syrian">Syrian</SelectItem>
                    <SelectItem value="Taiwanese">Taiwanese</SelectItem>
                    <SelectItem value="Thai">Thai</SelectItem>
                    <SelectItem value="Tunisian">Tunisian</SelectItem>
                    <SelectItem value="Turkish">Turkish</SelectItem>
                    <SelectItem value="Ukrainian">Ukrainian</SelectItem>
                    <SelectItem value="Emirati">Emirati (UAE)</SelectItem>
                    <SelectItem value="Ugandan">Ugandan</SelectItem>
                    <SelectItem value="Venezuelan">Venezuelan</SelectItem>
                    <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                    <SelectItem value="Yemeni">Yemeni</SelectItem>
                    <SelectItem value="Zambian">Zambian</SelectItem>
                    <SelectItem value="Zimbabwean">Zimbabwean</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-slate-700 font-semibold">Age</Label>
                <Input 
                  id="age" 
                  type="number"
                  value={profile.age} 
                  onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                  disabled={!isEditing}
                  className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 disabled:opacity-100 disabled:bg-slate-100 disabled:text-slate-600 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-slate-700 font-semibold flex items-center">
                   Experience (Years)
                </Label>
                <Input 
                  id="experience" 
                  type="number"
                  value={profile.experience} 
                  onChange={(e) => setProfile({...profile, experience: parseInt(e.target.value)})}
                  disabled={!isEditing}
                  className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 disabled:opacity-100 disabled:bg-slate-100 disabled:text-slate-600 h-12"
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clinic" className="text-slate-700 font-semibold">Clinic/Hospital Address</Label>
                <Input 
                  id="clinic" 
                  value={profile.clinicAddress} 
                  onChange={(e) => setProfile({...profile, clinicAddress: e.target.value})}
                  disabled={!isEditing}
                  className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 disabled:opacity-100 disabled:bg-slate-100 disabled:text-slate-600 h-12"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio" className="text-slate-700 font-semibold">Professional Bio</Label>
                <Textarea 
                  id="bio" 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  disabled={!isEditing}
                  className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 disabled:opacity-100 disabled:bg-slate-100 disabled:text-slate-600 min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="resume" className="text-slate-700 font-semibold">Resume (PDF or Image)</Label>
                <Input 
                  id="resume" 
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleResumeUpload}
                  disabled={!isEditing}
                  className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 disabled:opacity-100 disabled:bg-slate-100 disabled:text-slate-600 h-12"
                />
                {profile.resume && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Resume Uploaded
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-6">Social Media Links</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <Label htmlFor="ig" className="text-slate-700 font-semibold flex items-center text-xs">
                     <Instagram className="w-4 h-4 mr-1 text-pink-600" /> Instagram Handle
                  </Label>
                  <Input 
                    id="ig" 
                    value={profile.instagram} 
                    onChange={(e) => setProfile({...profile, instagram: e.target.value})}
                    disabled={!isEditing}
                    className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 h-10"
                  />
                 </div>
                 <div className="space-y-2">
                  <Label htmlFor="fb" className="text-slate-700 font-semibold flex items-center text-xs">
                     <Facebook className="w-4 h-4 mr-1 text-blue-600" /> Facebook Page
                  </Label>
                  <Input 
                    id="fb" 
                    value={profile.facebook} 
                    onChange={(e) => setProfile({...profile, facebook: e.target.value})}
                    disabled={!isEditing}
                    className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 h-10"
                  />
                 </div>
                 <div className="space-y-2">
                  <Label htmlFor="li" className="text-slate-700 font-semibold flex items-center text-xs">
                     <Linkedin className="w-4 h-4 mr-1 text-blue-800" /> LinkedIn Profile
                  </Label>
                  <Input 
                    id="li" 
                    value={profile.linkedin} 
                    onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                    disabled={!isEditing}
                    className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 h-10"
                  />
                 </div>
                 <div className="space-y-2">
                  <Label htmlFor="yt" className="text-slate-700 font-semibold flex items-center text-xs">
                     <Youtube className="w-4 h-4 mr-1 text-red-600" /> YouTube Channel
                  </Label>
                  <Input 
                    id="yt" 
                    value={profile.youtube} 
                    onChange={(e) => setProfile({...profile, youtube: e.target.value})}
                    disabled={!isEditing}
                    className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-400 h-10"
                  />
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
