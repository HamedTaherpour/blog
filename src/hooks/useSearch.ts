import { useState, useEffect, useCallback, useRef } from 'react'
import _ from 'lodash'

interface SearchResult {
  results: any[]
  total: number
  type: string
  query: string
}

interface UseSearchOptions {
  debounceMs?: number
  limit?: number
}

export const useSearch = (options: UseSearchOptions = {}) => {
  const { debounceMs = 300, limit = 10 } = options
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedSearchRef = useRef<_.DebouncedFunc<(searchQuery: string) => Promise<void>> | null>(null)

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        limit: limit.toString()
      })

      const response = await fetch(`/api/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    debouncedSearchRef.current = _.debounce(search, debounceMs)
    
    return () => {
      debouncedSearchRef.current?.cancel()
    }
  }, [search, debounceMs])

  const debouncedSearch = useCallback((searchQuery: string) => {
    debouncedSearchRef.current?.(searchQuery)
  }, [])

  const clearResults = useCallback(() => {
    setResults(null)
    setQuery('')
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search: debouncedSearch,
    clearResults
  }
}
