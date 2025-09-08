import { fetchCategories, fetchTags, searchPosts } from '@/lib/api'

export type SearchTab = 'posts' | 'categories' | 'tags'

interface SearchResultBase {
  query: string
  totalResults: number
  recommendedSearches: string[]
}

interface PostsResult extends SearchResultBase {
  posts: any[]
}

interface CategoriesResult extends SearchResultBase {
  categories: any[]
}

interface TagsResult extends SearchResultBase {
  tags: any[]
}

type SearchResult = PostsResult | CategoriesResult | TagsResult

export async function getSearchResults(
  query: string,
  type: SearchTab,
  options?: { page?: number; perPage?: number }
): Promise<SearchResult> {
  const trimmedQuery = (query || '').trim()
  const page = options?.page && options.page > 0 ? options.page : 1
  const perPage = options?.perPage && options.perPage > 0 ? options.perPage : 12

  const defaultSuggestions = ['Design', 'Photo', 'Vector', 'Frontend']

  switch (type) {
    case 'categories': {
      const categories = await fetchCategories()
      const filtered = trimmedQuery
        ? categories.filter((c) => c.name.toLowerCase().includes(trimmedQuery.toLowerCase()))
        : categories
      const total = filtered.length
      const start = (page - 1) * perPage
      const paged = filtered.slice(start, start + perPage)
      return {
        query: trimmedQuery,
        categories: paged,
        totalResults: total,
        recommendedSearches: defaultSuggestions,
      }
    }
    case 'tags': {
      const tags = await fetchTags()
      const filtered = trimmedQuery
        ? tags.filter((t) => t.name.toLowerCase().includes(trimmedQuery.toLowerCase()))
        : tags
      const total = filtered.length
      const start = (page - 1) * perPage
      const paged = filtered.slice(start, start + perPage)
      return {
        query: trimmedQuery,
        tags: paged,
        totalResults: total,
        recommendedSearches: defaultSuggestions,
      }
    }
    default: {
      if (!trimmedQuery) {
        return {
          query: '',
          posts: [],
          totalResults: 0,
          recommendedSearches: defaultSuggestions,
        }
      }

      const offset = (page - 1) * perPage
      const { posts, total } = await searchPosts(trimmedQuery, { limit: perPage, offset })
      return {
        query: trimmedQuery,
        posts,
        totalResults: total,
        recommendedSearches: defaultSuggestions,
      }
    }
  }
}
