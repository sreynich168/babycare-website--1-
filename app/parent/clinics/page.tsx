'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Search, Navigation, Phone, Star, Car, Footprints, Bus, Bike, ChevronDown, ChevronUp } from 'lucide-react'

export default function ClinicsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('Phnom Penh')
  const [mapQuery, setMapQuery] = useState('Phnom Penh')
  const [activeClinicIdx, setActiveClinicIdx] = useState<number | null>(null)
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      setSearchQuery(searchInput.trim())
      setMapQuery(searchInput.trim())
    }
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setSearchQuery(`${lat},${lng}`);
          setMapQuery(`${lat},${lng}`);
          setSearchInput('My Location');
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get your location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  const [clinics, setClinics] = useState([
    {
      name: 'City Care Hospital',
      address: '123 Health Ave, Medical District',
      distance: '1.2 km',
      rating: 4.8,
      status: 'Open 24/7'
    },
    {
      name: 'Sunrise Maternity Clinic',
      address: '45 Sunshine Blvd, Westside',
      distance: '3.5 km',
      rating: 4.9,
      status: 'Closes at 8 PM'
    },
    {
      name: 'Hope Family Practice',
      address: '789 Community Rd, Eastside',
      distance: '5.0 km',
      rating: 4.5,
      status: 'Closes at 6 PM'
    }
  ])

  useEffect(() => {
    if (searchQuery.trim() === '') return;
    let area = searchQuery.split(',')[0].trim() || 'Your Area';
    if (searchQuery === 'My Location' || /^[\d.-]+$/.test(area)) {
      area = 'Nearby';
    }
    setClinics([
      {
        name: `${area} Women's Hospital`,
        address: `123 Main St, ${area}`,
        distance: '1.2 km',
        rating: 4.8,
        status: 'Open 24/7'
      },
      {
        name: `Sunrise Maternity Clinic ${area}`,
        address: `45 Sunshine Blvd, ${area}`,
        distance: '3.5 km',
        rating: 4.9,
        status: 'Closes at 8 PM'
      },
      {
        name: `Hope Family Practice ${area}`,
        address: `789 Community Rd, ${area}`,
        distance: '5.0 km',
        rating: 4.5,
        status: 'Closes at 6 PM'
      }
    ])
  }, [searchQuery])

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center mb-2">
          <MapPin className="w-8 h-8 mr-3 text-orange-500" />
          Nearby Clinics & Hospitals
        </h1>
        <p className="text-gray-600 font-medium">Find trusted healthcare facilities located near you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Interactive Google Map Embed */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-xl border-4 border-white relative bg-gray-200">
          <iframe 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery + " clinics and hospitals")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Nearby Hospitals and Clinics"
          ></iframe>
          
          <div className="absolute inset-x-4 top-4 pointer-events-none">
            <div className="relative pointer-events-auto flex items-center justify-center gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Search location... (Press Enter to search)" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-12 h-14 rounded-2xl bg-white/95 backdrop-blur shadow-lg border-0 text-lg w-full focus-visible:ring-orange-400"
                />
              </div>
              <Button 
                onClick={getUserLocation}
                className="h-14 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-lg text-white font-bold flex items-center shrink-0"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Near Me
              </Button>
            </div>
          </div>
        </div>

        {/* List of clinics */}
        <div className="space-y-4 overflow-y-auto pb-4 pr-2 custom-scrollbar">
          <h2 className="text-xl font-bold text-gray-800 px-1">Featured Recommended</h2>
          {clinics.map((clinic, idx) => (
            <Card 
              key={idx} 
              className={`border-2 ${activeClinicIdx === idx ? 'border-orange-500 shadow-orange-500/10' : 'border-transparent shadow-lg'} bg-white/90 backdrop-blur-md rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-8`}
              style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
              onClick={() => {
                const location = `${clinic.name}, ${clinic.address}`;
                setMapQuery(location);
                setActiveClinicIdx(idx);
              }}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{clinic.name}</h3>
                  <div className="flex items-center bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-sm font-bold">
                    <Star className="w-3 h-3 mr-1 fill-orange-500 text-orange-500" />
                    {clinic.rating}
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
                  {clinic.address}
                </p>
                
                <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-gray-100">
                  <span className="font-medium text-emerald-600">{clinic.status}</span>
                  <span className="text-gray-500 font-medium">{clinic.distance}</span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1 rounded-xl h-10 border-orange-200 text-orange-700 hover:bg-orange-50" onClick={(e) => e.stopPropagation()}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl h-10 bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveClinicIdx(activeClinicIdx === idx ? null : idx);
                      if (activeClinicIdx !== idx) {
                        const location = `${clinic.name}, ${clinic.address}`;
                        setMapQuery(location);
                      }
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions {activeClinicIdx === idx ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </Button>
                </div>
                
                {activeClinicIdx === idx && (
                  <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between animate-in slide-in-from-top-2 fade-in duration-300">
                    <Button variant="ghost" className="flex flex-col items-center h-auto py-2 px-3 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors" onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(clinic.address)}&travelmode=driving`, '_blank')}}>
                      <Car className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold tracking-wide uppercase">Car</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col items-center h-auto py-2 px-3 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors" onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(clinic.address)}&travelmode=walking`, '_blank')}}>
                      <Footprints className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold tracking-wide uppercase">Walk</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col items-center h-auto py-2 px-3 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors" onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(clinic.address)}&travelmode=transit`, '_blank')}}>
                      <Bus className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold tracking-wide uppercase">Bus</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col items-center h-auto py-2 px-3 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors" onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(clinic.address)}&travelmode=bicycling`, '_blank')}}>
                      <Bike className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold tracking-wide uppercase">Bike</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
