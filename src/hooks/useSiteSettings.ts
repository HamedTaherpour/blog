'use client'

import { useState, useEffect } from 'react'

interface SiteSettings {
  id: number
  siteName: string
  siteDesc: string | null
  logoUrl: string | null
  twitter: string | null
  facebook: string | null
  youtube: string | null
  instagram: string | null
  updatedAt: string
}

interface UseSiteSettingsReturn {
  settings: SiteSettings | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSiteSettings(): UseSiteSettingsReturn {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch site settings')
      }
      
      const data = await response.json()
      setSettings(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch site settings'
      setError(errorMessage)
      console.error('Error fetching site settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  }
}
