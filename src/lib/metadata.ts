import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export async function generateSiteMetadata(): Promise<Metadata> {
  try {
    // Get site settings from database
    const settings = await prisma.siteSetting.findFirst()
    
    if (!settings) {
      // Return default metadata if no settings found
      return {
        title: {
          template: '%s - My Blog',
          default: 'My Blog - A Modern Blog Platform',
        },
        description: 'A modern blog platform for sharing ideas and stories',
        keywords: ['blog', 'news', 'magazine', 'content'],
        openGraph: {
          title: 'My Blog',
          description: 'A modern blog platform for sharing ideas and stories',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: 'My Blog',
          description: 'A modern blog platform for sharing ideas and stories',
        },
      }
    }

    // Generate metadata from site settings
    const metadata: Metadata = {
      title: {
        template: `%s - ${settings.siteName}`,
        default: settings.siteName,
      },
      description: settings.siteDesc || `Welcome to ${settings.siteName}`,
      keywords: ['blog', 'news', 'magazine', 'content'],
      openGraph: {
        title: settings.siteName,
        description: settings.siteDesc || `Welcome to ${settings.siteName}`,
        type: 'website',
        images: settings.logoUrl ? [settings.logoUrl] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: settings.siteName,
        description: settings.siteDesc || `Welcome to ${settings.siteName}`,
        images: settings.logoUrl ? [settings.logoUrl] : undefined,
      },
    }

    // Add social media links to metadata if available
    if (settings.twitter || settings.facebook || settings.instagram) {
      const socialLinks: string[] = []
      if (settings.twitter) socialLinks.push(settings.twitter)
      if (settings.facebook) socialLinks.push(settings.facebook)
      if (settings.instagram) socialLinks.push(settings.instagram)
      
      metadata.other = {
        'social:links': socialLinks.join(','),
      }
    }

    return metadata
  } catch (error) {
    console.error('Error generating site metadata:', error)
    
    // Return default metadata on error
    return {
      title: {
        template: '%s - My Blog',
        default: 'My Blog - A Modern Blog Platform',
      },
      description: 'A modern blog platform for sharing ideas and stories',
      keywords: ['blog', 'news', 'magazine', 'content'],
    }
  }
}
