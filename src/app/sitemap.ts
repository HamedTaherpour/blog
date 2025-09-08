import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  try {
    // Get all published posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        allowIndexing: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Get all tags
    const tags = await prisma.tag.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Get site settings for last modified date
    const siteSettings = await prisma.siteSetting.findFirst({
      select: {
        updatedAt: true,
      },
    })

    const lastModified = siteSettings?.updatedAt || new Date()

    // Generate sitemap entries
    const sitemap: MetadataRoute.Sitemap = [
      // Homepage
      {
        url: baseUrl,
        lastModified,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      // Posts
      ...posts.map((post) => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      // Categories
      ...categories.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      // Tags
      ...tags.map((tag) => ({
        url: `${baseUrl}/tag/${tag.slug}`,
        lastModified: tag.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      // Static pages
      {
        url: `${baseUrl}/about`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]

    return sitemap
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return basic sitemap on error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ]
  }
}
