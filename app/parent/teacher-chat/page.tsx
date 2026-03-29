'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Phone, Video, Search, Image as ImageIcon, FileText, ArrowLeft, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ParentTeacherChat() {
  const searchParams = useSearchParams()
  const teacherId = searchParams.get('teacherId')
  const [chatSession, setChatSession] = useState<any>(null)
  const [messageInput, setMessageInput] = useState('')
  const [userName, setUserName] = useState('Parent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Parent'
    setUserName(storedName)

    const loadChat = () => {
      const chatRaw = localStorage.getItem('babycare_teacher_chats')
      if (chatRaw) {
        try {
          const parsedChats = JSON.parse(chatRaw)
          // Find the chat for this user
          const myChat = parsedChats.find((c: any) => c.name === storedName)
          if (myChat) {
            setChatSession(myChat)
          } else {
             // Fallback to mock if it's the first time
             const mock = {
                id: teacherId || 'm1',
                name: storedName,
                lastMsg: 'Hello Prof!',
                time: 'Just now',
                unread: 0,
                avatar: storedName.substring(0, 1),
                messages: []
             }
             setChatSession(mock)
          }
        } catch (e) {}
      }
      setLoading(false)
    }

    loadChat()
    const intervalId = setInterval(loadChat, 3000)
    return () => clearInterval(intervalId)
  }, [teacherId])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !chatSession) return

    const newMessage = {
      sender: userName,
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: false
    }

    const updatedChatSession = {
      ...chatSession,
      lastMsg: `You: ${messageInput.trim()}`,
      time: 'Just now',
      unread: 1, // Add unread for teacher
      messages: [...(chatSession.messages || []), newMessage]
    }

    setChatSession(updatedChatSession)
    setMessageInput('')

    const chatRaw = localStorage.getItem('babycare_teacher_chats')
    let parsedChats = []
    if (chatRaw) {
      try { parsedChats = JSON.parse(chatRaw) } catch(e) {}
    }
    const updatedChats = parsedChats.map((c: any) => c.name === chatSession.name ? updatedChatSession : c)
    if (!updatedChats.find((c: any) => c.name === chatSession.name)) {
        updatedChats.push(updatedChatSession)
    }
    localStorage.setItem('babycare_teacher_chats', JSON.stringify(updatedChats))
  }

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Loading Classroom...</div>

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] min-h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out py-8">
      
      <div className="mb-6 flex items-center">
        <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 font-black uppercase tracking-widest text-xs" asChild>
           <Link href="/parent/teachers"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Teachers</Link>
        </Button>
      </div>

      <Card className="flex-1 border-0 shadow-2xl flex flex-col bg-white overflow-hidden rounded-[3rem] relative border border-emerald-50">
        <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-between px-10 shrink-0 z-10 shadow-lg text-white">
          <div className="flex items-center gap-5">
            <Avatar className="h-14 w-14 border-4 border-white pb-0.5 shadow-xl">
               <AvatarFallback className="bg-white text-emerald-600 font-black text-xl">
                 <GraduationCap className="w-8 h-8" />
               </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-black text-xl tracking-tight leading-none mb-1">Teacher Correspondence</h3>
              <p className="text-[10px] text-emerald-50 font-black flex items-center uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 mr-2 shadow-[0_0_8px_rgba(110,231,183,1)] animate-pulse" />
                Active Class Session
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-2xl w-12 h-12">
              <Phone className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-2xl w-12 h-12">
              <Video className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-8 z-10 bg-slate-50/50">
           <div className="space-y-8 flex flex-col justify-end min-h-full pb-6">
             <div className="flex justify-center mb-4">
               <span className="text-[10px] font-black text-slate-300 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-50 uppercase tracking-[0.3em]">Learning Portal Opened</span>
             </div>
             
             {chatSession.messages?.map((msg: any, idx: number) => (
               <div key={idx} className={`flex ${msg.isTeacher ? 'justify-start' : 'justify-end'}`}>
                 <div className={`
                    ${msg.isTeacher 
                        ? 'bg-white text-slate-800 rounded-[1.8rem] rounded-tl-none border border-slate-100 shadow-sm' 
                        : 'bg-emerald-500 text-white rounded-[1.8rem] rounded-tr-none shadow-xl shadow-emerald-500/10'} 
                    p-6 rounded-2xl max-w-[75%] 
                 `}>
                   <p className="text-[15px] leading-relaxed font-bold tracking-tight">{msg.text}</p>
                   <span className={`text-[10px] font-black tracking-widest mt-3 block w-full uppercase ${msg.isTeacher ? 'text-slate-300 text-left' : 'text-emerald-100 text-right'}`}>
                     {msg.time}
                   </span>
                 </div>
               </div>
             ))}
             {!chatSession.messages?.length && (
                 <div className="text-center text-slate-300 my-12 text-[10px] font-black uppercase tracking-[0.3em] h-20 flex items-center justify-center opacity-40">
                   Waiting for your first message Prof.
                 </div>
             )}
           </div>
        </ScrollArea>

        <div className="p-6 bg-white border-t border-emerald-50 z-10 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 shrink-0 rounded-2xl w-12 h-12 border border-slate-50">
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Input 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Send an academic inquiry to the teacher..." 
              className="flex-1 bg-slate-50 border-transparent focus-visible:ring-emerald-400 rounded-2xl h-14 px-8 font-bold text-sm"
            />
            <Button onClick={handleSendMessage} size="icon" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl w-14 h-14 shrink-0 shadow-2xl shadow-emerald-500/20 transition-all active:scale-95">
              <Send className="w-6 h-6 ml-0.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
