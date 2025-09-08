'use client'

import { useEffect } from 'react'

interface StructuredDataProps {
  post: {
    id: string
    title: string
    excerpt?: string
    content: string
    date: string
    author: {
      name: string
      handle: string
    }
    categories: Array<{
      name: string
      handle: string
    }>
    tags: Array<{
      name: string
    }>
    featuredImage?: {
      src: string
      alt: string
    }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      ogImage?: string
    }
  }
}

export default function StructuredData({ post }: StructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || '',
      image: post.seo?.ogImage || post.featuredImage?.src || '',
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Person',
        name: post.author.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/author/${post.author.handle}`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'enpap-blog Blog',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/post/${post.id}`,
      },
      articleSection: post.categories.map((cat) => cat.name).join(', '),
      keywords: post.tags.map((tag) => tag.name).join(', '),
      wordCount: post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
      inLanguage: 'en-US',
    }

    // Remove existing structured data script if any
    const existingScript = document.getElementById('structured-data')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data script
    const script = document.createElement('script')
    script.id = 'structured-data'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById('structured-data')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [post])

  return null
}




