import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  GradientBackground, 
  GlassCard, 
  AnimatedButton, 
  MetricCard,
  LiveIndicator
} from '../components/ui/GlassUI'
import api from '../services/api'

interface LiveStatus {
  place_id: number
  crowd: string
  noise: string
  waiting_time: number
  timestamp: string
  source: string
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

export default function LiveStatusPage() {
  const navigate = useNavigate()
  const [placeId, setPlaceId] = useState(1)
  const [data, setData] = useState<LiveStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/api/live-status/?place_id=${placeId}`)
      setData(res as LiveStatus)
      setLastUpdate(new Date())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 15000)
    return () => clearInterval(interval)
  }, [placeId])

  const getCrowdColor = (level: string): 'green' | 'yellow' | 'red' | 'blue' => {
    const colorMap: Record<string, 'green' | 'yellow' | 'red' | 'blue'> = {
      'Low': 'green',
      'Medium': 'yellow',
      'High': 'red',
      'Unknown': 'blue'
    }
    return colorMap[level] || 'blue'
  }

  return (
    <GradientBackground>
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-5xl">📍</span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Live Reality Layer
                  </h1>
                  <p className="text-gray-600 mt-2">Real-time analytics dashboard</p>
                </div>
              </div>
              <LiveIndicator />
            </div>
          </motion.div>

          {/* Location Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex gap-4 items-end"
          >
            <GlassCard className="flex-1 max-w-xs p-4" hover={false}>
              <label className="block text-sm font-medium text-gray-900 mb-2">Select Location</label>
              <input 
                type="number" 
                value={placeId} 
                onChange={(e) => setPlaceId(Number(e.target.value))} 
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </GlassCard>
            <AnimatedButton onClick={loadData} disabled={loading} icon="🔄" variant="secondary">
              Refresh
            </AnimatedButton>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-500/20 border border-red-200/30 rounded-2xl text-red-600 backdrop-blur"
            >
              {error}
            </motion.div>
          )}

          {/* Main Metrics */}
          {data && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Headline Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  icon="👥"
                  label="Crowd Level"
                  value={data.crowd}
                  color={getCrowdColor(data.crowd)}
                  delay={0}
                />
                <MetricCard
                  icon="🔊"
                  label="Noise Level"
                  value={data.noise}
                  color={getCrowdColor(data.noise)}
                  delay={0.1}
                />
                <MetricCard
                  icon="⏱️"
                  label="Wait Time"
                  value={`${data.waiting_time}m`}
                  color="blue"
                  delay={0.2}
                />
              </div>

              {/* Detailed Analysis */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Analysis</h3>
                  <div className="space-y-6">
                    {/* Crowd Analysis */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-800">Crowd Level Progress</span>
                        <span className="text-sm text-gray-600">{data.crowd}</span>
                      </div>
                      <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: data.crowd === 'Low' ? '33%' : data.crowd === 'Medium' ? '66%' : '100%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            data.crowd === 'Low' ? 'bg-green-500' : 
                            data.crowd === 'Medium' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Noise Analysis */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-800">Noise Level Progress</span>
                        <span className="text-sm text-gray-600">{data.noise}</span>
                      </div>
                      <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: data.noise === 'Low' ? '33%' : data.noise === 'Medium' ? '66%' : '100%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            data.noise === 'Low' ? 'bg-green-500' : 
                            data.noise === 'Medium' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Wait Time Analysis */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-800">Estimated Wait Time</span>
                        <span className="text-sm text-gray-600">{data.waiting_time} minutes</span>
                      </div>
                      <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((data.waiting_time / 60) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center text-sm text-gray-600"
              >
                Last updated: {lastUpdate.toLocaleTimeString()}
                <div className="text-xs mt-1">Auto-refresh every 15 seconds</div>
              </motion.div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && !data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-4xl"
              >
                ⏳
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </GradientBackground>
  )
}
