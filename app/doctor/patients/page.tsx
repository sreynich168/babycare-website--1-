'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Check, X, Calendar, Clock, MapPin, Activity, User, Phone } from 'lucide-react'

export default function DoctorPatientPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDoctorName, setCurrentDoctorName] = useState('')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    const userName = localStorage.getItem('userName') || 'Doctor'
    setCurrentDoctorName(userName)

    const token = localStorage.getItem('auth_token')
    let allRequests = []

    // 1. Load from localStorage (Mock/Fallbacks)
    const raw = localStorage.getItem('babycare_doctor_network')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        allRequests = [...parsed]
      } catch (e) {}
    }

    // 2. Load from Backend if token exists
    if (token) {
      try {
        const resp = await fetch('http://localhost:8000/api/bookings/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (resp.ok) {
          const backendBookings = await resp.json()
          const mapped = backendBookings.map((b: any) => ({
            id: b.id.toString(),
            patientName: b.patient_name,
            date: b.date,
            time: b.time,
            status: b.status,
            price: b.amount,
            locationDetails: {
              address: b.address,
              phone: b.phone,
              city: '', // Backend combines these for now, or returns separately
              country: '',
              homeNumber: ''
            },
            isBackend: true
          }))
          allRequests = [...allRequests, ...mapped]
        }
      } catch (err) {
        console.error("Failed to fetch backend bookings", err)
      }
    }

    // Filter and Deduplicate
    const unique = Array.from(new Set(allRequests.map(r => r.id))).map(id => allRequests.find(r => r.id === id))
    setRequests(unique)
    setLoading(false)
  }

  const handleAction = async (request: any, action: 'confirmed' | 'rejected') => {
    // 1. Update Backend if it's a backend booking
    if (request.isBackend) {
      try {
        const token = localStorage.getItem('auth_token')
        const resp = await fetch(`http://localhost:8000/api/bookings/${request.id}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ action: action === 'confirmed' ? 'confirm' : 'reject' })
        })
        if (!resp.ok) {
          alert("Failed to update backend booking.")
          return
        }
      } catch (err) {
        alert("Server error updating booking.")
        return
      }
    }

    // 2. Update Local State & Network Storage
    const raw = localStorage.getItem('babycare_doctor_network')
    let network = []
    if (raw) {
      try { network = JSON.parse(raw) } catch (e) {}
    }
    const updatedNetwork = network.map((r: any) => r.id === request.id ? { ...r, status: action } : r)
    localStorage.setItem('babycare_doctor_network', JSON.stringify(updatedNetwork))
    
    // Refresh local state
    setRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: action } : r))

    if (action === 'confirmed') {
      // 3. Add to Dashboard Earnings (Simulated for UI)
      const earningsRaw = localStorage.getItem('babycare_doctor_earnings')
      let earnings = { total: 0, transactions: [] as any[] }
      if (earningsRaw) {
        try { earnings = JSON.parse(earningsRaw) } catch (e) {}
      }
      earnings.total += (request.price || 50)
      earnings.transactions.unshift({
        id: request.id,
        date: new Date().toLocaleString(),
        amount: `+$${request.price || 50}`,
        status: 'Completed',
        patientName: request.patientName
      })
      localStorage.setItem('babycare_doctor_earnings', JSON.stringify(earnings))

      // 4. Add to Schedule/Appointments (Simulated for UI)
      const apptRaw = localStorage.getItem('babycare_doctor_appointments')
      let appts = []
      if (apptRaw) {
        try { appts = JSON.parse(apptRaw) } catch (e) {}
      }
      appts.push({
        id: request.id,
        patientName: request.patientName,
        time: request.time,
        date: request.date,
        type: 'Home Visit',
        status: 'Confirmed',
        avatar: request.patientName?.substring(0, 2).toUpperCase(),
        location: request.locationDetails
      })
      localStorage.setItem('babycare_doctor_appointments', JSON.stringify(appts))

      // 5. Add to Chat System (Simulated for UI and persistence)
      const chatRaw = localStorage.getItem('babycare_doctor_chats')
      let chats = []
      if (chatRaw) {
        try { chats = JSON.parse(chatRaw) } catch (e) {}
      }
      if (!chats.find((c: any) => c.name === request.patientName)) {
         chats.push({
           id: request.id,
           name: request.patientName,
           doctorName: currentDoctorName,
           lastMsg: 'Booking confirmed! I will be there on time.',
           time: 'Just now',
           unread: 1,
           avatar: request.patientName?.substring(0, 2).toUpperCase(),
           messages: [
             { sender: 'doctor', text: 'Booking confirmed! I will be there on time.', time: new Date().toLocaleTimeString(), isDoctor: true }
           ]
         })
         localStorage.setItem('babycare_doctor_chats', JSON.stringify(chats))
      }
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const historyRequests = requests.filter(r => r.status !== 'pending')

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center mb-2">
          <Activity className="w-8 h-8 mr-3 text-blue-500" />
          Patient Management
        </h1>
        <p className="text-slate-500 font-medium">Manage incoming patient bookings and confirm home visit appointments.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Pending Bookings ({pendingRequests.length})</h2>
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-500">No pending requests</h3>
            <p className="text-slate-400">You're all caught up! Patient bookings will appear here.</p>
          </div>
        ) : (
          pendingRequests.map(req => (
            <Card key={req.id} className="border-l-4 border-l-blue-500 shadow-md animate-in slide-in-from-left-4 duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-slate-100 shadow-sm">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">
                        {req.patientName?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xl">{req.patientName}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                        <span className="flex items-center text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" /> 
                          {new Date(req.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" /> 
                          {req.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {req.locationDetails && (
                    <div className="flex-1 min-w-0 bg-orange-50 p-4 rounded-2xl w-full md:w-auto">
                      <div className="flex items-start gap-2 text-sm text-slate-800">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{req.locationDetails.homeNumber}, {req.locationDetails.address}</p>
                          <p className="text-slate-500">{req.locationDetails.city}, {req.locationDetails.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-800 mt-2">
                        <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="font-bold">{req.locationDetails.phone}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Button onClick={() => handleAction(req, 'confirmed')} className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl h-11 text-white shadow-md shadow-emerald-500/20">
                      <Check className="w-5 h-5 mr-2" /> Confirm
                    </Button>
                    <Button onClick={() => handleAction(req, 'rejected')} variant="outline" className="flex-1 md:flex-none font-bold rounded-xl h-11 text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300">
                      <X className="w-5 h-5 mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {historyRequests.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4 mt-8">Recent History</h2>
          <div className="space-y-4">
            {historyRequests.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5).map(req => (
              <Card key={req.id} className="border-0 shadow-sm opacity-75">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                        {req.patientName?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-900">{req.patientName}</p>
                      <p className="text-xs text-slate-500">{new Date(req.date).toLocaleDateString()} at {req.time}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`font-bold border-2 ${req.status === 'confirmed' ? 'text-emerald-500 border-emerald-200 bg-emerald-50' : 'text-rose-500 border-rose-200 bg-rose-50'}`}>
                    {req.status === 'confirmed' ? 'Confirmed' : 'Rejected'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
