import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, TrendingUp, Hotel, MessageSquare, ThumbsUp, ChevronDown, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import api, { auth, feedback } from '../services/api'
import Navbar from '../components/Navbar'

/* ────────────────────────── Types ────────────────────────── */

interface DashboardData {
  global: { total_reviews: number; hotels_reviewed: number; platform_avg: number }
  hotels: { hotel_id: number; hotel_name: string; total_reviews: number; avg_score: number; avg_cleanliness: number; avg_service: number; avg_amenities: number; recommend_pct: number }[]
  recent_reviews: { id: number; hotel_name: string; overall_score: number; review_text: string; user_name: string; missing_amenities: string[]; created_at: string }[]
}

const AMENITIES_LIST = [
  "Free WiFi", "Swimming Pool", "Gym/Fitness Center", "Spa & Wellness",
  "Restaurant", "Room Service", "Airport Shuttle", "Parking",
  "Air Conditioning", "Laundry Service", "Business Center", "Bar/Lounge",
  "Kids Play Area", "Pet Friendly", "EV Charging"
]

/* ───────────────────── Score Badge Helper ───────────────── */

function ScoreBadge({ score, size = 'md' }: { score: number | null; size?: 'sm' | 'md' | 'lg' }) {
  if (score === null || score === undefined) return <span className="text-muted-foreground text-xs">N/A</span>
  const s = Number(score)
  const color = s >= 8 ? 'bg-emerald-500' : s >= 6 ? 'bg-amber-500' : s >= 4 ? 'bg-orange-500' : 'bg-red-500'
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-lg', lg: 'w-20 h-20 text-3xl' }
  return (
    <div className={`${sizes[size]} ${color} rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg`}>
      {s}
    </div>
  )
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5,6,7,8,9,10].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)}
          className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${i <= value ? 'bg-primary text-white shadow-md scale-105' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
        >{i}</button>
      ))}
    </div>
  )
}

/* ────────────────────────── Main Page ────────────────────── */

export default function LiveRealityPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'dashboard' | 'feedback'>('dashboard')
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hotelsList, setHotelsList] = useState<{id: number; name: string; city: string}[]>([])

  // Feedback form state
  const [hotelId, setHotelId] = useState('')
  const [hotelName, setHotelName] = useState('')
  const [overallScore, setOverallScore] = useState(7)
  const [cleanlinessScore, setCleanlinessScore] = useState(7)
  const [serviceScore, setServiceScore] = useState(7)
  const [amenitiesScore, setAmenitiesScore] = useState(7)
  const [locationScore, setLocationScore] = useState(7)
  const [valueScore, setValueScore] = useState(7)
  const [promisedAmenities, setPromisedAmenities] = useState<string[]>([])
  const [deliveredAmenities, setDeliveredAmenities] = useState<string[]>([])
  const [reviewText, setReviewText] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const res = await feedback.dashboard()
      setDashboard(res)
    } catch (e: any) { toast.error(e.message) }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboard()
    // Fetch hotels list for the dropdown
    api.request('/api/v1/hotels?limit=100')
      .then((data: any) => setHotelsList(Array.isArray(data) ? data : []))
      .catch(() => {
        // Fallback: try hotel rooms
        api.request('/api/v1/hotel/rooms')
          .then((data: any) => {
            const rooms = Array.isArray(data) ? data : []
            setHotelsList(rooms.map((r: any) => ({ id: r.id, name: r.name, city: '' })))
          }).catch(() => {})
      })
  }, [])

  const toggleAmenity = (list: string[], setList: (v: string[]) => void, amenity: string) => {
    setList(list.includes(amenity) ? list.filter(a => a !== amenity) : [...list, amenity])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hotelName.trim()) { toast.error("Please enter the hotel name"); return }
    setSubmitting(true)
    const user = auth.getUser()
    const missingAmenities = promisedAmenities.filter(a => !deliveredAmenities.includes(a))
    try {
      await feedback.submit({
        hotel_id: Number(hotelId) || 1,
        hotel_name: hotelName,
        overall_score: overallScore,
        cleanliness_score: cleanlinessScore,
        service_score: serviceScore,
        amenities_score: amenitiesScore,
        location_score: locationScore,
        value_score: valueScore,
        promised_amenities: promisedAmenities,
        delivered_amenities: deliveredAmenities,
        missing_amenities: missingAmenities,
        review_text: reviewText,
        pros, cons,
        would_recommend: wouldRecommend,
        user_id: user?.id,
        user_name: user?.name,
        user_email: user?.email,
      })
      toast.success("Thank you! Your feedback has been submitted.")
      setTab('dashboard')
      fetchDashboard()
    } catch (e: any) { toast.error(e.message) }
    setSubmitting(false)
  }

  const inp = "w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Live Reality Layer</h1>
              <p className="text-muted-foreground">Real traveler feedback powering honest hotel scores</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-border/50 p-1 shadow-sm">
            <button onClick={() => setTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'dashboard' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
              📊 Dashboard
            </button>
            <button onClick={() => setTab('feedback')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'feedback' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
              ✍️ Give Feedback
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'dashboard' ? (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {loading ? (
                <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" /></div>
              ) : !dashboard || dashboard.global.total_reviews === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-border/50 shadow-sm">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-6">Be the first to submit a hotel review and help future travelers!</p>
                  <button onClick={() => setTab('feedback')} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-glow hover:opacity-90 transition">
                    ✍️ Submit First Review
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Global Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 flex items-center gap-5">
                      <ScoreBadge score={dashboard.global.platform_avg} size="lg" />
                      <div>
                        <p className="text-muted-foreground text-sm">Platform Average</p>
                        <p className="text-2xl font-extrabold">{dashboard.global.platform_avg}/10</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Total Reviews</p>
                        <p className="text-2xl font-extrabold">{dashboard.global.total_reviews}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                        <Hotel className="w-7 h-7 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Hotels Reviewed</p>
                        <p className="text-2xl font-extrabold">{dashboard.global.hotels_reviewed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Per-Hotel Scores */}
                  {dashboard.hotels.length > 0 && (
                    <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8">
                      <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2"><Hotel className="w-5 h-5 text-primary" /> Hotel Reality Scores</h2>
                      <div className="space-y-4">
                        {dashboard.hotels.map(h => (
                          <div key={h.hotel_id} className="flex items-center gap-5 p-4 rounded-2xl bg-muted/30 border border-border/30">
                            <ScoreBadge score={h.avg_score} />
                            <div className="flex-1">
                              <h3 className="font-bold">{h.hotel_name}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                                <span>🧹 Clean: {h.avg_cleanliness ?? '-'}</span>
                                <span>🛎️ Service: {h.avg_service ?? '-'}</span>
                                <span>🏊 Amenities: {h.avg_amenities ?? '-'}</span>
                                <span>👍 {h.recommend_pct ?? 0}% recommend</span>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{h.total_reviews} reviews</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Reviews */}
                  {dashboard.recent_reviews.length > 0 && (
                    <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8">
                      <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Recent Reviews</h2>
                      <div className="space-y-4">
                        {dashboard.recent_reviews.map(r => (
                          <div key={r.id} className="p-4 rounded-2xl bg-muted/30 border border-border/30">
                            <div className="flex items-center gap-3 mb-2">
                              <ScoreBadge score={r.overall_score} size="sm" />
                              <div>
                                <span className="font-bold text-sm">{r.hotel_name}</span>
                                <span className="text-xs text-muted-foreground ml-2">by {r.user_name || 'Anonymous'}</span>
                              </div>
                            </div>
                            {r.review_text && <p className="text-sm text-muted-foreground mb-2">{r.review_text}</p>}
                            {r.missing_amenities && r.missing_amenities.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-amber-600">
                                <AlertTriangle className="w-3 h-3" />
                                Missing: {r.missing_amenities.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            /* ─────────────── FEEDBACK FORM ──────────────── */
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hotel Info */}
                <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8">
                  <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2"><Hotel className="w-5 h-5 text-primary" /> Hotel Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground block mb-1">Hotel Name *</label>
                      <input required value={hotelName} onChange={e => setHotelName(e.target.value)} placeholder="e.g. Taj Lake Palace" className={inp} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground block mb-1">Hotel ID (optional)</label>
                      <input value={hotelId} onChange={e => setHotelId(e.target.value)} placeholder="From your booking" className={inp} />
                    </div>
                  </div>
                </div>

                {/* Scores */}
                <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8">
                  <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Rate Your Experience (1-10)</h2>
                  <div className="space-y-5">
                    {[
                      { label: "Overall Experience", value: overallScore, set: setOverallScore },
                      { label: "Cleanliness", value: cleanlinessScore, set: setCleanlinessScore },
                      { label: "Staff & Service", value: serviceScore, set: setServiceScore },
                      { label: "Amenities", value: amenitiesScore, set: setAmenitiesScore },
                      { label: "Location", value: locationScore, set: setLocationScore },
                      { label: "Value for Money", value: valueScore, set: setValueScore },
                    ].map(item => (
                      <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="text-sm font-semibold w-40 shrink-0">{item.label}</span>
                        <StarRating value={item.value} onChange={item.set} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities Check */}
                <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8">
                  <h2 className="text-xl font-extrabold mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Amenities Reality Check</h2>
                  <p className="text-sm text-muted-foreground mb-6">Select what the hotel <strong>promised</strong> at booking time, and what was <strong>actually delivered</strong>.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-600 mb-3">✅ Promised at Booking</h3>
                      <div className="flex flex-wrap gap-2">
                        {AMENITIES_LIST.map(a => (
                          <button key={a} type="button" onClick={() => toggleAmenity(promisedAmenities, setPromisedAmenities, a)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${promisedAmenities.includes(a) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-muted/30 border-border/50 hover:border-emerald-300'}`}
                          >{a}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-blue-600 mb-3">🏨 Actually Delivered</h3>
                      <div className="flex flex-wrap gap-2">
                        {AMENITIES_LIST.map(a => (
                          <button key={a} type="button" onClick={() => toggleAmenity(deliveredAmenities, setDeliveredAmenities, a)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${deliveredAmenities.includes(a) ? 'bg-blue-500 text-white border-blue-500' : 'bg-muted/30 border-border/50 hover:border-blue-300'}`}
                          >{a}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Show missing */}
                  {promisedAmenities.filter(a => !deliveredAmenities.includes(a)).length > 0 && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-sm font-bold text-amber-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Missing Amenities ({promisedAmenities.filter(a => !deliveredAmenities.includes(a)).length})
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {promisedAmenities.filter(a => !deliveredAmenities.includes(a)).map(a => (
                          <span key={a} className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-medium">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Written Review */}
                <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8">
                  <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Your Review</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground block mb-1">Detailed Review</label>
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience in detail..." className={`${inp} min-h-[120px]`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-emerald-600 block mb-1">👍 Pros</label>
                        <textarea value={pros} onChange={e => setPros(e.target.value)} placeholder="What did you like?" className={`${inp} min-h-[80px]`} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-red-500 block mb-1">👎 Cons</label>
                        <textarea value={cons} onChange={e => setCons(e.target.value)} placeholder="What could be improved?" className={`${inp} min-h-[80px]`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold">Would you recommend this hotel?</label>
                      <button type="button" onClick={() => setWouldRecommend(!wouldRecommend)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${wouldRecommend ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                      >{wouldRecommend ? '👍 Yes' : '👎 No'}</button>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button type="submit" disabled={submitting}
                    className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold shadow-glow hover:opacity-90 transition-all flex items-center gap-2 text-lg disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Feedback</>}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
