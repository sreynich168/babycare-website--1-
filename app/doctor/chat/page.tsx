'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Phone, Video, Search, Image as ImageIcon, FileText, MessageSquare, User, Clock } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

export default function DoctorChatPage() {
  const { t } = useLanguage()
  const [chats, setChats] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [doctorName, setDoctorName] = useState('Doctor')

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Doctor'
    setDoctorName(storedName)

    const loadChats = async () => {
      const token = localStorage.getItem('auth_token')
      let allChats = []

      // 1. Try localStorage first
      const chatRaw = localStorage.getItem('babycare_doctor_chats')
      if (chatRaw) {
        try {
          allChats = JSON.parse(chatRaw)
        } catch (e) {}
      }

      // 2. Try Backend if token exists
      if (token) {
        try {
          const resp = await fetch('http://localhost:8000/api/bookings/my', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (resp.ok) {
            const bookings = await resp.json()
            const confirmedOnes = bookings.filter((b: any) => b.status === 'confirmed')
            
            for (const appt of confirmedOnes) {
              const chatResp = await fetch(`http://localhost:8000/api/chat/${appt.patient_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              })
              const messages = chatResp.ok ? await chatResp.json() : []
              
              const backendChat = {
                id: `backend_${appt.id}`,
                recipient_id: appt.patient_id,
                name: appt.patient_name,
                lastMsg: messages.length > 0 ? messages[messages.length-1].message : 'Booking confirmed!',
                time: 'Just now',
                unread: 0,
                avatar: appt.patient_name?.substring(0, 2).toUpperCase() || 'P',
                messages: messages.map((m: any) => ({
                  sender: m.sender_name,
                  text: m.message,
                  time: new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isDoctor: m.sender_role === 'doctor'
                }))
              }
              
              if (!allChats.find((c: any) => c.recipient_id === appt.patient_id)) {
                allChats.push(backendChat)
              } else {
                // Update existing
                allChats = allChats.map((c: any) => c.recipient_id === appt.patient_id ? backendChat : c)
              }
            }
          }
        } catch (err) {
          console.error("Backend chat fetch failed", err)
        }
      }

      setChats(allChats)
      
      if (selectedChat) {
        const updatedSelected = allChats.find((c: any) => c.id === selectedChat.id)
        if (updatedSelected) setSelectedChat(updatedSelected)
      } else if (allChats.length > 0) {
        setSelectedChat(allChats[0])
      }
      
      setLoading(false)
    }

    loadChats()
    
    // Poll for changes
    const intervalId = setInterval(loadChats, 5000)
    return () => clearInterval(intervalId)
  }, [selectedChat?.id])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return

    const token = localStorage.getItem('auth_token')
    const msgText = messageInput.trim()
    setMessageInput('')

    // 1. Send to Backend if recipient exists
    if (token && selectedChat.recipient_id) {
       try {
         await fetch('http://localhost:8000/api/chat', {
           method: 'POST',
           headers: { 
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json' 
           },
           body: JSON.stringify({
             recipient_id: selectedChat.recipient_id,
             message: msgText
           })
         })
       } catch (err) {
         console.error("Failed to send message to backend")
       }
    }

    // 2. Local State Update (Optimistic)
    const newMessage = {
      sender: doctorName,
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoctor: true
    }

    const updatedChat = {
      ...selectedChat,
      lastMsg: msgText,
      time: 'Just now',
      unread: 0,
      messages: [...(selectedChat.messages || []), newMessage]
    }

    setSelectedChat(updatedChat)

    // 3. Update global storage (Mock persistence)
    const updatedChats = chats.map(c => c.id === selectedChat.id ? updatedChat : c)
    setChats(updatedChats)
    localStorage.setItem('babycare_doctor_chats', JSON.stringify(updatedChats))
  }

  const selectConversation = (chat: any) => {
    // Mark as read when selecting
    const updatedChat = { ...chat, unread: 0 }
    setSelectedChat(updatedChat)
    
    const updatedChats = chats.map(c => c.id === chat.id ? updatedChat : c)
    setChats(updatedChats)
    localStorage.setItem('babycare_doctor_chats', JSON.stringify(updatedChats))
  }

  if (loading) {
     return <div className="h-[calc(100vh-12rem)] flex items-center justify-center font-bold text-slate-400">Loading your conversations...</div>
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] min-h-[600px] flex animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out gap-6">
      
      {/* Search and Contacts Sidebar */}
      <Card className="w-80 border-0 shadow-lg flex flex-col bg-white rounded-3xl overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search patients..." 
              className="pl-10 h-10 bg-slate-50 border-transparent focus-visible:ring-blue-400 rounded-xl"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => selectConversation(chat)}
                className={`
                  flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200
                  ${selectedChat?.id === chat.id 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-sm' 
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'}
                `}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border border-slate-100 shadow-sm">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{chat.avatar}</AvatarFallback>
                  </Avatar>
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className={`text-sm font-bold truncate ${selectedChat?.id === chat.id ? 'text-blue-900' : 'text-slate-900'}`}>{chat.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMsg}</p>
                </div>
              </div>
            ))}
            {chats.length === 0 && (
              <div className="text-center py-10 px-4">
                <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400">No active chats</p>
                <p className="text-xs text-slate-400">Conversations will appear when patients contact you.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 border-0 shadow-lg flex flex-col bg-white rounded-3xl overflow-hidden">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="h-20 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/50 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-blue-50 shadow-sm">
                   <AvatarFallback className="bg-blue-500 text-white font-bold">{selectedChat.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedChat.name}</h3>
                  <p className="text-xs text-emerald-500 font-bold flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                    Patient • Online
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                  <Video className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6 bg-slate-50/30">
               <div className="space-y-6 flex flex-col-reverse justify-end min-h-full">
                 <div className="space-y-6">
                    {selectedChat.messages?.map((msg: any, idx: number) => (
                      <div key={idx} className={`flex ${msg.isDoctor ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`
                           ${msg.isDoctor 
                               ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/20' 
                               : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'} 
                           p-4 rounded-2xl max-w-[70%] 
                        `}>
                          <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-2 ${msg.isDoctor ? 'text-blue-100 justify-end' : 'text-slate-400 justify-start'}`}>
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{msg.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!selectedChat.messages?.length && (
                      <div className="text-center text-slate-400 my-8 text-sm italic">
                        Start your conversation with {selectedChat.name}
                      </div>
                    )}
                 </div>
               </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 shrink-0 rounded-full">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 shrink-0 rounded-full">
                  <FileText className="w-5 h-5" />
                </Button>
                <Input 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Write a message to ${selectedChat.name.split(' ')[0]}...`} 
                  className="flex-1 bg-slate-50 border-transparent focus-visible:ring-blue-400 rounded-full h-12 px-6 text-[15px]"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 shrink-0 shadow-lg shadow-blue-500/30 transition-transform active:scale-95">
                  <Send className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
               <MessageSquare className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Select a Conversation</h3>
            <p className="text-slate-500 max-w-sm mt-2 font-medium">Choose a patient from the list on the left to start chatting with them.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
