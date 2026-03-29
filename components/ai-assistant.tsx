'use client'

import { useState } from 'react'
import { MessageCircle, Send, Bot, User, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

interface AIAssistantProps {
  language: string
}

export default function AIAssistant({ language }: AIAssistantProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  const translations = {
    en: {
      title: "AI Mommy Helper",
      subtitle: "Get instant answers to your pregnancy and baby care questions",
      askQuestion: "Ask your question...",
      send: "Send",
      categories: "Quick Help Categories",
      pregnancy: "Pregnancy",
      newborn: "Newborn Care",
      feeding: "Feeding",
      sleep: "Sleep",
      development: "Development",
      health: "Health Concerns",
      examples: "Example Questions"
    },
    hi: {
      title: "AI मम्मी सहायक",
      subtitle: "अपने गर्भावस्था और शिशु देखभाल के सवालों के तुरंत जवाब पाएं",
      askQuestion: "अपना सवाल पूछें...",
      send: "भेजें",
      categories: "त्वरित सहायता श्रेणियां",
      pregnancy: "गर्भावस्था",
      newborn: "नवजात देखभाल",
      feeding: "भोजन",
      sleep: "नींद",
      development: "विकास",
      health: "स्वास्थ्य चिंताएं",
      examples: "उदाहरण प्रश्न"
    },
    km: {
      title: "ជំនួយការ AI ម្តាយ",
      subtitle: "ទទួលបានចម្លើយភ្លាមៗចំពោះសំណួររបស់អ្នកអំពីការមានផ្ទៃពោះ និងការថែទាំកូន",
      askQuestion: "សួរសំណួររបស់អ្នក...",
      send: "ផ្ញើ",
      categories: "ប្រភេទជំនួយរហ័ស",
      pregnancy: "ការមានផ្ទៃពោះ",
      newborn: "ការថែទាំកូនទើបកើត",
      feeding: "ការចិញ្ចឹម",
      sleep: "ការគេង",
      development: "ការអភិវឌ្ឍន៍",
      health: "បញ្ហាសុខភាព",
      examples: "សំណួរឧទាហរណ៍"
    }
  }

  const t = translations[language as keyof typeof translations] ?? translations.en

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: [
      {
        id: '1',
        role: 'assistant' as const,
        parts: [{ type: 'text' as const, text: `Hello! I'm your AI Mommy Helper. I'm here to support you through your pregnancy and parenting journey. You can ask me questions about pregnancy care, baby development, feeding, sleep schedules, and more. How can I help you today?` }]
      }
    ]
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  const categories = [
    { id: 'pregnancy', label: t.pregnancy, color: 'bg-pink-100 text-pink-800' },
    { id: 'newborn', label: t.newborn, color: 'bg-blue-100 text-blue-800' },
    { id: 'feeding', label: t.feeding, color: 'bg-green-100 text-green-800' },
    { id: 'sleep', label: t.sleep, color: 'bg-purple-100 text-purple-800' },
    { id: 'development', label: t.development, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'health', label: t.health, color: 'bg-red-100 text-red-800' },
  ]

  const exampleQuestions = {
    en: [
      "What should I eat during my 7th month of pregnancy?",
      "My baby has a fever. What should I do?",
      "How can I reduce stress during pregnancy?",
      "When should my baby start eating solid foods?",
      "How many hours should a 3-month-old sleep?",
      "What are the signs of postpartum depression?"
    ],
    hi: [
      "गर्भावस्था के 7वें महीने में मुझे क्या खाना चाहिए?",
      "मेरे बच्चे को बुखार है। मुझे क्या करना चाहिए?",
      "गर्भावस्था के दौरान तनाव कैसे कम करूं?",
      "मेरे बच्चे को ठोस आहार कब शुरू करना चाहिए?",
      "3 महीने के बच्चे को कितने घंटे सोना चाहिए?",
      "प्रसवोत्तर अवसाद के लक्षण क्या हैं?"
    ],
    km: [
      "ខ្ញុំគួរតែញ៉ាំអ្វីនៅខែទី៧នៃការមានផ្ទៃពោះ?",
      "កូនខ្ញុំមានគ្រុនក្តៅ។ ខ្ញុំគួរធ្វើយ៉ាងម៉េច?",
      "តើធ្វើដូចម្តេចដើម្បីកាត់បន្ថយភាពតានតឹងក្នុងអំឡុងពេលមានផ្ទៃពោះ?",
      "កូនខ្ញុំគួរចាប់ផ្តើមញ៉ាំអាហាររឹងនៅពេលណា?",
      "កូនអាយុ៣ខែគួរគេងប៉ុន្មានម៉ោង?",
      "តើរោគសញ្ញានៃជំងឺធ្លាក់ទឹកចិត្តក្រោយសម្រាលមានអ្វីខ្លះ?"
    ]
  }

  const currentExamples = exampleQuestions[language as keyof typeof exampleQuestions] ?? exampleQuestions.en

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    const text = inputValue.trim()
    setInputValue('')
    await sendMessage({ text })
  }

  const handleExampleClick = (question: string) => {
    setInputValue(question)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-700 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  {t.categories}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      className={`${category.color} cursor-pointer hover:opacity-80 transition-opacity justify-center py-2`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-700">{t.examples}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentExamples.map((question, index) => (
                    <button
                      key={index}
                      className="text-left text-sm text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-pink-50 w-full"
                      onClick={() => handleExampleClick(question)}
                    >
                      "{question}"
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="border-pink-200 h-[600px] flex flex-col">
              <CardHeader className="border-b border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-pink-700">AI Mommy Helper</CardTitle>
                    <CardDescription>Available 24/7 in multiple languages</CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {(messages as any[]).map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {message.parts?.map((part: any, i: number) =>
                        part.type === 'text' ? <p key={i} className="text-sm leading-relaxed">{part.text}</p> : null
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input */}
              <div className="border-t border-pink-100 p-4">
                <form onSubmit={handleFormSubmit} className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t.askQuestion}
                    className="flex-1 border-pink-200 focus:border-pink-400"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t.send}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="border-pink-200 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Multi-Language Support</h3>
              <p className="text-sm text-gray-600">Get help in English, Hindi, Khmer, and more languages</p>
            </CardContent>
          </Card>
          <Card className="border-pink-200 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">24/7 Availability</h3>
              <p className="text-sm text-gray-600">Get instant answers anytime, day or night</p>
            </CardContent>
          </Card>
          <Card className="border-pink-200 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Expert Knowledge</h3>
              <p className="text-sm text-gray-600">Trained on trusted medical sources and parenting guidelines</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
