import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  GradientBackground, 
  GlassCard, 
  AnimatedButton, 
  AIChatBubble,
  typingAnimation,
  typingVariant
} from '../components/ui/GlassUI'
import api from '../services/api'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface Suggestion {
  id: string
  title: string
  reason: string
  icon: string
}

export default function CopilotPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi! I\'m your Trip Copilot. Tell me about your travel preferences and I\'ll suggest perfect destinations!', sender: 'ai', timestamp: new Date() }
  ])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' as const, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setLoading(true)

    try {
      const res = await api.post('/api/copilot', {
        preferences: { travel_style: input },
        time: new Date().toISOString(),
        location: { lat: 0, lng: 0 }
      })

      setIsTyping(false)
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: res.suggestion || 'Great choice! Let me find the perfect destination for you.',
        sender: 'ai' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])

      setSuggestions([
        {
          id: '1',
          title: res.suggestion || 'Adventure Awaits',
          reason: res.reason || 'Based on your preferences',
          icon: '🏔️'
        }
      ])
    } catch (e) {
      setIsTyping(false)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <GradientBackground>
      <div className="min-h-screen pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50/30 transition mb-6"
            title="Go back to previous page"
          >
            ← Back
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-blue-500">Trip Intelligence</p>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                  Trip Copilot
                </h1>
                <p className="text-gray-600 mt-2">AI that designs routes, moods, and moments.</p>
              </div>
              <div className="flex gap-3">
                <GlassCard className="px-4 py-3" hover={false}>
                  <p className="text-xs uppercase text-gray-500">Mode</p>
                  <p className="text-sm font-semibold text-slate-900">Adaptive Planner</p>
                </GlassCard>
                <GlassCard className="px-4 py-3" hover={false}>
                  <p className="text-xs uppercase text-gray-500">Latency</p>
                  <p className="text-sm font-semibold text-slate-900">~1.2s</p>
                </GlassCard>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mission Control */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              <GlassCard className="p-6" hover={false}>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Mission Control</p>
                <h3 className="text-lg font-semibold text-slate-900 mt-2">Travel Brief</h3>
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <p>• Trip vibe: curated, premium</p>
                  <p>• Response depth: high</p>
                  <p>• Region focus: India + global</p>
                </div>
                <div className="mt-6 h-2 rounded-full bg-white/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  />
                </div>
              </GlassCard>

              <GlassCard className="p-6" hover={false}>
                <h4 className="text-sm uppercase tracking-[0.3em] text-gray-500">Quick Prompts</h4>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>"3-day luxury trip to Jaipur"</p>
                  <p>"Hidden beaches near Goa"</p>
                  <p>"Family-friendly hill stations"</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <GlassCard className="h-[560px] flex flex-col" hover={false}>
                <div className="flex-1 overflow-y-auto mb-4 pr-4 space-y-3">
                  {messages.map((msg, idx) => (
                    <AIChatBubble
                      key={msg.id}
                      message={msg.text}
                      sender={msg.sender}
                      delay={idx * 0.08}
                    />
                  ))}
                  {isTyping && (
                    <motion.div
                      variants={typingAnimation}
                      initial="hidden"
                      animate="show"
                      className="flex gap-1"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          variants={typingVariant}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                      ))}
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/20">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your dream trip in detail..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <AnimatedButton
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    icon="🛰️"
                    variant="primary"
                  >
                    Send
                  </AnimatedButton>
                </div>
              </GlassCard>
            </motion.div>

            {/* Suggestions Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900">✨ Curated Routes</h3>
              {suggestions.map((sugg) => (
                <GlassCard key={sugg.id} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10" />
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">{sugg.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{sugg.title}</h4>
                    <p className="text-sm text-gray-700">{sugg.reason}</p>
                    <AnimatedButton variant="secondary" className="mt-4 w-full" icon="🧭">
                      Expand Route
                    </AnimatedButton>
                  </div>
                </GlassCard>
              ))}
              {suggestions.length === 0 && (
                <GlassCard className="text-center py-8">
                  <div className="text-4xl mb-2">🧠</div>
                  <p className="text-gray-600">Share a goal to unlock routes</p>
                </GlassCard>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </GradientBackground>
  )
}
