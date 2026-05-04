import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, MapPin, Hotel, Utensils, Compass, CloudRain, Sun, Snowflake,
  DollarSign, Calendar, Users, RefreshCw, ChevronRight, Star, Sparkles,
  MessageCircle, Zap, Map, ArrowRight
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import api from '@/services/api'

/* ─── Types ─── */
interface ChatMessage {
  id: string; role: 'user' | 'ai'; content: string; timestamp: Date; plan?: TripPlan | null
}
interface TripPlan {
  destination: string; state: string; duration: string; days: number
  trip_type: string; travelers: number
  budget: { total: number; per_day: number; hotel: number; hotel_per_night: number
    food: number; food_per_day: number; activities: number; activities_per_day: number; transport: number }
  itinerary: { day: number; title: string; activities: string[]; food_suggestions: string[]; estimated_cost: number }[]
  hotel_recommendations: { hotel_id: string | null; name: string; city: string; rating: number
    price: number; image: string; amenities: string[]; source: string }[]
  weather_alerts: { type: string; icon: string; title: string; message: string }[]
  weather: { temperature: number; humidity: number; rain_probability: number } | null
  local_food: string[]
}

const QUICK_PROMPTS = [
  { text: "Plan a 3-day Goa trip under ₹15k", icon: "🏖️" },
  { text: "Romantic 5-day Kerala trip", icon: "💕" },
  { text: "Family trip to Jaipur, budget ₹20,000", icon: "👨‍👩‍👧" },
  { text: "Adventure in Rishikesh for 2 days", icon: "🏔️" },
  { text: "3-day Manali trip, luxury", icon: "❄️" },
  { text: "Spiritual trip to Varanasi for 4 days", icon: "🕉️" },
]

/* ─── Components ─── */

function ItineraryTimeline({ itinerary }: { itinerary: TripPlan['itinerary'] }) {
  return (
    <div className="space-y-4">
      {itinerary.map((day, i) => (
        <motion.div key={day.day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
              D{day.day}
            </div>
            {i < itinerary.length - 1 && <div className="w-0.5 flex-1 bg-primary/20 mt-2" />}
          </div>
          <div className="flex-1 pb-6">
            <h4 className="font-bold text-sm mb-2">{day.title}</h4>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {day.activities.map((a, j) => (
                <span key={j} className="text-xs px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-foreground">
                  {a}
                </span>
              ))}
            </div>
            {day.food_suggestions?.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Utensils className="w-3 h-3" /> Must try: {day.food_suggestions.join(', ')}
              </div>
            )}
            {day.estimated_cost > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                <DollarSign className="w-3 h-3 inline" /> ~₹{day.estimated_cost.toLocaleString()}/day
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function HotelCards({ hotels, days }: { hotels: TripPlan['hotel_recommendations']; days: number }) {
  return (
    <div className="grid gap-3">
      {hotels.map((h, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all"
        >
          <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
            {h.image ? <img src={h.image} alt={h.name} className="w-full h-full object-cover rounded-xl" />
              : <Hotel className="w-6 h-6 text-primary/40" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm truncate">{h.name}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              {h.city && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{h.city}</span>}
              <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{h.rating}</span>
            </div>
            {h.amenities?.length > 0 && (
              <div className="flex gap-1 mt-1">
                {h.amenities.slice(0, 3).map(a => (
                  <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{a}</span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="font-extrabold text-primary">₹{h.price.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">/night</div>
            {h.hotel_id ? (
              <Link to={`/hotels/${h.hotel_id}`}
                className="text-[10px] px-2 py-1 mt-1 inline-block bg-primary text-white rounded-lg font-semibold hover:opacity-90">
                Book →
              </Link>
            ) : (
              <span className="text-[10px] text-muted-foreground italic">Estimated</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function BudgetBreakdown({ budget }: { budget: TripPlan['budget'] }) {
  const items = [
    { label: 'Hotel', value: budget.hotel, pct: 50, color: 'bg-blue-500', icon: '🏨' },
    { label: 'Food', value: budget.food, pct: 20, color: 'bg-emerald-500', icon: '🍽️' },
    { label: 'Activities', value: budget.activities, pct: 20, color: 'bg-purple-500', icon: '🎯' },
    { label: 'Transport', value: budget.transport, pct: 10, color: 'bg-amber-500', icon: '🚗' },
  ]
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Total Budget</span>
        <span className="text-lg font-extrabold text-primary">₹{budget.total.toLocaleString()}</span>
      </div>
      <div className="h-3 rounded-full bg-muted/50 flex overflow-hidden">
        {items.map(it => (
          <motion.div key={it.label} initial={{ width: 0 }}
            animate={{ width: `${it.pct}%` }} transition={{ duration: 0.8 }}
            className={`h-full ${it.color}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(it => (
          <div key={it.label} className="flex items-center gap-2 text-xs">
            <span>{it.icon}</span>
            <span className="text-muted-foreground">{it.label}</span>
            <span className="font-bold ml-auto">₹{it.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeatherAlerts({ alerts }: { alerts: TripPlan['weather_alerts'] }) {
  if (!alerts?.length) return null
  return (
    <div className="space-y-2">
      {alerts.slice(0, 3).map((a, i) => (
        <div key={i} className={`p-3 rounded-xl text-xs border ${
          a.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          a.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
          'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span className="font-bold">{a.icon} {a.title}</span>
          <p className="mt-0.5 opacity-80">{a.message}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Full Trip Plan Panel ─── */
function TripPlanPanel({ plan, onRegenerate }: { plan: TripPlan; onRegenerate: () => void }) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'budget'>('itinerary')

  return (
    <div className="space-y-4">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> {plan.destination}
              <span className="text-xs font-normal text-muted-foreground">{plan.state}</span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{plan.duration}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{plan.travelers} traveler(s)</span>
              <span className="capitalize px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{plan.trip_type}</span>
            </div>
          </div>
          <button onClick={onRegenerate}
            className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-white border border-border hover:bg-muted transition text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
        </div>
        {plan.weather && (
          <div className="flex items-center gap-4 text-xs mt-2 p-2 rounded-lg bg-white/60">
            <span className="flex items-center gap-1">
              {plan.weather.temperature > 30 ? <Sun className="w-3.5 h-3.5 text-amber-500" /> :
               plan.weather.temperature < 10 ? <Snowflake className="w-3.5 h-3.5 text-blue-400" /> :
               <CloudRain className="w-3.5 h-3.5 text-slate-500" />}
              {plan.weather.temperature}°C
            </span>
            <span>💧 {plan.weather.humidity}% humidity</span>
            <span>🌧️ {plan.weather.rain_probability}% rain chance</span>
          </div>
        )}
      </div>

      {/* Weather Alerts */}
      <WeatherAlerts alerts={plan.weather_alerts} />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
        {([['itinerary', '📋 Itinerary'], ['hotels', '🏨 Hotels'], ['budget', '💰 Budget']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === key ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}>{label}</button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'itinerary' && (
          <motion.div key="itin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ItineraryTimeline itinerary={plan.itinerary} />
            {plan.local_food?.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                <h4 className="text-sm font-bold text-orange-800 mb-2">🍛 Must-Try Local Food</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.local_food.map(f => (
                    <span key={f} className="text-xs px-2 py-1 rounded-lg bg-white border border-orange-200 text-orange-700">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
        {activeTab === 'hotels' && (
          <motion.div key="htl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HotelCards hotels={plan.hotel_recommendations} days={plan.days} />
          </motion.div>
        )}
        {activeTab === 'budget' && (
          <motion.div key="bdg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BudgetBreakdown budget={plan.budget} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main Page ─── */
export default function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'ai', content: "👋 Hey! I'm your **Trip Copilot** — your AI travel planner.\n\nTell me where you want to go and I'll create a complete trip plan with day-wise itinerary, hotel picks, budget breakdown, and weather alerts!\n\n**Try:** \"Plan a 3-day Goa trip under ₹15k\"", timestamp: new Date(), plan: null }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activePlan, setActivePlan] = useState<TripPlan | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date(), plan: null }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const chatHistory = [...messages.filter(m => m.role === 'user').map(m => ({ role: 'user', content: m.content })),
        { role: 'user', content: msg }]

      const res: any = await api.request('/api/v1/trip/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: chatHistory }),
      })

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'ai',
        content: res.reply || "I couldn't process that. Try something like 'Plan a 3-day Goa trip'",
        timestamp: new Date(), plan: res.plan || null,
      }
      setMessages(prev => [...prev, aiMsg])
      if (res.plan) setActivePlan(res.plan)
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'ai',
        content: "⚠️ Sorry, something went wrong. Please try again.",
        timestamp: new Date(), plan: null,
      }])
    }
    setLoading(false)
  }

  const regenerate = () => {
    if (activePlan) sendMessage(`Plan a ${activePlan.days}-day ${activePlan.destination} trip`)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Trip Copilot</h1>
                <p className="text-muted-foreground text-sm">AI-powered travel planner with real-time insights</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ─── LEFT: Chat Panel ─── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-border/50 shadow-sm flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.map(msg => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-muted/50 border border-border/50 text-foreground rounded-bl-md'
                      }`}>
                        {msg.content.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line.startsWith('**') && line.endsWith('**')
                              ? <strong>{line.replace(/\*\*/g, '')}</strong>
                              : line.replace(/\*\*(.*?)\*\*/g, '').length !== line.length
                              ? <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                              : line}
                            {i < msg.content.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                        {msg.plan && (
                          <div className="mt-2 text-xs opacity-70 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Trip plan generated — see details →
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 rounded-2xl bg-muted/50 border border-border/50 rounded-bl-md">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                              className="w-2 h-2 bg-primary/50 rounded-full" />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length <= 1 && (
                  <div className="px-5 pb-3">
                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Quick Prompts</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((p, i) => (
                        <button key={i} onClick={() => sendMessage(p.text)}
                          className="text-xs px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition text-foreground">
                          {p.icon} {p.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border/30">
                  <div className="flex gap-2">
                    <input value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Plan a 3-day Goa trip under ₹15k..."
                      disabled={loading}
                      className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-50"
                    />
                    <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                      className="px-5 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 shadow-md">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: Trip Plan Panel ─── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-6 overflow-y-auto" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
                {activePlan ? (
                  <TripPlanPanel plan={activePlan} onRegenerate={regenerate} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-6">
                      <Map className="w-10 h-10 text-primary/30" />
                    </div>
                    <h3 className="text-xl font-extrabold mb-2">Your Trip Plan Appears Here</h3>
                    <p className="text-muted-foreground text-sm max-w-md mb-8">
                      Send a message in the chat to generate a complete trip plan with itinerary, hotels, budget, and weather alerts.
                    </p>
                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                      {[
                        { icon: "📋", label: "Day-wise Itinerary" },
                        { icon: "🏨", label: "Hotel Recommendations" },
                        { icon: "💰", label: "Budget Breakdown" },
                        { icon: "🌤️", label: "Weather Alerts" },
                      ].map((f, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/30 text-xs">
                          <span className="text-lg">{f.icon}</span>
                          <span className="text-muted-foreground">{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
