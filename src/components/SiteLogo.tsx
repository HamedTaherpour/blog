'use client'

import { useSiteSettings } from '@/hooks/useSiteSettings'
import Image from 'next/image'
import Link from 'next/link'

interface SiteLogoProps {
  className?: string
  showName?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SiteLogo({ className = '', showName = true, size = 'md' }: SiteLogoProps) {
  const { settings, loading } = useSiteSettings()

  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-8 h-8 mr-2"></div>
      </div>
    )
  }

  if (!settings) {
    return (
      <Link href="/" className={`flex items-center ${className}`}>
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
          B
        </div>
        {showName && (
          <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
            Blog
          </span>
        )}
      </Link>
    )
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  }

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {settings.logoUrl ? (
        <Image
          src={settings.logoUrl}
          alt={settings.siteName}
          width={size === 'lg' ? 48 : size === 'md' ? 32 : 24}
          height={size === 'lg' ? 48 : size === 'md' ? 32 : 24}
          className={`${sizeClasses[size]} object-contain`}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm`}>
          {settings.siteName.charAt(0).toUpperCase()}
        </div>
      )}
      {showName && (
        <span className={`ml-2 font-bold text-gray-900 dark:text-white ${textSizeClasses[size]}`}>
          {settings.siteName}
        </span>
      )}
    </Link>
  )
}
