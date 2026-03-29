'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Phone, Video, Search, Image as ImageIcon, FileText, ArrowLeft, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

export default function ParentChatPage() {
  const { t } = useLanguage()
  const [chatSession, setChatSession] = useState<any>(null)
  const [messageInput, setMessageInput] = useState('')
  const [userName, setUserName] = useState('Parent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Parent'
    setUserName(storedName)

    const loadChat = async () => {
      const token = localStorage.getItem('auth_token')
      const chatRaw = localStorage.getItem('babycare_doctor_chats')
      let foundChat = null

      // 1. Try localStorage first
      if (chatRaw) {
        try {
          const parsedChats = JSON.parse(chatRaw)
          foundChat = parsedChats.find((c: any) => c.name === storedName)
        } catch (e) {}
      }

      // 2. Try Backend if token exists
      if (token && !foundChat) {
        try {
          const resp = await fetch('http://localhost:8000/api/bookings/my', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (resp.ok) {
            const bookings = await resp.json()
            const confirmed = bookings.find((b: any) => b.status === 'confirmed')
            if (confirmed) {
              // Get messages for this doctor
              const chatResp = await fetch(`http://localhost:8000/api/chat/${confirmed.doctor_profile_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              })
              const messages = chatResp.ok ? await chatResp.json() : []
              
              foundChat = {
                id: confirmed.id.toString(),
                recipient_id: confirmed.doctor_profile_id,
                name: storedName,
                doctorName: confirmed.doctor_name,
                lastMsg: messages.length > 0 ? messages[messages.length-1].message : 'You can now chat with the doctor.',
                messages: messages.map((m: any) => ({
                  sender: m.sender_name,
                  text: m.message,
                  time: new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isDoctor: m.sender_role === 'doctor'
                }))
              }
            }
          }
        } catch (err) {
          console.error("Backend chat load failed", err)
        }
      }

      if (foundChat) {
        setChatSession(foundChat)
      }
      setLoading(false)
    }

    loadChat()
    
    // Poll for changes
    const intervalId = setInterval(loadChat, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !chatSession) return

    const token = localStorage.getItem('auth_token')
    const msgText = messageInput.trim()
    setMessageInput('')

    // 1. Send to Backend if token exists
    if (token && chatSession.recipient_id) {
       try {
         await fetch('http://localhost:8000/api/chat', {
           method: 'POST',
           headers: { 
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json' 
           },
           body: JSON.stringify({
             recipient_id: chatSession.recipient_id,
             message: msgText
           })
         })
       } catch (err) {
         console.error("Failed to send backend message")
       }
    }

    // 2. Local State Update (Optimistic)
    const newMessage = {
      sender: userName,
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoctor: false
    }

    const updatedChatSession = {
      ...chatSession,
      lastMsg: `You: ${msgText}`,
      time: 'Just now',
      unread: 0,
      messages: [...(chatSession.messages || []), newMessage]
    }

    setChatSession(updatedChatSession)

    // 3. Update the global chat storage (Mock persistence)
    const chatRaw = localStorage.getItem('babycare_doctor_chats')
    if (chatRaw) {
      try {
        const parsedChats = JSON.parse(chatRaw)
        const updatedChats = parsedChats.map((c: any) => c.id === chatSession.id ? updatedChatSession : c)
        if (!updatedChats.find((c: any) => c.id === chatSession.id)) {
            updatedChats.push(updatedChatSession)
        }
        localStorage.setItem('babycare_doctor_chats', JSON.stringify(updatedChats))
      } catch(e) {}
    }
  }

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>
  }

  if (!chatSession) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out text-center pt-20">
        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <MessageSquare className="w-12 h-12 text-pink-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Doctor Chat Not Available</h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          You can only chat with a doctor after you have booked an appointment and the doctor has confirmed it.
        </p>
        <Button asChild className="mt-8 rounded-full h-12 px-8 font-bold bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-500/20 text-white">
          <Link href="/parent/booking">Book an Appointment</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] min-h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      <div className="mb-4 flex items-center">
        <Button variant="ghost" className="text-gray-500 hover:text-pink-600 mr-2" asChild>
           <Link href="/parent"><ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard</Link>
        </Button>
      </div>

      <Card className="flex-1 border-0 shadow-xl flex flex-col bg-white overflow-hidden rounded-3xl relative">
        <div className="h-20 bg-gradient-to-r from-pink-500 to-rose-400 border-b border-pink-100 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm text-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
               <AvatarFallback className="bg-white text-pink-600 font-bold">
                 {chatSession.doctorName?.substring(0, 2).toUpperCase() || 'DR'}
               </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">{chatSession.doctorName || 'Your Doctor'}</h3>
              <p className="text-sm text-pink-100 font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                Online Consultation
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
              <Phone className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
              <Video className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6 z-10 bg-gray-50/50">
           <div className="space-y-6 flex flex-col justify-end min-h-full pb-4">
             <div className="flex justify-center">
               <span className="text-xs font-bold text-gray-400 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100 uppercase tracking-wider">Today</span>
             </div>
             
             {chatSession.messages?.map((msg: any, idx: number) => (
               <div key={idx} className={`flex ${msg.isDoctor ? 'justify-start' : 'justify-end'}`}>
                 <div className={`
                    ${msg.isDoctor 
                        ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm' 
                        : 'bg-pink-500 text-white rounded-tr-none shadow-md shadow-pink-500/20'} 
                    p-4 rounded-2xl max-w-[75%] 
                 `}>
                   <p className="text-[15px] leading-relaxed">{msg.text}</p>
                   <span className={`text-[11px] font-medium ${msg.isDoctor ? 'text-gray-400' : 'text-pink-100'} mt-2 block w-full ${msg.isDoctor ? 'text-left' : 'text-right'}`}>
                     {msg.time}
                   </span>
                 </div>
               </div>
             ))}
             {!chatSession.messages?.length && (
                 <div className="text-center text-gray-400 my-8 text-sm bg-white p-4 rounded-xl shadow-sm border border-gray-100 mx-auto max-w-sm">
                   Your doctor is ready to connect. Send a message to start the consultation.
                 </div>
             )}
           </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-pink-100 z-10 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-pink-500 hover:bg-pink-50 shrink-0 rounded-full">
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-pink-500 hover:bg-pink-50 shrink-0 rounded-full">
              <FileText className="w-5 h-5" />
            </Button>
            <Input 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message to the doctor..." 
              className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-pink-400 rounded-full h-12 px-6 text-[15px]"
            />
            <Button onClick={handleSendMessage} size="icon" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full w-12 h-12 shrink-0 shadow-md shadow-pink-500/20 transition-transform active:scale-95">
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
