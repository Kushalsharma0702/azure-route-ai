import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Star, ExternalLink, Navigation, Clock, Ticket, ChevronDown,
  Filter, Search, Compass, Sparkles, Map, ArrowRight, RefreshCw
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import api from '../services/api'

interface City {
  name: string; tourist_locations: string[]; gems_count: number
}
interface Gem {
  id: string; name: string; category: string; description: string
  best_time: string; entry: string; rating: number
  location: { lat: number; lng: number }
  google_maps_url: string; google_maps_directions: string; city: string
}

const CATEGORY_META: Record<string, { emoji: string; label: string; color: string }> = {
  historical: { emoji: '🏛️', label: 'Historical', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  nature: { emoji: '🌿', label: 'Nature', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cafe: { emoji: '☕', label: 'Café', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  hiking: { emoji: '🥾', label: 'Hiking', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  market: { emoji: '🏪', label: 'Market', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  art: { emoji: '🎨', label: 'Art', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  spiritual: { emoji: '🕉️', label: 'Spiritual', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
}

export default function HiddenGems() {
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [gems, setGems] = useState<Gem[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [touristLocations, setTouristLocations] = useState<string[]>([])

  // Load cities on mount
  useEffect(() => {
    api.request('/api/v1/gems/cities')
      .then((data: any) => {
        setCities(data.cities || [])
        if (data.cities?.length) {
          const defaultCity = data.cities[0].name
          setSelectedCity(defaultCity)
          setTouristLocations(data.cities[0].tourist_locations || [])
          loadGems(defaultCity)
        }
      })
      .catch(console.error)
  }, [])

  const loadGems = async (city: string, location?: string, category?: string) => {
    setLoading(true)
    try {
      let url = `/api/v1/gems/discover?city=${encodeURIComponent(city)}`
      if (location) url += `&location=${encodeURIComponent(location)}`
      if (category && category !== 'all') url += `&category=${encodeURIComponent(category)}`
      const data: any = await api.request(url)
      setGems(data.gems || [])
      if (data.tourist_locations) setTouristLocations(data.tourist_locations)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    setSelectedLocation('')
    setCategoryFilter('all')
    const c = cities.find(c => c.name === city)
    setTouristLocations(c?.tourist_locations || [])
    loadGems(city)
  }

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc)
    loadGems(selectedCity, loc, categoryFilter)
  }

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat)
    loadGems(selectedCity, selectedLocation, cat)
  }

  const uniqueCategories = ['all', ...new Set(gems.map(g => g.category))]
  const filteredGems = categoryFilter === 'all' ? gems : gems.filter(g => g.category === categoryFilter)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16 mb-8">
          <div className="container max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Hidden Gems of India</h1>
                  <p className="text-white/70 mt-1">Curated off-the-beaten-path spots that locals love — with Google Maps directions</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container max-w-6xl">
          {/* City + Location Selector */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-border/50 shadow-sm p-6 mb-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* City Dropdown */}
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-2 uppercase tracking-wider">
                  <MapPin className="w-3 h-3 inline mr-1" /> Select City *
                </label>
                <select value={selectedCity} onChange={e => handleCityChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:outline-none transition">
                  {cities.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.gems_count} gems)
                    </option>
                  ))}
                </select>
              </div>

              {/* Tourist Location Sub-menu */}
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-2 uppercase tracking-wider">
                  <Compass className="w-3 h-3 inline mr-1" /> Near Tourist Spot (optional)
                </label>
                <select value={selectedLocation} onChange={e => handleLocationChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:outline-none transition">
                  <option value="">All areas in {selectedCity}</option>
                  {touristLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {uniqueCategories.map(cat => {
                const meta = CATEGORY_META[cat]
                return (
                  <button key={cat} onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                      categoryFilter === cat
                        ? 'bg-primary text-white border-primary shadow-md'
                        : meta ? meta.color : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted'
                    }`}>
                    {cat === 'all' ? '✨ All' : `${meta?.emoji || '📍'} ${meta?.label || cat}`}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-extrabold">
              {filteredGems.length} Hidden Gem{filteredGems.length !== 1 ? 's' : ''} in {selectedCity}
            </h2>
            <button onClick={() => loadGems(selectedCity, selectedLocation, categoryFilter)}
              disabled={loading}
              className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition">
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Gems Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-border/50 p-6 animate-pulse">
                  <div className="h-5 bg-muted rounded w-2/3 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredGems.map((gem, i) => {
                  const meta = CATEGORY_META[gem.category] || { emoji: '📍', label: gem.category, color: 'bg-muted text-muted-foreground border-border' }
                  return (
                    <motion.div key={gem.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${meta.color}`}>
                                {meta.emoji} {meta.label}
                              </span>
                              <div className="flex items-center gap-0.5 text-xs text-amber-500">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {gem.rating}
                              </div>
                            </div>
                            <h3 className="font-extrabold text-lg leading-tight">{gem.name}</h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{gem.description}</p>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                          {gem.best_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {gem.best_time}
                            </span>
                          )}
                          {gem.entry && (
                            <span className="flex items-center gap-1">
                              <Ticket className="w-3 h-3" /> {gem.entry}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a href={gem.google_maps_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition shadow-sm">
                            <Map className="w-3.5 h-3.5" /> Open in Google Maps
                          </a>
                          <a href={gem.google_maps_directions} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-xs font-semibold hover:bg-muted transition"
                            title="Get directions">
                            <Navigation className="w-3.5 h-3.5" /> Directions
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {filteredGems.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-lg mb-2">No gems found</h3>
              <p className="text-muted-foreground text-sm">Try selecting a different city or category</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
