import React, { useState } from 'react'
import api from '../services/api'

export default function CopilotWidget() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  const handleRun = async () => {
    setLoading(true)
    try {
      const payload = { 
        preferences: { travel_style: input }, 
        time: new Date().toISOString(), 
        location: { lat: 0, lng: 0 } 
      }
      const res = await api.post('/api/copilot', payload)
      setResult(res)
    } catch (e) {
      setResult({ error: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl border border-gray-200">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Travel style</label>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="e.g. adventure, leisure, cultural"
        />
      </div>
      <div className="flex gap-3">
        <button 
          onClick={handleRun} 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Get Suggestion'}
        </button>
      </div>
      {result && (
        <div className="mt-6 border-t pt-4">
          {result.error ? (
            <div className="text-red-600 font-medium">{result.error}</div>
          ) : (
            <div>
              <div className="font-bold text-lg text-blue-700 mb-2">💡 Suggestion</div>
              <div className="text-gray-800 mb-3">{result.suggestion || JSON.stringify(result.result || result)}</div>
              <div className="text-sm text-gray-600 italic">
                <span className="font-semibold">Why: </span>{result.reason || 'Based on your preferences'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
