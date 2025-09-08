'use client'

import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useEffect } from 'react'

export function SiteStructuredData() {
  const { settings, loading } = useSiteSettings()

  useEffect(() => {
    if (loading || !settings) return

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: settings.siteName,
      description: settings.siteDesc,
      url: typeof window !== 'undefined' ? window.location.origin : '',
      logo: settings.logoUrl ? `${typeof window !== 'undefined' ? window.location.origin : ''}${settings.logoUrl}` : undefined,
      author: settings.siteAuthor ? {
        '@type': 'Person',
        name: settings.siteAuthor,
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: settings.siteName,
        url: typeof window !== 'undefined' ? window.location.origin : '',
        logo: settings.logoUrl ? {
          '@type': 'ImageObject',
          url: `${typeof window !== 'undefined' ? window.location.origin : ''}${settings.logoUrl}`,
        } : undefined,
      },
      sameAs: [
        settings.twitter,
        settings.facebook,
        settings.instagram,
        settings.youtube,
      ].filter(Boolean),
      keywords: settings.metaKeywords || undefined,
      inLanguage: 'en-US',
    }

    // Remove existing structured data script if any
    const existingScript = document.getElementById('site-structured-data')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data script
    const script = document.createElement('script')
    script.id = 'site-structured-data'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById('site-structured-data')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [settings, loading])

  return null
}
