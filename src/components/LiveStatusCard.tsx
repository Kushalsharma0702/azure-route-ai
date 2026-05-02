import React, { useEffect, useState } from 'react'
import api from '../services/api'

interface LiveStatus {
  place_id: number
  crowd: string
  noise: string
  waiting_time: number
  timestamp: string
  source: string
}

export default function LiveStatusCard({ placeId }: { placeId: number }) {
  const [data, setData] = useState<LiveStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/api/live-status/?place_id=${placeId}`)
        if (!mounted) return
        setData(res as LiveStatus)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }
    
    load()
    const iv = setInterval(load, 15000)
    
    return () => {
      mounted = false
      clearInterval(iv)
    }
  }, [placeId])

  const getCrowdColor = (level: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  if (loading && !data) return <div className="p-4 bg-white shadow-lg rounded-lg text-gray-600">Loading live metrics...</div>
  if (error) return <div className="p-4 bg-white shadow-lg rounded-lg text-red-600 font-medium">{error}</div>
  if (!data) return null

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-bold text-blue-700">📍 Place {placeId}</div>
        <div className="text-xs text-gray-500">{new Date(data.timestamp).toLocaleTimeString()}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xs text-gray-600 font-medium mb-1">Crowd Level</div>
          <div className={`px-3 py-1 rounded font-bold text-sm ${getCrowdColor(data.crowd)}`}>
            {data.crowd}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 font-medium mb-1">Noise Level</div>
          <div className={`px-3 py-1 rounded font-bold text-sm ${getCrowdColor(data.noise)}`}>
            {data.noise}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 font-medium mb-1">Wait Time</div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-bold text-sm">
            {data.waiting_time}m
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 text-center">Source: {data.source}</div>
    </div>
  )
}
