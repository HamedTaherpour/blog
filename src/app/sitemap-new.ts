// import { MetadataRoute } from 'next'
// import { prisma } from '@/lib/prisma'

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
//   try {
//     // Get counts to determine if we need sitemap index
//     const postCount = await prisma.post.count({
//       where: {
//         status: 'PUBLISHED',
//         allowIndexing: true,
//       },
//     })

//     const categoryCount = await prisma.category.count()
//     const tagCount = await prisma.tag.count()

//     // If total URLs > 1000, use sitemap index
//     const totalUrls = postCount + categoryCount + tagCount + 5 // +5 for static pages

//     if (totalUrls > 1000) {
//       // Return sitemap index
//       return [
//         {
//           url: `${baseUrl}/post-sitemap.xml`,
//           lastModified: new Date(),
//           changeFrequency: 'daily',
//           priority: 0.8,
//         },
//         {
//           url: `${baseUrl}/category-sitemap.xml`,
//           lastModified: new Date(),
//           changeFrequency: 'weekly',
//           priority: 0.7,
//         },
//         {
//           url: `${baseUrl}/tag-sitemap.xml`,
//           lastModified: new Date(),
//           changeFrequency: 'monthly',
//           priority: 0.6,
//         },
//         {
//           url: `${baseUrl}/page-sitemap.xml`,
//           lastModified: new Date(),
//           changeFrequency: 'monthly',
//           priority: 0.5,
//         },
//       ]
//     }

//     // Otherwise, return single sitemap (current behavior)
//     const posts = await prisma.post.findMany({
//       where: {
//         status: 'PUBLISHED',
//         allowIndexing: true,
//       },
//       select: {
//         slug: true,
//         updatedAt: true,
//         publishedAt: true,
//       },
//       orderBy: {
//         publishedAt: 'desc',
//       },
//     })

//     const categories = await prisma.category.findMany({
//       select: {
//         slug: true,
//         updatedAt: true,
//       },
//       orderBy: {
//         updatedAt: 'desc',
//       },
//     })

//     const tags = await prisma.tag.findMany({
//       select: {
//         slug: true,
//         updatedAt: true,
//       },
//       orderBy: {
//         updatedAt: 'desc',
//       },
//     })

//     const siteSettings = await prisma.siteSetting.findFirst({
//       select: {
//         updatedAt: true,
//       },
//     })

//     const lastModified = siteSettings?.updatedAt || new Date()

//     return [
//       // Homepage
//       {
//         url: baseUrl,
//         lastModified,
//         changeFrequency: 'daily',
//         priority: 1.0,
//       },
//       // Posts
//       ...posts.map((post) => ({
//         url: `${baseUrl}/post/${post.slug}`,
//         lastModified: post.updatedAt,
//         changeFrequency: 'weekly' as const,
//         priority: 0.8,
//       })),
//       // Categories
//       ...categories.map((category) => ({
//         url: `${baseUrl}/category/${category.slug}`,
//         lastModified: category.updatedAt,
//         changeFrequency: 'weekly' as const,
//         priority: 0.7,
//       })),
//       // Tags
//       ...tags.map((tag) => ({
//         url: `${baseUrl}/tag/${tag.slug}`,
//         lastModified: tag.updatedAt,
//         changeFrequency: 'monthly' as const,
//         priority: 0.6,
//       })),
//       // Static pages
//       {
//         url: `${baseUrl}/about`,
//         lastModified,
//         changeFrequency: 'monthly',
//         priority: 0.5,
//       },
//       {
//         url: `${baseUrl}/contact`,
//         lastModified,
//         changeFrequency: 'monthly',
//         priority: 0.5,
//       },
//       {
//         url: `${baseUrl}/privacy`,
//         lastModified,
//         changeFrequency: 'yearly',
//         priority: 0.3,
//       },
//       {
//         url: `${baseUrl}/terms`,
//         lastModified,
//         changeFrequency: 'yearly',
//         priority: 0.3,
//       },
//     ]
//   } catch (error) {
//     console.error('Error generating sitemap:', error)
    
//     return [
//       {
//         url: baseUrl,
//         lastModified: new Date(),
//         changeFrequency: 'daily',
//         priority: 1.0,
//       },
//     ]
//   }
// }
