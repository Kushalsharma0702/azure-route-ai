import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GradientBackground,
  GlassCard,
  AnimatedButton,
  AIChatBubble,
} from '../components/ui/GlassUI'
import api from '../services/api'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const languageOptions = [
  { label: 'Auto Detect', value: 'auto' },
  { label: 'English (India)', value: 'en-IN' },
  { label: 'Hindi', value: 'hi-IN' },
  { label: 'Bengali', value: 'bn-IN' },
  { label: 'Tamil', value: 'ta-IN' },
  { label: 'Telugu', value: 'te-IN' },
  { label: 'Kannada', value: 'kn-IN' },
  { label: 'Malayalam', value: 'ml-IN' },
  { label: 'Marathi', value: 'mr-IN' },
  { label: 'Gujarati', value: 'gu-IN' },
  { label: 'Punjabi', value: 'pa-IN' },
  { label: 'Odia', value: 'or-IN' },
]

const VoiceOrb: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="relative w-36 h-36">
    <motion.div
      animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/50 to-blue-600/60 blur-xl"
    />
    <motion.div
      animate={active ? { scale: [1, 1.18, 1] } : { scale: 1 }}
      transition={{ duration: 1.6, repeat: Infinity, delay: 0.2 }}
      className="absolute inset-2 rounded-full border border-cyan-200/50"
    />
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={
        `absolute inset-4 rounded-full flex items-center justify-center text-4xl shadow-2xl ` +
        (active
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
          : 'bg-gradient-to-r from-slate-900 to-blue-700')
      }
    >
      {active ? '🔊' : '🎙️'}
    </motion.button>
  </div>
)

export default function VoiceAssistant() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I can help you plan a trip in your language. Ask me anything.',
    },
  ])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('auto')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  const status = useMemo(() => {
    if (isListening) return 'Listening'
    if (isProcessing) return 'Processing'
    if (isSpeaking) return 'Speaking'
    return 'Ready'
  }, [isListening, isProcessing, isSpeaking])

  const handleMicClick = () => {
    if (isListening) {
      // stop recording
      stopRecording()
    } else {
      startRecording()
    }
    setIsListening((prev) => !prev)
  }

  const startRecording = async () => {
    try {
      setIsProcessing(false)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      recordedChunksRef.current = []
      const options: MediaRecorderOptions = { mimeType: 'audio/webm' }
      const mr = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mr

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
      }

      mr.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' })
        // create a file and send to STT
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'audio/webm' })
        await sendAudioForTranscription(file)
        // cleanup
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
        mediaRecorderRef.current = null
        recordedChunksRef.current = []
        setIsListening(false)
      }

      mr.start()
      setIsListening(true)
    } catch (err) {
      console.error('Microphone access error', err)
      setIsListening(false)
    }
  }

  const stopRecording = () => {
    try {
      mediaRecorderRef.current?.stop()
    } catch (e) {
      console.warn('stopRecording error', e)
    }
  }

  const sendAudioForTranscription = async (file: File) => {
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      // optionally include language hint
      if (language !== 'auto') form.append('language', language)

      const sttRes = await api.postForm('/api/voice/stt', form)
      const transcribed = (sttRes && sttRes.text) || ''
      if (!transcribed) return
      // forward transcription into chat flow
      await sendUserText(transcribed)
    } catch (e) {
      console.error('STT error', e)
    } finally {
      setLoading(false)
    }
  }

  // sendUserText: shared flow for user text -> chat -> tts -> play
  const sendUserText = async (userText: string) => {
    if (!userText || !userText.trim()) return
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: userText,
    }

    // Build the complete message list including the new user message
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsProcessing(true)
    try {
      // Send language to the backend so LLM responds in the selected language
      // Use updatedMessages (not stale messages from closure)
      const chatRes = await api.post('/api/voice/chat', {
        messages: updatedMessages.map((msg) => ({ role: msg.role, content: msg.content })),
        language: language,
      })

      console.log('Chat response:', chatRes)

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: chatRes.reply || 'I am here to help plan your trip.',
      }
      setMessages((prev) => [...prev, assistantMessage])

      // TTS using server-suggested params and selected language
      if ((assistantMessage.content || '').trim()) {
        const ttsSuggestion = chatRes.tts_suggestion || {}
        const ttsBody: any = {
          text: assistantMessage.content,
          output_audio_codec: ttsSuggestion.output_audio_codec || 'mp3',
          speaker: ttsSuggestion.speaker,
          pace: ttsSuggestion.pace,
          temperature: ttsSuggestion.temperature,
        }
        // Always include target_language_code (not just when it's not 'auto')
        if (language && language !== 'auto') {
          ttsBody.target_language_code = language
        } else {
          // When auto, let backend detect from text content
          ttsBody.target_language_code = null
        }

        console.log('TTS request body:', ttsBody)
        const ttsRes = await api.post('/api/voice/tts', ttsBody)
        console.log('TTS response:', { audio_len: ttsRes.audio_base64?.length, codec: ttsRes.codec })
        playAudio(ttsRes.audio_base64, ttsRes.codec || 'mp3')
      }
    } catch (e) {
      console.error('sendUserText error:', e)
      // Add error message to chat so user sees the failure
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: `Error: ${e instanceof Error ? e.message : String(e)}`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const playAudio = (audioBase64: string, codec: string) => {
    if (!audioBase64) return
    const mime = codec === 'mp3' ? 'audio/mpeg' : `audio/${codec}`
    const audio = new Audio(`data:${mime};base64,${audioBase64}`)
    setIsSpeaking(true)
    audio.onended = () => setIsSpeaking(false)
    audio.onerror = () => setIsSpeaking(false)
    audio.play().catch(() => setIsSpeaking(false))
  }

  const handleSend = async () => {
    if (!text.trim()) return
    // reuse sendUserText flow (which also handles adding to messages)
    const toSend = text
    setText('')
    await sendUserText(toSend)
  }

  return (
    <GradientBackground>
      <div className="min-h-screen pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50/30 transition"
              title="Go back to previous page"
            >
              ← Back
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-blue-500">Neural Voice Suite</p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Voice Travel Assistant
              </h1>
              <p className="text-gray-600 mt-2">Real-time, native-sounding travel guidance with Sarvam speech.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Output Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/70 border border-white/40 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-500">Voice Core</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">{status}</p>
                    <p className="text-sm text-gray-600 mt-1">{isSpeaking ? 'Audio playing' : 'Ready for your command'}</p>
                  </div>
                  <VoiceOrb active={isListening || isProcessing || isSpeaking} />
                </div>
                <div className="mt-6">
                  <AnimatedButton
                    onClick={handleMicClick}
                    icon={isListening ? '⏹️' : '🎙️'}
                    variant="secondary"
                    className="w-full"
                  >
                    {isListening ? 'Stop Listening' : 'Activate Mic'}
                  </AnimatedButton>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-sm uppercase tracking-[0.3em] text-blue-500">Quick Prompts</h3>
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <p>"Plan a weekend trip to Goa for food and beaches."</p>
                  <p>"Find quiet hill stations near Bengaluru for July."</p>
                  <p>"Suggest a 3-day itinerary for Jaipur."</p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <GlassCard className="h-[560px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {messages.map((msg, idx) => (
                    <AIChatBubble
                      key={msg.id}
                      message={msg.content}
                      sender={msg.role === 'assistant' ? 'ai' : 'user'}
                      delay={idx * 0.05}
                    />
                  ))}
                </div>

                <div className="mt-4 border-t border-white/20 pt-4">
                  <div className="flex gap-3">
                    <textarea
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      rows={2}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Ask for a trip plan, local tips, or a full itinerary..."
                    />
                    <AnimatedButton
                      onClick={handleSend}
                      disabled={loading || !text.trim()}
                      icon="🚀"
                      variant="primary"
                    >
                      {loading ? 'Thinking...' : 'Send'}
                    </AnimatedButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </GradientBackground>
  )
}
