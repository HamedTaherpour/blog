import { getAllPosts, getPostsDefault, TPost } from './posts'

// TODO: replace with actual images
// TODO: replace with actual images
// _demo_category_image_urls has length 10
const _demo_category_image_urls = [
  'https://images.unsplash.com/photo-1539477857993-860599c2e840?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

// CATEGORIES
export async function getCategories() {
  return [
    {
      id: 'category-1',
      name: 'Garden',
      handle: 'garden',
      description:
        'Explore the world of gardening, from planting to harvesting and everything in between. Discover tips, tricks, and expert advice to make your garden thrive.',
      color: 'indigo',
      count: 13,
      date: '2025-06-10',
      thumbnail: {
        src: _demo_category_image_urls[0],
        alt: 'Garden',
        width: 1920,
        height: 1080,
      },
    },
  ]
}

export async function getCategoryByHandle(handle: string) {
  // lower case handle
  handle = handle?.toLowerCase()

  // for demo purpose, get all posts
  const posts = (await getAllPosts()).slice(0, 12)

  if (handle === 'all') {
    return {
      id: 'category-all',
      name: 'All articles',
      handle: 'all',
      description: 'Explore all articles',
      count: 2500,
      date: '2025-01-01',
      thumbnail: {
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'All',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'All',
        width: 1920,
        height: 1080,
      },
      color: 'indigo',
      posts,
    }
  }

  // get all categories
  const categories = await getCategories()
  let category = categories.find((category) => category.handle === handle)
  if (!category) {
    // return null
    // for demo purpose, return the first category
    category = categories[0]
  }
  return {
    ...category,
    posts,
  }
}

export async function getCategoriesWithPosts() {
  const categories = await getCategories()
  const posts = await getPostsDefault()
  return categories.map((category) => ({
    ...category,
    posts: posts.slice(0, 8),
  }))
}

// TAGS
export async function getTags() {
  return [
    {
      id: 'tag-1',
      name: 'Technology',
      handle: 'technology',
      description: 'Explore the latest innovations, gadgets, and tech trends shaping our digital future.',
      count: 10,
    },
  ]
}

export async function getTagsWithPosts() {
  const tags = await getTags()
  const posts = await getPostsDefault()
  return tags.map((tag) => ({
    ...tag,
    posts: posts.slice(0, 8),
  }))
}

export async function getTagByHandle(handle: string) {
  // lower case handle
  handle = handle?.toLowerCase()

  const posts = (await getAllPosts()).slice(0, 12)

  if (handle === 'all') {
    return {
      id: 'tag-all',
      name: 'All articles',
      handle: 'all',
      description: 'Explore all articles',
      count: 2500,
      posts,
    }
  }

  const tags = await getTags()
  let tag = tags.find((tag) => tag.handle === handle)
  if (!tag) {
    // return null
    // for demo purpose, return the first tag
    tag = tags[0]
  }
  return {
    ...tag,
    posts,
  }
}

// Types
export type TCategory = Awaited<ReturnType<typeof getCategories>>[number] & {
  posts?: TPost[]
}

export type TTag = Awaited<ReturnType<typeof getTags>>[number] & {
  posts?: TPost[]
}
