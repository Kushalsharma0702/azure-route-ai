const API_BASE = (import.meta.env && import.meta.env.VITE_AI_API_URL) || 'http://localhost:8000'

async function request(path, opts={}){
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  if(!res.ok){
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  const contentType = res.headers.get('content-type') || ''
  if(contentType.includes('application/json')) return res.json()
  return res.text()
}

export default {
  get: (path)=> request(path, {method: 'GET'}),
  post: (path, body)=> request(path, {method: 'POST', body: JSON.stringify(body)}),
}
