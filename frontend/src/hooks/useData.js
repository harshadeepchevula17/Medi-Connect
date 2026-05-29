import { useState, useEffect, useCallback, useRef } from 'react'

export function useData(fetchFn, deps = [], options = {}) {
  const { enabled = true, onError } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  const fetch = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      if (mounted.current) {
        setData(res.data)
      }
    } catch (err) {
      if (mounted.current) {
        setError(err.response?.data?.message || err.message || 'An error occurred')
        onError?.(err)
      }
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, deps)

  useEffect(() => {
    mounted.current = true
    fetch()
    return () => { mounted.current = false }
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function usePolling(fetchFn, interval = 30000, deps = []) {
  const { data, loading, error, refetch } = useData(fetchFn, deps)

  useEffect(() => {
    const id = setInterval(refetch, interval)
    return () => clearInterval(id)
  }, [interval, refetch])

  return { data, loading, error, refetch }
}
