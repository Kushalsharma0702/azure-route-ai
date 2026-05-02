import React, { useEffect, useState } from 'react'
import api from '../services/api'

interface Gem {
  id: string
  name: string
  category: string
  location: { lat: number; lng: number }
  reason: string
}

interface GemsResponse {
  gems: Gem[]
}

export default function GemsCard() {
  const [gems, setGems] = useState<Gem[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    load()
  }, [])
  
  async function load() {
    setLoading(true)
    try {
      const res = await api.post('/api/hidden-gems', { 
        location: { lat: 12.97, lng: 77.59 } 
      })
      setGems((res as GemsResponse).gems || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'local_cafe': '☕',
      'park': '🌳',
      'restaurant': '🍴',
      'landmark': '🏛️',
      'beach': '🏖️'
    }
    return icons[category] || '📍'
  }
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl border border-gray-200">
      {loading && !gems.length && (
        <div className="flex items-center justify-center py-8 text-gray-600">
          <div className="text-center">
            <div className="text-4xl mb-2">✨</div>
            <div>Loading hidden gems...</div>
          </div>
        </div>
      )}
      
      {!loading && gems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hidden gems found in this area.
        </div>
      )}
      
      {gems.length > 0 && (
        <div className="space-y-4">
          {gems.map((g) => (
            <div key={g.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">
                  {getCategoryIcon(g.category)}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-900">{g.name}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    Category: <span className="capitalize">{g.category.replace('_', ' ')}</span>
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed bg-yellow-50 border-l-3 border-yellow-400 px-3 py-2 rounded">
                    <span className="font-semibold text-yellow-800">Why it's special:</span> {g.reason}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    📍 {g.location.lat.toFixed(3)}, {g.location.lng.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={load}
        className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? '⏳ Refreshing...' : '🔄 See More Gems'}
      </button>
    </div>
  )
}
