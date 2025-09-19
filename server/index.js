const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const OPENWEATHER_KEY = process.env.VUE_APP_OPENWEATHER_API_KEY
const PIXABAY_KEY = process.env.VUE_APP_PIXABAY_API_KEY

// Simple in-memory cache: { key: { expires: timestamp, data: any } }
const cache = new Map()
const DEFAULT_TTL_MS = Number(process.env.CACHE_TTL_MS) || 5 * 60 * 1000 // 5 minutes

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expires) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCached(key, data, ttl = DEFAULT_TTL_MS) {
  cache.set(key, { data, expires: Date.now() + ttl })
}

app.get('/api/weather', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' })
  const cacheKey = `weather:${q.toLowerCase()}`
  const cached = getCached(cacheKey)
  if (cached) return res.json(cached)
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${OPENWEATHER_KEY}`
    const r = await fetch(url)
    const data = await r.json()
    setCached(cacheKey, data)
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

app.get('/api/images', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' })
  const cacheKey = `images:${q.toLowerCase()}`
  const cached = getCached(cacheKey)
  if (cached) return res.json(cached)
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(q)}&image_type=photo&per_page=9&safesearch=true`
    const r = await fetch(url)
    const data = await r.json()
    setCached(cacheKey, data)
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

app.get('/api/country', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' })
  const cacheKey = `country:${q.toLowerCase()}`
  const cached = getCached(cacheKey)
  if (cached) return res.json(cached)
  try {
    // Use REST Countries API to fetch country info
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fullText=false`
    const r = await fetch(url)
    const data = await r.json()
    setCached(cacheKey, data)
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
