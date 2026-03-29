'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Phone, Video, Search, Image as ImageIcon, FileText, MessageSquare, User, Clock, GraduationCap } from 'lucide-react'

export default function TeacherChatPage() {
  const [chats, setChats] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [teacherName, setTeacherName] = useState('Teacher')

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Teacher'
    setTeacherName(storedName)

    const loadChats = () => {
      const chatRaw = localStorage.getItem('babycare_teacher_chats')
      if (chatRaw) {
        try {
          const parsedChats = JSON.parse(chatRaw)
          setChats(parsedChats)
          if (selectedChat) {
            const updatedSelected = parsedChats.find((c: any) => c.id === selectedChat.id)
            if (updatedSelected) setSelectedChat(updatedSelected)
          } else if (parsedChats.length > 0) {
            setSelectedChat(parsedChats[0])
          }
        } catch (e) {}
      } else {
        const mock = [
          {
            id: 'mock_chat_1',
            name: 'Sarah Anderson',
            lastMsg: 'Hello Prof! I would like to schedule a home session.',
            time: '2m ago',
            unread: 1,
            avatar: 'SA',
            messages: [
              { sender: 'Sarah Anderson', text: 'Hello Prof! I would like to schedule a home session for Sunday afternoon.', time: '10:00 AM', isTeacher: false },
              { sender: 'teacher', text: 'Hello Sarah! I will check my schedule.', time: '10:05 AM', isTeacher: true }
            ]
          }
        ]
        setChats(mock)
        localStorage.setItem('babycare_teacher_chats', JSON.stringify(mock))
        setSelectedChat(mock[0])
      }
      setLoading(false)
    }

    loadChats()
    const intervalId = setInterval(loadChats, 3000)
    return () => clearInterval(intervalId)
  }, [selectedChat?.id])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return

    const newMessage = {
      sender: teacherName,
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: true
    }

    const updatedChat = {
      ...selectedChat,
      lastMsg: messageInput.trim(),
      time: 'Just now',
      unread: 0,
      messages: [...(selectedChat.messages || []), newMessage]
    }

    setSelectedChat(updatedChat)
    setMessageInput('')

    const updatedChats = chats.map(c => c.id === selectedChat.id ? updatedChat : c)
    setChats(updatedChats)
    localStorage.setItem('babycare_teacher_chats', JSON.stringify(updatedChats))
  }

  const selectConversation = (chat: any) => {
    const updatedChat = { ...chat, unread: 0 }
    setSelectedChat(updatedChat)
    const updatedChats = chats.map(c => c.id === chat.id ? updatedChat : c)
    setChats(updatedChats)
    localStorage.setItem('babycare_teacher_chats', JSON.stringify(updatedChats))
  }

  if (loading) return <div className="h-[calc(100vh-12rem)] flex items-center justify-center font-bold text-slate-400 font-black uppercase tracking-widest text-sm opacity-50">Opening Classroom Chat...</div>

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] min-h-[600px] flex animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out gap-8">
      
      {/* Search and Contacts Sidebar */}
      <Card className="w-80 border-0 shadow-2xl flex flex-col bg-white rounded-[2.5rem] overflow-hidden shrink-0 border border-slate-100">
        <div className="p-8 border-b border-slate-50">
          <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Parent Inquiries</h2>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300 group-focus-within:text-emerald-500 transition-colors" />
            <Input 
              placeholder="Find parents..." 
              className="pl-12 h-12 bg-emerald-50/50 border-transparent focus-visible:ring-emerald-400 rounded-2xl font-bold text-sm tracking-tight"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => selectConversation(chat)}
                className={`
                  flex items-center gap-4 p-5 rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden group
                  ${selectedChat?.id === chat.id 
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 scale-[1.02]' 
                    : 'hover:bg-slate-50 text-slate-600'}
                `}
              >
                {selectedChat?.id === chat.id && <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600/30" />}
                <div className="relative">
                  <Avatar className={`h-14 w-14 border-2 ${selectedChat?.id === chat.id ? 'border-white/40' : 'border-slate-50'} shadow-md`}>
                    <AvatarFallback className={`${selectedChat?.id === chat.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'} font-black text-lg`}>{chat.avatar}</AvatarFallback>
                  </Avatar>
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className={`text-sm font-black truncate ${selectedChat?.id === chat.id ? 'text-white' : 'text-slate-900'}`}>{chat.name}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-tighter shrink-0 ml-2 ${selectedChat?.id === chat.id ? 'text-white/60' : 'text-slate-400'}`}>{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate font-bold ${selectedChat?.id === chat.id ? 'text-white/80' : 'text-slate-400'}`}>{chat.lastMsg}</p>
                </div>
              </div>
            ))}
            {chats.length === 0 && (
              <div className="text-center py-20 px-4 opacity-30">
                <MessageSquare className="w-16 h-16 text-emerald-100 mx-auto mb-4" />
                <p className="text-sm font-black text-emerald-900 uppercase tracking-widest">No Class Messages</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 border-0 shadow-2xl flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="h-24 border-b border-slate-50 flex items-center justify-between px-10 shrink-0 bg-white/50 backdrop-blur-md z-10">
              <div className="flex items-center gap-5">
                <Avatar className="h-14 w-14 border-4 border-emerald-50 shadow-xl">
                   <AvatarFallback className="bg-emerald-500 text-white font-black text-xl leading-none">{selectedChat.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">{selectedChat.name}</h3>
                  <p className="text-xs text-emerald-600 font-black flex items-center uppercase tracking-widest overflow-hidden h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                    Student Parent • Live Inquiry
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="icon" variant="ghost" className="text-slate-200 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl w-14 h-14 border border-slate-50">
                  <Phone className="w-6 h-6" />
                </Button>
                <Button size="icon" variant="ghost" className="text-slate-200 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl w-14 h-14 border border-slate-50">
                  <Video className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-8 bg-emerald-50/20">
               <div className="space-y-8 flex flex-col-reverse justify-end min-h-full">
                 <div className="space-y-8 pb-4">
                    {selectedChat.messages?.map((msg: any, idx: number) => (
                      <div key={idx} className={`flex ${msg.isTeacher ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                        <div className={`
                           ${msg.isTeacher 
                               ? 'bg-emerald-500 text-white rounded-[1.8rem] rounded-tr-none shadow-xl shadow-emerald-500/10' 
                               : 'bg-white text-slate-800 rounded-[1.8rem] rounded-tl-none border border-slate-100 shadow-sm'} 
                           p-6 max-w-[70%] group relative
                        `}>
                          <p className="text-[16px] leading-relaxed font-bold tracking-tight">{msg.text}</p>
                          <div className={`flex items-center gap-1.5 mt-3 ${msg.isTeacher ? 'text-white/60 justify-end' : 'text-slate-300 justify-start'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{msg.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!selectedChat.messages?.length && (
                      <div className="text-center text-slate-300 my-10 text-xs font-black uppercase tracking-widest italic opacity-40">
                        Education dialogue started
                      </div>
                    )}
                 </div>
               </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-6 border-t border-slate-50 bg-white">
              <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost" className="text-slate-200 hover:text-emerald-500 hover:bg-emerald-50 shrink-0 rounded-2xl w-14 h-14 border border-slate-50 transition-all active:scale-95">
                  <ImageIcon className="w-6 h-6" />
                </Button>
                <Input 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Teacher reply to ${selectedChat.name.split(' ')[0]}...`} 
                  className="flex-1 bg-emerald-50/30 border-transparent focus-visible:ring-emerald-400 rounded-3xl h-14 px-8 font-bold text-sm"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl w-14 h-14 shrink-0 shadow-2xl shadow-emerald-500/30 transition-all active:scale-75">
                  <Send className="w-6 h-6 ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
            <div className="w-32 h-32 bg-emerald-100 rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl shadow-emerald-100 rotate-12 group-hover:rotate-0 transition-transform">
               <GraduationCap className="w-16 h-16 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Open Learning Center</h3>
            <p className="text-slate-400 max-w-sm font-bold text-sm tracking-tight leading-relaxed">Select a parent inquiry from the classroom list to begin your professional assistance.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
