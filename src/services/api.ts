const API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'

async function request(path: string, opts: RequestInit = {}): Promise<any> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

export default {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body: any) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  // Send a multipart/form-data body (FormData) without forcing JSON content-type
  postForm: async (path: string, formData: FormData) => {
    const API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'
    const url = path.startsWith('http') ? path : `${API_BASE}${path}`
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || res.statusText)
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return res.json()
    }
    return res.text()
  },
}
