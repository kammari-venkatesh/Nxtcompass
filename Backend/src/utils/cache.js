/**
 * Simple in-memory cache
 * Replace with Redis in production
 */
const cache = {}

export const setCache = (key, value, ttl = 30) => {
  cache[key] = {
    value,
    expireAt: Date.now() + ttl * 60 * 1000,
  }
}

export const getCache = (key) => {
  if (!cache[key]) return null

  const item = cache[key]
  if (Date.now() > item.expireAt) {
    delete cache[key]
    return null
  }

  return item.value
}

export const clearCache = (key) => {
  delete cache[key]
}

export const clearAllCache = () => {
  Object.keys(cache).forEach((key) => delete cache[key])
}

export default { setCache, getCache, clearCache, clearAllCache }
