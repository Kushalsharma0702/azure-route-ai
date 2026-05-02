import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  GradientBackground, 
  GlassCard, 
  AnimatedButton,
  ImageCard
} from '../components/ui/GlassUI'
import api from '../services/api'
import indiaLocations from '../data/indiaLocations'

interface Gem {
  id: string
  name: string
  category: string
  location: { lat: number; lng: number }
  reason: string
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop',
]

export default function HiddenGems() {
  const navigate = useNavigate()
  const [gems, setGems] = useState<Gem[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [locationName, setLocationName] = useState('Bengaluru')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await api.post('/api/hidden-gems', {
        location: { lat: 12.97, lng: 77.59 },
        location_name: locationName,
        source: 'reddit'
      })
      const gemsData = (res.gems || [])
      setGems(gemsData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredGems = filter === 'all' ? gems : gems.filter(g => g.category === filter)

  const categoryEmojis: Record<string, string> = {
    'park': '🌳',
    'cafe': '☕',
    'local_cafe': '☕',
    'market': '🏪',
    'hiking': '🥾',
    'historical': '🏛️',
    'restaurant': '🍴',
    'beach': '🏖️',
    'local_tip': '🧭'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <GradientBackground>
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8">
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
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">💎</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hidden Gems
                </h1>
                <p className="text-gray-600 mt-2">Discover underrated destinations locals love</p>
              </div>
            </div>
          </motion.div>

          {/* Location + Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Choose location</label>
                <div className="flex gap-3">
                  <input
                    list="india-location-list"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Search any city in India"
                    className="flex-1 bg-white/20 backdrop-blur border border-white/30 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <AnimatedButton onClick={load} disabled={loading} icon="📍" variant="primary">
                    {loading ? 'Loading' : 'Find'}
                  </AnimatedButton>
                </div>
                <datalist id="india-location-list">
                  {indiaLocations.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {['all', 'park', 'cafe', 'market', 'hiking', 'historical'].map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(category)}
                  className={`
                    px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all
                    ${filter === category
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-white/20 backdrop-blur border border-white/30 text-gray-800 hover:bg-white/30'
                    }
                  `}
                >
                  {category === 'all' ? '✨ All' : `${categoryEmojis[category] || '📍'} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Gems Grid */}
          {loading && !gems.length ? (
            <div className="flex justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-5xl"
              >
                ✨
              </motion.div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {filteredGems.map((gem, idx) => (
                <motion.div key={gem.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <ImageCard
                    image={placeholderImages[idx % placeholderImages.length]}
                    title={gem.name}
                    description={gem.reason}
                    tags={['Hidden Gem', 'Local Favorite']}
                    delay={0}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Details List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📍 Details</h2>
            {filteredGems.map((gem) => (
              <motion.div
                key={gem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover={true}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {categoryEmojis[gem.category] || '📍'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{gem.name}</h3>
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{gem.reason}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          📍 {gem.location.lat.toFixed(3)}, {gem.location.lng.toFixed(3)}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm bg-blue-600/80 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
                        >
                          Explore →
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <AnimatedButton onClick={load} disabled={loading} icon="🔄" variant="secondary">
              {loading ? 'Loading...' : 'Refresh Gems'}
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  )
}
