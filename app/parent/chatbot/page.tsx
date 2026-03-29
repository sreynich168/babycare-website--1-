'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Send, Bot, User, Sparkles, Activity, AlertTriangle,
  CheckCircle2, ImagePlus, X, Trash2, Globe, Pill, Mic
} from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

// ── Markdown-lite renderer ──
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const renderInline = (str: string) => {
          const parts = str.split(/\*\*(.*?)\*\*/)
          return parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : <span key={j}>{p}</span>)
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <div key={i} className="flex gap-2"><span className="shrink-0 text-pink-400">•</span><span>{renderInline(line.replace(/^[-•]\s/, ''))}</span></div>
        }
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)\.\s/)?.[1]
          return <div key={i} className="flex gap-2"><span className="shrink-0 font-bold text-purple-500">{num}.</span><span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span></div>
        }
        if (line.startsWith('## ') || line.startsWith('### ')) {
          return <p key={i} className="font-bold text-gray-700 mt-2">{line.replace(/^#{2,3}\s/, '')}</p>
        }
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i}>{renderInline(line)}</p>
      })}
    </div>
  )
}

// ── Health Risk Card ──
function HealthRiskCard({ result }: { result: any }) {
  if (!result) return null
  const { riskLevel, score, message } = result
  const isLow = riskLevel === 'Low Risk'
  const isMod = riskLevel === 'Moderate Risk'
  return (
    <div className={`mt-3 p-4 rounded-2xl space-y-3 border ${isLow ? 'bg-green-50 border-green-200' : isMod ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isLow ? 'bg-green-100 text-green-600' : isMod ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
          {isLow ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <h4 className={`font-bold ${isLow ? 'text-green-700' : isMod ? 'text-orange-700' : 'text-red-700'}`}>{riskLevel} Assessment</h4>
          <p className="text-xs text-gray-500">Score: {score}/100</p>
        </div>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-sm text-gray-700 italic">"{message}"</p>
    </div>
  )
}

// ── Medicine Info Card ──
function MedicineCard({ result }: { result: any }) {
  if (!result) return null
  return (
    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
      <div className="flex items-center gap-2 text-blue-700 font-bold">
        <Pill className="w-4 h-4" />{result.name}
      </div>
      {result.imageUrl && (
        <img src={result.imageUrl} alt={result.name}
          className="w-full max-w-[200px] rounded-xl object-cover shadow"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
      )}
      <p className="text-sm text-gray-700">{result.description}</p>
      <p className="text-xs text-amber-600 font-medium">⚕️ {result.safetyNote}</p>
    </div>
  )
}

// ── History helpers ──
const HISTORY_KEY = 'babycare_chat_history'
function loadHistory() {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}
function saveHistory(msgs: any[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(msgs.slice(-100))) } catch {}
}

const WELCOME_PART = {
  type: 'text' as const,
  text: '👋 Hello! I am your AI Care Assistant powered by **Gemini**.\n\nI can help you with:\n- Pregnancy and baby care questions 🤱\n- Medicine information with images 💊\n- Analyzing photos (medicine, symptoms, etc.) 📸\n- Questions in **any language** 🌐\n\nFeel free to ask multiple questions at once! Take care 🌸'
}

// ── Main Page ──
export default function ChatbotPage() {
  const [inputText, setInputText] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg')
  
  const [isRecording, setIsRecording] = useState(false)
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [audioMimeType, setAudioMimeType] = useState<string>('audio/webm')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const savedMessages = loadHistory()

  const { messages, status, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: savedMessages.length > 0 ? savedMessages : [
      { id: 'welcome', role: 'assistant' as const, parts: [WELCOME_PART] }
    ],
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (messages.length > 0) saveHistory(messages) }, [messages])
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [inputText])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageMimeType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setImageBase64(result.split(',')[1])
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null); setImageBase64(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' })
        setAudioMimeType(audioBlob.type)
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1]
          setAudioBase64(base64data)
        }
        reader.readAsDataURL(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const removeAudio = () => setAudioBase64(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if ((!inputText.trim() && !imageBase64 && !audioBase64) || isLoading) return
    const text = inputText.trim() || 'Please analyze the attached files for me.'
    const extraBody = {
      ...(imageBase64 ? { imageBase64, imageMimeType } : {}),
      ...(audioBase64 ? { audioBase64, audioMimeType } : {})
    }
    setInputText('')
    await sendMessage({ text }, { body: extraBody })
    setImagePreview(null); setImageBase64(null)
    setAudioBase64(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY)
    setMessages([{ id: 'welcome-new', role: 'assistant', parts: [WELCOME_PART] }])
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] min-h-[600px] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center mb-1">
            <Sparkles className="w-8 h-8 mr-3 text-purple-500" />
            AI Care Assistant
          </h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            Powered by Gemini · Multi-language · Vision · History saved
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearHistory}
          className="text-gray-400 hover:text-red-500 flex items-center gap-1.5 text-xs">
          <Trash2 className="w-4 h-4" /> Clear
        </Button>
      </div>

      {/* Chat Card */}
      <Card className="flex-1 flex flex-col border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className={`w-9 h-9 border-2 ${message.role === 'user' ? 'border-pink-200' : 'border-purple-200'} flex items-center justify-center shrink-0`}>
                  {message.role === 'assistant'
                    ? <div className="bg-purple-100 w-full h-full flex items-center justify-center"><Bot className="w-5 h-5 text-purple-600" /></div>
                    : <div className="bg-pink-100 w-full h-full flex items-center justify-center"><User className="w-5 h-5 text-pink-600" /></div>
                  }
                </Avatar>
                <div className={`rounded-2xl px-5 py-3 max-w-[82%] shadow-sm text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-tr-none'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {message.parts?.map((part: any, idx: number) => {
                    if (part.type === 'text') {
                      return message.role === 'user'
                        ? <p key={idx} className="whitespace-pre-wrap">{part.text}</p>
                        : <MarkdownText key={idx} text={part.text} />
                    }
                    if (part.type === 'tool-invocation' && part.toolName === 'getHealthRiskScore') {
                      return <div key={idx} className="flex items-center gap-2 text-indigo-500 animate-pulse py-2"><Activity className="w-4 h-4" /><span className="text-xs">Calculating health risk...</span></div>
                    }
                    if (part.type === 'tool-result' && part.toolName === 'getHealthRiskScore') {
                      return <HealthRiskCard key={idx} result={part.result} />
                    }
                    if (part.type === 'tool-invocation' && part.toolName === 'getMedicineInfo') {
                      return <div key={idx} className="flex items-center gap-2 text-blue-500 animate-pulse py-2"><Pill className="w-4 h-4" /><span className="text-xs">Looking up medicine info...</span></div>
                    }
                    if (part.type === 'tool-result' && part.toolName === 'getMedicineInfo') {
                      return <MedicineCard key={idx} result={part.result} />
                    }
                    return null
                  })}
                </div>
              </div>
            ))}

            {isLoading && status !== 'streaming' && (
              <div className="flex gap-3">
                <Avatar className="w-9 h-9 border-2 border-purple-200 flex items-center justify-center shrink-0">
                  <div className="bg-purple-100 w-full h-full flex items-center justify-center"><Bot className="w-5 h-5 text-purple-600" /></div>
                </Avatar>
                <div className="bg-white border rounded-2xl rounded-tl-none px-5 py-4 flex space-x-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 bg-white/60 border-t border-gray-100 space-y-3">
          {imagePreview && (
            <div className="flex items-center gap-3 p-2 bg-pink-50 rounded-xl border border-pink-200">
              <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-pink-700 font-medium">Photo ready to send</p>
                <p className="text-xs text-gray-500">AI will analyze this image 🔍</p>
              </div>
              <Button size="icon" variant="ghost" onClick={removeImage} className="text-gray-400 hover:text-red-500 w-7 h-7">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {audioBase64 && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-purple-700 font-bold">Voice note ready</p>
                <p className="text-xs text-purple-500/70">Audio will be transcribed & analyzed 🎙️</p>
              </div>
              <Button size="icon" variant="ghost" onClick={removeAudio} className="text-gray-400 hover:text-red-500 w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <div className="flex flex-col sm:flex-row gap-1 shrink-0">
              <Button type="button" size="icon" variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="w-11 h-11 rounded-full text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                title="Upload a photo">
                <ImagePlus className="w-5 h-5" />
              </Button>
              <Button type="button" size="icon" variant="ghost"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-11 h-11 rounded-full transition-colors ${isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
                title="Send a voice note">
                {isRecording ? <div className="w-3 h-3 bg-red-500 rounded-sm" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>

            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask any question in your language 🌐 (Shift+Enter = new line)"
                rows={1}
                disabled={isLoading}
                className="w-full resize-none rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-50 shadow-sm placeholder:text-gray-400 min-h-[46px]"
              />
            </div>

            <Button type="submit"
              disabled={isLoading || (!inputText?.trim() && !imageBase64 && !audioBase64)}
              className="rounded-full w-11 h-11 p-0 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md transition-all flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-white" />
              <span className="sr-only">Send</span>
            </Button>
          </form>

          <p className="text-center text-[11px] text-gray-400">
            🤖 Gemini AI · Replies in your language · Photo analysis · History auto-saved
          </p>
        </div>
      </Card>
    </div>
  )
}
