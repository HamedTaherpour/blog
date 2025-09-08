import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

export interface PageMetadataOptions {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

export interface PostMetadataOptions extends PageMetadataOptions {
  allowIndexing?: boolean
  ogTitle?: string
  ogDescription?: string
  ogType?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterCardType?: string
  twitterImage?: string
  focusKeyword?: string
}

export interface CategoryMetadataOptions extends PageMetadataOptions {
  ogTitle?: string
  ogDescription?: string
  ogType?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterCardType?: string
  twitterImage?: string
}

export async function generatePostMetadata(options: PostMetadataOptions = {}): Promise<Metadata> {
  try {
    // Get site settings from database
    const settings = await prisma.siteSetting.findFirst()

    if (!settings) {
      // Return basic metadata if no settings found
      return {
        title: options.title || 'Το Blog μου',
        description: options.description || 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
        keywords: options.keywords || ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'],
        robots: options.allowIndexing !== false ? 'index,follow' : 'noindex,nofollow',
        openGraph: {
          title: options.ogTitle || options.title || 'Το Blog μου',
          description:
            options.ogDescription ||
            options.description ||
            'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
          type: (options.ogType as any) || options.type || 'article',
          images: options.ogImage
            ? [
                {
                  url: options.ogImage,
                  width: 1200,
                  height: 630,
                  alt: options.ogTitle || options.title || 'Το Blog μου',
                },
              ]
            : undefined,
        },
        twitter: {
          card: (options.twitterCardType as any) || 'summary_large_image',
          title: options.twitterTitle || options.title || 'Το Blog μου',
          description:
            options.twitterDescription ||
            options.description ||
            'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
          images: options.twitterImage ? [options.twitterImage] : undefined,
        },
      }
    }

    // Use provided values or fallback to site settings
    const metaTitle = options.title || settings.metaTitle || settings.siteName
    const metaDescription =
      options.description || settings.metaDescription || settings.siteDesc || `Welcome to ${settings.siteName}`
    const metaKeywords =
      options.keywords ||
      (settings.metaKeywords
        ? settings.metaKeywords.split(',').map((k) => k.trim())
        : ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'])

    // Open Graph data - prioritize post-specific values
    const ogTitle = options.ogTitle || options.title || settings.ogTitle || settings.siteName
    const ogDescription =
      options.ogDescription || options.description || settings.ogDescription || settings.siteDesc || metaDescription
    const ogType = options.ogType || options.type || settings.ogType || 'article'
    const ogImage = options.ogImage || options.image || settings.ogImage || settings.logoUrl

    // Twitter Card data - prioritize post-specific values
    const twitterTitle = options.twitterTitle || options.title || settings.twitterTitle || settings.siteName
    const twitterDescription =
      options.twitterDescription ||
      options.description ||
      settings.twitterDescription ||
      settings.siteDesc ||
      metaDescription
    const twitterCardType = options.twitterCardType || settings.twitterCardType || 'summary_large_image'
    const twitterImage = options.twitterImage || options.image || settings.twitterImage || settings.logoUrl

    // Generate metadata
    const metadata: Metadata = {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords,
      authors: options.author
        ? [{ name: options.author }]
        : settings.siteAuthor
          ? [{ name: settings.siteAuthor }]
          : undefined,
      robots: options.allowIndexing !== false ? 'index,follow' : 'noindex,nofollow',
      alternates: options.url
        ? { canonical: options.url }
        : settings.canonicalUrl
          ? { canonical: settings.canonicalUrl }
          : undefined,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: ogType as any,
        siteName: settings.siteName,
        url: options.url,
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ]
          : undefined,
        publishedTime: options.publishedTime,
        modifiedTime: options.modifiedTime,
        authors: options.author ? [options.author] : settings.siteAuthor ? [settings.siteAuthor] : undefined,
        tags: options.tags,
      },
      twitter: {
        card: twitterCardType as any,
        title: twitterTitle,
        description: twitterDescription,
        images: twitterImage ? [twitterImage] : undefined,
        creator: options.author ? `@${options.author}` : undefined,
      },
    }

    return metadata
  } catch (error) {
    console.error('Error generating post metadata:', error)

    // Return basic metadata on error
    return {
      title: options.title || 'Το Blog μου',
      description: options.description || 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
      keywords: options.keywords || ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'],
      robots: options.allowIndexing !== false ? 'index,follow' : 'noindex,nofollow',
    }
  }
}

export async function generateCategoryMetadata(options: CategoryMetadataOptions = {}): Promise<Metadata> {
  try {
    // Get site settings from database
    const settings = await prisma.siteSetting.findFirst()

    if (!settings) {
      // Return basic metadata if no settings found
      return {
        title: options.title || 'Το Blog μου',
        description: options.description || 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
        keywords: options.keywords || ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'],
        robots: 'index,follow',
        openGraph: {
          title: options.ogTitle || options.title || 'Το Blog μου',
          description:
            options.ogDescription ||
            options.description ||
            'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
          type: (options.ogType as any) || options.type || 'website',
          images: options.ogImage
            ? [
                {
                  url: options.ogImage,
                  width: 1200,
                  height: 630,
                  alt: options.ogTitle || options.title || 'Το Blog μου',
                },
              ]
            : undefined,
        },
        twitter: {
          card: (options.twitterCardType as any) || 'summary_large_image',
          title: options.twitterTitle || options.title || 'Το Blog μου',
          description:
            options.twitterDescription ||
            options.description ||
            'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
          images: options.twitterImage ? [options.twitterImage] : undefined,
        },
      }
    }

    // Use provided values or fallback to site settings
    const metaTitle = options.title || settings.metaTitle || settings.siteName
    const metaDescription =
      options.description || settings.metaDescription || settings.siteDesc || `Welcome to ${settings.siteName}`
    const metaKeywords =
      options.keywords ||
      (settings.metaKeywords
        ? settings.metaKeywords.split(',').map((k) => k.trim())
        : ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'])

    // Open Graph data - prioritize category-specific values
    const ogTitle = options.ogTitle || options.title || settings.ogTitle || settings.siteName
    const ogDescription =
      options.ogDescription || options.description || settings.ogDescription || settings.siteDesc || metaDescription
    const ogType = options.ogType || options.type || settings.ogType || 'website'
    const ogImage = options.ogImage || options.image || settings.ogImage || settings.logoUrl

    // Twitter Card data - prioritize category-specific values
    const twitterTitle = options.twitterTitle || options.title || settings.twitterTitle || settings.siteName
    const twitterDescription =
      options.twitterDescription ||
      options.description ||
      settings.twitterDescription ||
      settings.siteDesc ||
      metaDescription
    const twitterCardType = options.twitterCardType || settings.twitterCardType || 'summary_large_image'
    const twitterImage = options.twitterImage || options.image || settings.twitterImage || settings.logoUrl

    // Generate metadata
    const metadata: Metadata = {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords,
      authors: options.author
        ? [{ name: options.author }]
        : settings.siteAuthor
          ? [{ name: settings.siteAuthor }]
          : undefined,
      robots: settings.allowIndexing ? 'index,follow' : 'noindex,nofollow',
      alternates: options.url
        ? { canonical: options.url }
        : settings.canonicalUrl
          ? { canonical: settings.canonicalUrl }
          : undefined,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: ogType as any,
        siteName: settings.siteName,
        url: options.url,
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ]
          : undefined,
        publishedTime: options.publishedTime,
        modifiedTime: options.modifiedTime,
        authors: options.author ? [options.author] : settings.siteAuthor ? [settings.siteAuthor] : undefined,
        tags: options.tags,
      },
      twitter: {
        card: twitterCardType as any,
        title: twitterTitle,
        description: twitterDescription,
        images: twitterImage ? [twitterImage] : undefined,
        creator: options.author ? `@${options.author}` : undefined,
      },
    }

    return metadata
  } catch (error) {
    console.error('Error generating category metadata:', error)

    // Return basic metadata on error
    return {
      title: options.title || 'Το Blog μου',
      description: options.description || 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
      keywords: options.keywords || ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'],
      robots: 'index,follow',
    }
  }
}

export async function generatePageMetadata(options: PageMetadataOptions = {}): Promise<Metadata> {
  try {
    // Get site settings from database
    const settings = await prisma.siteSetting.findFirst()

    if (!settings) {
      // Return basic metadata if no settings found
      return {
        title: options.title || 'Το Blog μου',
        description: options.description || 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
        keywords: options.keywords || ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'],
        robots: 'index,follow',
        openGraph: {
          title: options.title || 'Το Blog μου',
          description: options.description || 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
          type: options.type || 'website',
          images: options.image
            ? [{ url: options.image, width: 1200, height: 630, alt: options.title || 'Το Blog μου' }]
            : undefined,
        },
        twitter: {
          card: 'summary_large_image',
          title: options.title || 'Το Blog μου',
          description: options.description || 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
          images: options.image ? [options.image] : undefined,
        },
      }
    }

    // Use provided values or fallback to site settings
    const metaTitle = options.title || settings.metaTitle || settings.siteName
    const metaDescription =
      options.description || settings.metaDescription || settings.siteDesc || `Welcome to ${settings.siteName}`
    const metaKeywords =
      options.keywords ||
      (settings.metaKeywords
        ? settings.metaKeywords.split(',').map((k) => k.trim())
        : ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'])

    // Open Graph data
    const ogTitle = options.title || settings.ogTitle || settings.siteName
    const ogDescription = options.description || settings.ogDescription || settings.siteDesc || metaDescription
    const ogType = options.type || settings.ogType || 'website'
    const ogImage = options.image || settings.ogImage || settings.logoUrl

    // Twitter Card data
    const twitterTitle = options.title || settings.twitterTitle || settings.siteName
    const twitterDescription =
      options.description || settings.twitterDescription || settings.siteDesc || metaDescription
    const twitterCardType = settings.twitterCardType || 'summary_large_image'
    const twitterImage = options.image || settings.twitterImage || settings.logoUrl

    // Generate metadata
    const metadata: Metadata = {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords,
      authors: options.author
        ? [{ name: options.author }]
        : settings.siteAuthor
          ? [{ name: settings.siteAuthor }]
          : undefined,
      robots: settings.allowIndexing ? 'index,follow' : 'noindex,nofollow',
      alternates: options.url
        ? { canonical: options.url }
        : settings.canonicalUrl
          ? { canonical: settings.canonicalUrl }
          : undefined,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: ogType as any,
        siteName: settings.siteName,
        url: options.url,
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ]
          : undefined,
        publishedTime: options.publishedTime,
        modifiedTime: options.modifiedTime,
        authors: options.author ? [options.author] : settings.siteAuthor ? [settings.siteAuthor] : undefined,
        tags: options.tags,
      },
      twitter: {
        card: twitterCardType as any,
        title: twitterTitle,
        description: twitterDescription,
        images: twitterImage ? [twitterImage] : undefined,
        creator: options.author ? `@${options.author}` : undefined,
      },
    }

    return metadata
  } catch (error) {
    console.error('Error generating page metadata:', error)

    // Return basic metadata on error
    return {
      title: options.title || 'Το Blog μου',
      description: options.description || 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
      keywords: options.keywords || ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'],
      robots: 'index,follow',
    }
  }
}

export async function generateSiteMetadata(): Promise<Metadata> {
  try {
    // Get site settings from database
    const settings = await prisma.siteSetting.findFirst()
    const socialMediaLinks = await prisma.socialMediaLink.findMany()

    if (!settings) {
      // Return default metadata if no settings found
      return {
        title: {
          template: '%s - Το Blog μου',
          default: 'Το Blog μου - Μια Σύγχρονη Πλατφόρμα Blog',
        },
        description: 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
        keywords: ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'],
        robots: 'index,follow',
        openGraph: {
          title: 'Το Blog μου',
          description: 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Το Blog μου',
          description: 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
        },
      }
    }

    // Use stored meta tags or fallback to basic site info
    const metaTitle = settings.metaTitle || settings.siteName
    const metaDescription = settings.metaDescription || settings.siteDesc || `Welcome to ${settings.siteName}`
    const metaKeywords = settings.metaKeywords
      ? settings.metaKeywords.split(',').map((k) => k.trim())
      : ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο']

    // Open Graph data
    const ogTitle = settings.ogTitle || settings.siteName
    const ogDescription = settings.ogDescription || settings.siteDesc || metaDescription
    const ogType = settings.ogType || 'website'
    const ogImage = settings.ogImage || settings.logoUrl

    // Twitter Card data
    const twitterTitle = settings.twitterTitle || settings.siteName
    const twitterDescription = settings.twitterDescription || settings.siteDesc || metaDescription
    const twitterCardType = settings.twitterCardType || 'summary_large_image'
    const twitterImage = settings.twitterImage || settings.logoUrl

    // Generate metadata from site settings
    const metadata: Metadata = {
      title: {
        template: `%s - ${settings.siteName}`,
        default: metaTitle,
      },
      description: metaDescription,
      keywords: metaKeywords,
      authors: settings.siteAuthor ? [{ name: settings.siteAuthor }] : undefined,
      robots: settings.allowIndexing ? 'index,follow' : 'noindex,nofollow',
      alternates: settings.canonicalUrl ? { canonical: settings.canonicalUrl } : undefined,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: ogType as any,
        siteName: settings.siteName,
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ]
          : undefined,
      },
      twitter: {
        card: twitterCardType as any,
        title: twitterTitle,
        description: twitterDescription,
        images: twitterImage ? [twitterImage] : undefined,
      },
    }

    // Add social media links to metadata if available
    if (socialMediaLinks.length > 0) {
      metadata.other = {
        'social:links': socialMediaLinks.join(','),
      }
    }

    return metadata
  } catch (error) {
    console.error('Error generating site metadata:', error)

    // Return default metadata on error
    return {
      title: {
        template: '%s - Το Blog μου',
        default: 'Το Blog μου - Μια Σύγχρονη Πλατφόρμα Blog',
      },
      description: 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση ιδεών και ιστοριών',
      keywords: ['blog', 'ειδήσεις', 'περιοδικό', 'περιεχόμενο'],
      robots: 'index,follow',
    }
  }
}
