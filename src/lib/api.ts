import { prisma } from './prisma'

// API service functions for fetching data directly from Prisma

export interface ApiPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  postType: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'FILE'
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  category: {
    id: string
    name: string
    slug: string
    color: string | null
    image: string | null
  } | null
  tags: Array<{
    tag: {
      id: string
      name: string
      slug: string
    }
  }>
  media: Array<{
    id: string
    url: string
    filename: string | null
    size: number | null
    mimeType: string | null
    width: number | null
    height: number | null
    durationSec: number | null
    provider: string | null
  }>
  _count: {
    views: number
  }
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  color: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    posts: number
  }
}

// Transform API post to the format expected by components
export function transformApiPost(apiPost: ApiPost): any {
  return {
    id: apiPost.id,
    title: apiPost.title,
    handle: apiPost.slug,
    excerpt: apiPost.excerpt || '',
    date: apiPost.createdAt.toISOString(),
    readingTime: Math.ceil(apiPost.content.length / 1000), // Estimate reading time
    commentCount: 0, // Not available in current API
    viewCount: apiPost._count.views,
    bookmarkCount: 0, // Not available in current API
    bookmarked: false, // Not available in current API
    likeCount: 0, // Not available in current API
    liked: false, // Not available in current API
    postType: apiPost.postType === 'IMAGE' ? 'standard' : apiPost.postType === 'FILE' ? 'gallery' : apiPost.postType.toLowerCase() as 'audio' | 'video',
    status: apiPost.status.toLowerCase() as 'draft' | 'published',
    author: {
      id: apiPost.author.id,
      name: apiPost.author.name || 'Unknown Author',
      handle: apiPost.author.username || 'unknown',
      avatar: {
        src: apiPost.author.image || '/images/placeholder-image.png',
        alt: apiPost.author.name || 'Unknown Author',
        width: 1920,
        height: 1080,
      },
    },
    categories: apiPost.category ? [{
      id: apiPost.category.id,
      name: apiPost.category.name,
      handle: apiPost.category.slug,
      color: apiPost.category.color || 'blue',
    }] : [],
    tags: apiPost.tags.map(tagRelation => ({
      id: tagRelation.tag.id,
      name: tagRelation.tag.name,
      handle: tagRelation.tag.slug,
      color: 'blue', // Default color for tags
    })),
    featuredImage: apiPost.media.find(m => m.mimeType?.startsWith('image/')) ? {
      src: apiPost.media.find(m => m.mimeType?.startsWith('image/'))!.url,
      alt: apiPost.title,
      width: 1920,
      height: 1080,
    } : {
      src: '/images/placeholder-image.png',
      alt: apiPost.title,
      width: 1920,
      height: 1080,
    },
    audioUrl: apiPost.media.find(m => m.mimeType?.startsWith('audio/'))?.url,
    videoUrl: apiPost.media.find(m => m.mimeType?.startsWith('video/'))?.url,
    galleryImgs: apiPost.media.filter(m => m.mimeType?.startsWith('image/')).map(m => m.url),
  }
}

// Transform API category to the format expected by components
export function transformApiCategory(apiCategory: ApiCategory) {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    handle: apiCategory.slug,
    description: apiCategory.description || '',
    color: apiCategory.color || 'blue',
    count: apiCategory._count.posts,
    date: apiCategory.createdAt.toISOString(),
    thumbnail: {
      src: apiCategory.image || '/images/placeholder-image.png',
      alt: apiCategory.name,
      width: 1920,
      height: 1080,
    },
  }
}

// Fetch posts from Prisma
export async function fetchPosts(params?: {
  status?: string
  categoryId?: string
  postType?: string
  limit?: number
  offset?: number
}) {
  const where: any = {}
  
  if (params?.status) {
    where.status = params.status
  }
  
  if (params?.categoryId) {
    where.categoryId = params.categoryId
  }

  if (params?.postType) {
    where.postType = params.postType
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          image: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      media: true,
      _count: {
        select: {
          views: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: params?.limit || 50,
    skip: params?.offset || 0
  })

  const total = await prisma.post.count({ where })

  return {
    posts: posts.map(transformApiPost),
    total,
    hasMore: (params?.offset || 0) + (params?.limit || 50) < total,
  }
}

// Fetch categories from Prisma
export async function fetchCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return categories.map(transformApiCategory)
}

// Fetch posts by type for different sections
export async function fetchPostsByType(postType: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'FILE', limit: number = 10) {
  const { posts } = await fetchPosts({
    status: 'PUBLISHED',
    postType,
    limit
  })
  
  return posts
}

// Fetch most viewed posts (sorted by view count)
export async function fetchMostViewedPosts(limit: number = 10) {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED'
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          image: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      media: true,
      _count: {
        select: {
          views: true
        }
      }
    },
    orderBy: {
      views: {
        _count: 'desc'
      }
    },
    take: limit
  })

  return posts.map(transformApiPost)
}

// Fetch audio posts for podcast/audio sections
export async function fetchAudioPosts(limit: number = 10) {
  const { posts } = await fetchPosts({
    status: 'PUBLISHED',
    postType: 'AUDIO',
    limit
  })
  
  return posts
}

// Fetch video posts for video sections
export async function fetchVideoPosts(limit: number = 10) {
  const { posts } = await fetchPosts({
    status: 'PUBLISHED',
    postType: 'VIDEO',
    limit
  })
  
  return posts
}

// Fetch gallery posts (FILE type with multiple images)
export async function fetchGalleryPosts(limit: number = 10) {
  const { posts } = await fetchPosts({
    status: 'PUBLISHED',
    postType: 'FILE',
    limit
  })
  
  return posts
}

// ===== CATEGORY SERVICES =====

// Fetch category by handle/slug
export async function fetchCategoryByHandle(handle: string) {
  const category = await prisma.category.findUnique({
    where: {
      slug: handle
    },
    include: {
      _count: {
        select: {
          posts: true
        }
      }
    }
  })

  if (!category) {
    return null
  }

  return transformApiCategory(category)
}

// Fetch category with posts
export async function fetchCategoryWithPosts(handle: string, params?: {
  status?: string
  postType?: string
  limit?: number
  offset?: number
  sortBy?: 'most-recent' | 'most-viewed' | 'most-discussed'
}) {
  const category = await prisma.category.findUnique({
    where: {
      slug: handle
    },
    include: {
      _count: {
        select: {
          posts: true
        }
      }
    }
  })

  if (!category) {
    return null
  }

  // Build where clause for posts
  const where: any = {
    categoryId: category.id
  }

  if (params?.status) {
    where.status = params.status
  }

  if (params?.postType) {
    where.postType = params.postType
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }
  if (params?.sortBy === 'most-viewed') {
    orderBy = { views: { _count: 'desc' } }
  } else if (params?.sortBy === 'most-discussed') {
    // For now, we'll use createdAt as we don't have comment count
    orderBy = { createdAt: 'desc' }
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          image: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      media: true,
      _count: {
        select: {
          views: true
        }
      }
    },
    orderBy,
    take: params?.limit || 12,
    skip: params?.offset || 0
  })

  const total = await prisma.post.count({ where })

  return {
    category: transformApiCategory(category),
    posts: posts.map(transformApiPost),
    total,
    hasMore: (params?.offset || 0) + (params?.limit || 12) < total,
  }
}

// ===== POST SERVICES =====

// Fetch single post by handle/slug
export async function fetchPostByHandle(handle: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug: handle,
      status: 'PUBLISHED'
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          image: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      media: true,
      _count: {
        select: {
          views: true
        }
      }
    }
  })

  if (!post) {
    return null
  }

  const transformedPost = transformApiPost(post)
  
  // Add SEO fields to the transformed post
  return {
    ...transformedPost,
    seo: {
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      metaKeywords: post.metaKeywords,
      focusKeyword: post.focusKeyword,
      canonicalUrl: post.canonicalUrl,
      allowIndexing: post.allowIndexing,
      ogTitle: post.ogTitle,
      ogDescription: post.ogDescription,
      ogType: post.ogType,
      ogImage: post.ogImage,
      twitterTitle: post.twitterTitle,
      twitterDescription: post.twitterDescription,
      twitterCardType: post.twitterCardType,
      twitterImage: post.twitterImage,
    }
  }
}

// Fetch authors for widget
export async function fetchAuthors(limit: number = 6) {
  const authors = await prisma.user.findMany({
    where: {
      posts: {
        some: {
          status: 'PUBLISHED'
        }
      }
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          posts: {
            where: {
              status: 'PUBLISHED'
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  })

  return authors.map(author => ({
    id: author.id,
    name: author.name || 'Unknown Author',
    handle: author.username || 'unknown',
    career: 'Content Creator',
    description: 'Passionate about sharing knowledge and experiences.',
    count: author._count.posts,
    joinedDate: author.createdAt.toISOString().split('T')[0],
    reviewCount: Math.floor(Math.random() * 100) + 50, // Random review count
    rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
    avatar: {
      src: author.image || '/images/placeholder-image.png',
      alt: author.name || 'Unknown Author',
      width: 1920,
      height: 1080,
    },
    cover: {
      src: '/images/placeholder-image.png',
      alt: author.name || 'Unknown Author',
      width: 1920,
      height: 1080,
    },
  }))
}

// Fetch related posts (same category, excluding current post)
export async function fetchRelatedPosts(currentPostId: string, categoryId: string | null, limit: number = 6) {
  const where: any = {
    id: {
      not: currentPostId
    },
    status: 'PUBLISHED'
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          image: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      media: true,
      _count: {
        select: {
          views: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  })

  return posts.map(transformApiPost)
}

// Fetch more posts from same author (excluding current post)
export async function fetchMoreFromAuthorPosts(currentPostId: string, authorId: string, limit: number = 6) {
  const posts = await prisma.post.findMany({
    where: {
      id: {
        not: currentPostId
      },
      authorId: authorId,
      status: 'PUBLISHED'
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          image: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      media: true,
      _count: {
        select: {
          views: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  })

  return posts.map(transformApiPost)
}

// ===== TAG SERVICES =====

export interface ApiTag {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
  _count: {
    posts: number
  }
}

// Transform API tag to the format expected by components
export function transformApiTag(apiTag: ApiTag) {
  return {
    id: apiTag.id,
    name: apiTag.name,
    handle: apiTag.slug,
    description: '', // Add description field for compatibility
    count: apiTag._count.posts,
    date: apiTag.createdAt.toISOString(),
  }
}


// Fetch all tags
export async function fetchTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return tags.map(transformApiTag)
}

// Fetch tag by handle/slug
export async function fetchTagByHandle(handle: string) {
  const tag = await prisma.tag.findUnique({
    where: {
      slug: handle
    },
    include: {
      _count: {
        select: {
          posts: true
        }
      }
    }
  })

  if (!tag) {
    return null
  }

  return transformApiTag(tag)
}

// Fetch tag with posts
export async function fetchTagWithPosts(handle: string, params?: {
  status?: string
  postType?: string
  limit?: number
  offset?: number
  sortBy?: 'most-recent' | 'most-viewed' | 'most-discussed'
}) {
  const tag = await prisma.tag.findUnique({
    where: {
      slug: handle
    },
    include: {
      _count: {
        select: {
          posts: true
        }
      }
    }
  })

  if (!tag) {
    return null
  }

  // Build where clause for posts
  const where: any = {
    tags: {
      some: {
        tagId: tag.id
      }
    }
  }

  if (params?.status) {
    where.status = params.status
  }

  if (params?.postType) {
    where.postType = params.postType
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }
  if (params?.sortBy === 'most-viewed') {
    orderBy = { views: { _count: 'desc' } }
  } else if (params?.sortBy === 'most-discussed') {
    // For now, we'll use createdAt as we don't have comment count
    orderBy = { createdAt: 'desc' }
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          image: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      media: true,
      _count: {
        select: {
          views: true
        }
      }
    },
    orderBy,
    take: params?.limit || 12,
    skip: params?.offset || 0
  })

  const total = await prisma.post.count({ where })

  return {
    tag: transformApiTag(tag),
    posts: posts.map(transformApiPost),
    total,
    hasMore: (params?.offset || 0) + (params?.limit || 12) < total,
  }
}

// Search functions
export async function searchPosts(query: string, params?: {
  limit?: number
  offset?: number
}) {
  const searchQuery = query.toLowerCase()
  const where: any = {
    OR: [
      { title: { contains: searchQuery } },
      { excerpt: { contains: searchQuery } },
      { content: { contains: searchQuery } }
    ],
    status: 'PUBLISHED'
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          image: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      media: true,
      _count: {
        select: {
          views: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: params?.limit || 10,
    skip: params?.offset || 0
  })

  const total = await prisma.post.count({ where })

  return {
    posts: posts.map(transformApiPost),
    total,
    hasMore: (params?.offset || 0) + (params?.limit || 10) < total,
  }
}
