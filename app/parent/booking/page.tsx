'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, User, Star, ArrowRight, ArrowLeft, FileText } from 'lucide-react'

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  location: string;
  rating: number;
  price: number;
  avatar: string;
  resume?: string;
}

const mockDoctors: Doctor[] = [
  { id: 'doc_1', name: 'Dr. Sarah Chen', specialty: 'Pediatrician', clinic: 'City Care Hospital', location: 'Phnom Penh', rating: 4.8, price: 50, avatar: 'SC' },
  { id: 'doc_2', name: 'Dr. Emily Davis', specialty: 'Obstetrician', clinic: 'Sunrise Maternity', location: 'Siem Reap', rating: 4.9, price: 60, avatar: 'ED' },
  { id: 'doc_3', name: 'Dr. Michael Lee', specialty: 'General Practitioner', clinic: 'Hope Family Practice', location: 'Phnom Penh', rating: 4.5, price: 40, avatar: 'ML' },
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [doctors, setDoctors] = useState(mockDoctors)
  
  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>('')
  const [locationDetails, setLocationDetails] = useState({
    homeNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: ''
  })

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const resp = await fetch('http://localhost:8000/api/doctors')
        if (resp.ok) {
          const data = await resp.json()
          if (data.length > 0) {
            const apiDoctors = data.map((d: any) => ({
              id: d.id.toString(),
              name: d.name,
              specialty: d.specialty || 'General Practitioner',
              clinic: d.clinic_address || 'Virtual Clinic',
              location: d.location || 'Online',
              rating: d.rating || 5.0,
              price: d.price || 50,
              avatar: d.avatar_base64 || d.name.substring(0,2).toUpperCase(),
              resume: d.resume_base64 || ''
            }))
            setDoctors(apiDoctors)
            return
          }
        }
      } catch (err) {
        console.error("Using mock doctors as fallback", err)
      }
    }
    fetchDoctors()
  }, [])

  const handleConfirm = async () => {
    const selectedDoc = doctors.find(d => d.id === selectedDoctorId)
    
    // For mock doctors
    if (selectedDoctorId?.startsWith('doc_')) {
      const newRequest = {
        id: `req_${Date.now()}`,
        doctorId: selectedDoctorId,
        doctorName: selectedDoc?.name,
        patientName: localStorage.getItem('userName') || 'Parent',
        date: date?.toISOString(),
        time,
        locationDetails,
        status: 'pending',
        price: selectedDoc?.price || 50,
        timestamp: new Date().toISOString()
      }
      const networkRaw = localStorage.getItem('babycare_doctor_network')
      let network = []
      if (networkRaw) {
        try { network = JSON.parse(networkRaw) } catch (e) {}
      }
      network.push(newRequest)
      localStorage.setItem('babycare_doctor_network', JSON.stringify(network))
      setStep(4)
      return
    }

    // For backend doctors
    const payload = {
      doctor_profile_id: parseInt(selectedDoctorId || '0'),
      date: date?.toISOString() || new Date().toISOString(),
      time,
      home_number: locationDetails.homeNumber,
      address: locationDetails.address,
      city: locationDetails.city,
      state: locationDetails.state,
      country: locationDetails.country,
      phone: locationDetails.phone,
      notes: ''
    }

    try {
      const token = localStorage.getItem('auth_token')
      const resp = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        setStep(4)
      } else {
        alert("Failed to create booking securely.")
      }
    } catch (e) {
      alert("Error connecting to server for booking.")
    }
  }

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500 mt-20">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Booking Request Sent!</h1>
        <p className="text-lg text-gray-600">Your appointment request has been securely sent. The doctor will review and confirm it shortly.</p>
        <Button onClick={() => setStep(1)} variant="outline" className="mt-8 rounded-full h-12 px-8 font-bold border-gray-200">Book Another Visit</Button>
      </div>
    )
  }

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId)

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center mb-2">
          <CalendarIcon className="w-8 h-8 mr-3 text-pink-500" />
          Book an Appointment
        </h1>
        <p className="text-gray-600 font-medium">
          {step === 1 && "Select a trusted doctor in your area."}
          {step === 2 && `Schedule your visit with ${selectedDoctor?.name}.`}
          {step === 3 && "Provide your exact location details."}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-pink-500' : 'bg-gray-100'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-8 duration-300">
          {doctors.map(doc => (
            <Card key={doc.id} className={`border-2 cursor-pointer transition-all hover:shadow-xl ${selectedDoctorId === doc.id ? 'border-pink-500 shadow-pink-500/10' : 'border-transparent shadow-md'} rounded-3xl overflow-hidden`} onClick={() => setSelectedDoctorId(doc.id)}>
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-sm">
                  {doc.avatar && doc.avatar.startsWith('data:image') && <AvatarImage src={doc.avatar} alt={doc.name} className="object-cover" />}
                  <AvatarFallback className="bg-pink-100 text-pink-600 text-2xl font-bold">{doc.avatar && doc.avatar.startsWith('data:image') ? doc.name.substring(0, 2).toUpperCase() : doc.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                  <p className="text-pink-600 font-medium text-sm">{doc.specialty}</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-orange-500 font-bold bg-orange-50 w-max mx-auto px-3 py-1 rounded-full text-sm">
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" /> {doc.rating}
                </div>
                <div className="text-sm text-gray-500 flex flex-col items-center gap-1">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {doc.location}</span>
                  <span className="font-bold text-gray-900">${doc.price} / consultation</span>
                </div>
                {doc.resume && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50" onClick={(e) => e.stopPropagation()}>
                        <FileText className="w-4 h-4 mr-2" /> View Resume
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
                      <DialogHeader className="p-4 border-b">
                        <DialogTitle>{doc.name}'s Resume</DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
                        {doc.resume.startsWith('data:application/pdf') ? (
                          <iframe src={doc.resume} className="w-full h-full border-0 rounded-md bg-white" />
                        ) : (
                          <img src={doc.resume} alt="Resume" className="max-w-full max-h-full object-contain bg-white rounded-md shadow-sm" />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button className={`w-full rounded-xl ${selectedDoctorId === doc.id ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {selectedDoctorId === doc.id ? 'Selected' : 'Choose Doctor'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-8 duration-300">
           <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="bg-pink-50/50 border-b border-pink-100">
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="rounded-xl border shadow-sm pointer-events-auto bg-white p-3"
              />
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="bg-pink-50/50 border-b border-pink-100">
              <CardTitle>Select Time</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Label className="font-semibold text-gray-700 flex items-center mb-4">
                <Clock className="w-4 h-4 mr-2 text-pink-500" />
                Available Slots
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'].map(t => (
                  <Button 
                    key={t}
                    variant={time === t ? 'default' : 'outline'}
                    className={`h-12 rounded-xl border-gray-200 ${time === t ? 'bg-pink-500 hover:bg-pink-600 shadow-md' : 'hover:border-pink-300 hover:text-pink-600'}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 3 && (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden animate-in slide-in-from-right-8 duration-300">
          <CardHeader className="bg-pink-50/50 border-b border-pink-100">
            <CardTitle>Location & Contact Details</CardTitle>
            <CardDescription>Where should the doctor visit?</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">Home/Apartment Number *</Label>
                <Input value={locationDetails.homeNumber} onChange={e => setLocationDetails({...locationDetails, homeNumber: e.target.value})} placeholder="e.g. Apt 4B, House 12" className="h-12 rounded-xl bg-gray-50 focus-visible:ring-pink-400" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">Phone Number *</Label>
                <Input value={locationDetails.phone} onChange={e => setLocationDetails({...locationDetails, phone: e.target.value})} placeholder="+855 12 345 678" className="h-12 rounded-xl bg-gray-50 focus-visible:ring-pink-400" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="font-bold text-gray-700">Street Address *</Label>
                <Input value={locationDetails.address} onChange={e => setLocationDetails({...locationDetails, address: e.target.value})} placeholder="Street name and details" className="h-12 rounded-xl bg-gray-50 focus-visible:ring-pink-400" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">City *</Label>
                <Input value={locationDetails.city} onChange={e => setLocationDetails({...locationDetails, city: e.target.value})} placeholder="Phnom Penh" className="h-12 rounded-xl bg-gray-50 focus-visible:ring-pink-400" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">State/Province</Label>
                <Input value={locationDetails.state} onChange={e => setLocationDetails({...locationDetails, state: e.target.value})} placeholder="e.g. Kandal" className="h-12 rounded-xl bg-gray-50 focus-visible:ring-pink-400" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">Country *</Label>
                <Input value={locationDetails.country} onChange={e => setLocationDetails({...locationDetails, country: e.target.value})} placeholder="Cambodia" className="h-12 rounded-xl bg-gray-50 focus-visible:ring-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Footer */}
      {step < 4 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-lg border border-gray-100 mt-8 backdrop-blur-md">
          <Button 
            variant="ghost" 
            className="rounded-xl h-12 px-6 text-gray-500 font-bold hover:bg-gray-100"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {step < 3 ? (
            <Button 
              className="rounded-xl h-12 px-8 bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-md shadow-pink-500/20"
              onClick={() => setStep(step + 1)}
              disabled={(step === 1 && !selectedDoctorId) || (step === 2 && !time)}
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              className="rounded-xl h-12 px-8 bg-green-500 hover:bg-green-600 text-white font-bold shadow-md shadow-green-500/20"
              onClick={handleConfirm}
              disabled={!locationDetails.address || !locationDetails.city || !locationDetails.phone || !locationDetails.homeNumber}
            >
              Confirm Booking <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
