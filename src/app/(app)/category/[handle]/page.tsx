import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import { fetchCategories, fetchCategoryWithPosts, fetchTags } from '@/lib/api'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHeader from '../page-header'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const categoryData = await fetchCategoryWithPosts(handle)

  if (!categoryData) {
    return {
      title: 'Category not found',
      description: 'Category not found',
    }
  }

  return {
    title: categoryData.category.name,
    description: categoryData.category.description,
  }
}

const Page = async ({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ handle: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { handle } = await params
  const search = await searchParams
  
  // Extract pagination and filtering parameters
  const page = parseInt(search.page as string) || 1
  const limit = 12
  const offset = (page - 1) * limit
  const sortBy = (search.sort as string) || 'most-recent'
  
  const categoryData = await fetchCategoryWithPosts(handle, {
    status: 'PUBLISHED',
    limit,
    offset,
    sortBy: sortBy as 'most-recent' | 'most-viewed' | 'most-discussed'
  })

  if (!categoryData) {
    return notFound()
  }

  const { category, posts, total, hasMore } = categoryData
  const categories = await fetchCategories()
  const tags = await fetchTags()

  const filterOptions = [
    { name: 'Most recent', value: 'most-recent' },
    { name: 'Most viewed', value: 'most-viewed' },
    { name: 'Most discussed', value: 'most-discussed' },
  ]

  // Calculate pagination info
  const totalPages = Math.ceil(total / limit)
  const currentPage = page

  return (
    <div className={`page-category-${handle}`}>
      <PageHeader category={category} />

      <div className="container pt-10 lg:pt-20">
        <div className="flex flex-wrap gap-x-2 gap-y-4">
          <ModalCategories categories={categories} />
          <ModalTags tags={tags} />
          <div className="ms-auto">
            <ArchiveSortByListBox filterOptions={filterOptions} />
          </div>
        </div>

        {/* LOOP ITEMS */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-7 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <Card11 key={post.id} post={post} />
          ))}
        </div>

        {/* PAGINATIONS */}
        {totalPages > 1 && (
          <PaginationWrapper 
            className="mt-20" 
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  )
}

export default Page
