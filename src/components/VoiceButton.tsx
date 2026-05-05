import React, { useState } from 'react'
import api from '../services/api'

interface VoiceResponse {
  intent: string
  action: string
  params: Record<string, any>
  response_text: string
  error?: string
}

export default function VoiceButton() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [resp, setResp] = useState<VoiceResponse | null>(null)

  const handleSend = async () => {
    if (!text.trim()) return
    
    setLoading(true)
    try {
      const res = await api.post('/api/v1/voice', { text })
      setResp(res as VoiceResponse)
    } catch (e) {
      setResp({ error: (e as Error).message, intent: '', action: '', params: {}, response_text: '' })
    } finally {
      setLoading(false)
    }
  }

  const getIntentIcon = (intent: string) => {
    const icons: Record<string, string> = {
      'hotel': '🏨',
      'food': '🍽️',
      'travel': '✈️',
      'unknown': '❓'
    }
    return icons[intent] || '💬'
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl border border-gray-200">
      <textarea 
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
        rows={4} 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Type your travel query... e.g., 'Find me a hotel in Bangalore' or 'Where can I eat Italian food?'"
      />
      <div className="flex gap-3 mt-4">
        <button 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
          onClick={handleSend} 
          disabled={loading || !text.trim()}
        >
          {loading ? '⏳ Processing...' : '🎤 Send'}
        </button>
        <button 
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium transition"
          onClick={() => setText('')}
        >
          Clear
        </button>
      </div>
      
      {resp && (
        <div className="mt-6 border-t pt-4">
          {resp.error ? (
            <div className="text-red-600 font-medium">{resp.error}</div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{getIntentIcon(resp.intent)}</span>
                <div>
                  <div className="font-bold text-gray-900">Intent: <span className="text-blue-600">{resp.intent}</span></div>
                  <div className="text-sm text-gray-600">Action: {resp.action}</div>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
                <div className="text-gray-800">{resp.response_text}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
