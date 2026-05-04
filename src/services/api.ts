/**
 * Client-CRM API service — connected to real backend.
 * 
 * Handles JWT token management, OTP flow, and all API calls.
 * Token is stored in localStorage and sent in Authorization header.
 */

const API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'

// ── Token Management ──────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('routeaura_token')
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('routeaura_token', access)
  localStorage.setItem('routeaura_refresh_token', refresh)
}

function clearTokens() {
  localStorage.removeItem('routeaura_token')
  localStorage.removeItem('routeaura_refresh_token')
  localStorage.removeItem('routeaura_user')
}

function getUser(): { id: string; email: string; name: string; role: string } | null {
  const raw = localStorage.getItem('routeaura_user')
  return raw ? JSON.parse(raw) : null
}

function setUser(user: { id: string; email: string; name: string; role: string }) {
  localStorage.setItem('routeaura_user', JSON.stringify(user))
}

// ── Base Request ──────────────────────────────────────────

async function request(path: string, opts: RequestInit = {}): Promise<any> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((opts.headers as Record<string, string>) || {}),
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { ...opts, headers })

  if (res.status === 401) {
    clearTokens()
  }

  if (!res.ok) {
    const text = await res.text()
    let detail = text
    try {
      const json = JSON.parse(text)
      detail = json.error || json.detail || text
    } catch {}
    throw new Error(detail || res.statusText)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

// ── Auth API ──────────────────────────────────────────────

const auth = {
  signup: async (data: { email: string; password: string; name?: string; phone?: string }) => {
    return request('/api/v1/auth/signup', { method: 'POST', body: JSON.stringify(data) })
  },

  verifyOtp: async (email: string, otp: string) => {
    const result = await request('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
    if (result.access_token) {
      setTokens(result.access_token, result.refresh_token)
      if (result.user) setUser(result.user)
    }
    return result
  },

  resendOtp: async (email: string) => {
    return request('/api/v1/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email }) })
  },

  login: async (email: string, password: string) => {
    const result = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (result.access_token) {
      setTokens(result.access_token, result.refresh_token)
      if (result.user) setUser(result.user)
    }
    return result
  },

  logout: () => {
    clearTokens()
  },

  me: () => request('/api/v1/auth/me'),

  updatePreferences: async (preferences: any) => {
    const result = await request('/api/v1/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences })
    })
    // Update local storage user if needed
    const user = getUser()
    if (user) {
      setUser({ ...user, preferences: result.preferences })
    }
    return result
  },

  isLoggedIn: () => !!getToken(),
  getUser,
}

// ── Hotel API (read rooms for client) ─────────────────────

const hotel = {
  rooms: (availableOnly = false) =>
    request(`/api/v1/hotel/rooms?available_only=${availableOnly}`),
  room: (id: number) => request(`/api/v1/hotel/rooms/${id}`),
}

// ── Hotels API (properties + rooms) ──────────────────────

const hotels = {
  list: (params?: { city?: string; min_price?: number; max_price?: number; min_rating?: number; limit?: number }) => {
    const qs = new URLSearchParams()
    if (params?.city) qs.set('city', params.city)
    if (params?.min_price != null) qs.set('min_price', String(params.min_price))
    if (params?.max_price != null) qs.set('max_price', String(params.max_price))
    if (params?.min_rating != null) qs.set('min_rating', String(params.min_rating))
    qs.set('limit', String(params?.limit || 50))
    return request(`/api/v1/hotels?${qs.toString()}`)
  },
  get: (id: string | number) => request(`/api/v1/hotels/${id}`),
}

// ── Bookings API (for user dashboard) ────────────────────

const bookings = {
  list: () => request('/api/v1/hotel/bookings'),
  stats: () => request('/api/v1/hotel/stats'),
  create: (data: {
    guest_name: string
    guest_email?: string
    room_id?: number
    room_name: string
    check_in: string
    check_out: string
    status?: string
    payment_status?: string
    amount: number
  }) => request('/api/v1/hotel/bookings', { method: 'POST', body: JSON.stringify(data) }),
}

// ── AI/Travel API ─────────────────────────────────────────

const ai = {
  suggest: (payload: any) =>
    request('/api/v1/copilot/suggest', { method: 'POST', body: JSON.stringify(payload) }),
  itinerary: (payload: any) =>
    request('/api/v1/copilot/itinerary', { method: 'POST', body: JSON.stringify(payload) }),
}

const voice = {
  chat: (messages: any[], language?: string) =>
    request('/api/v1/voice/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, language }),
    }),
  tts: (payload: any) =>
    request('/api/v1/voice/tts', { method: 'POST', body: JSON.stringify(payload) }),
  stt: async (formData: FormData) => {
    const url = `${API_BASE}/api/v1/voice/stt`
    const headers: Record<string, string> = {}
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(url, { method: 'POST', body: formData, headers })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
}

const travel = {
  trainStatus: (trainNumber: string) =>
    request(`/api/v1/travel/train/status?train_number=${trainNumber}`),
  flightStatus: (flightNumber: string) =>
    request(`/api/v1/travel/flight/status?flight_number=${flightNumber}`),
  search: (payload: any) =>
    request('/api/v1/travel/search', { method: 'POST', body: JSON.stringify(payload) }),
}

const hiddenGems = {
  discover: (payload: any) =>
    request('/api/v1/hidden-gems/discover', { method: 'POST', body: JSON.stringify(payload) }),
}

const packages = {
  book: (data: any) => request('/api/v1/packages/bookings', { method: 'POST', body: JSON.stringify(data) }),
}

const feedback = {
  submit: (data: any) => request('/api/v1/feedback', { method: 'POST', body: JSON.stringify(data) }),
  list: (hotelId?: number) => {
    const qs = hotelId ? `?hotel_id=${hotelId}` : ''
    return request(`/api/v1/feedback${qs}`)
  },
  score: (hotelId: number) => request(`/api/v1/feedback/score/${hotelId}`),
  dashboard: () => request('/api/v1/feedback/dashboard'),
}

export default { auth, hotel, hotels, bookings, packages, feedback, ai, voice, travel, hiddenGems, request }
export { auth, hotel, hotels, bookings, packages, feedback, ai, voice, travel, hiddenGems, getToken, getUser, clearTokens }
