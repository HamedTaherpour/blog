import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import { fetchCategories, fetchCategoryWithPosts, fetchTags } from '@/lib/api'
import { generateCategoryMetadata } from '@/lib/metadata'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import PageHeader from '../page-header'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const categoryData = await fetchCategoryWithPosts(handle)

  const headersList = await headers()
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const host = headersList.get('x-forwarded-host')
  const origin = `${protocol}://${host}`

  if (!categoryData) {
    return {
      title: 'Κατηγορία δεν βρέθηκε',
      description: 'Κατηγορία δεν βρέθηκε',
    }
  }

  const category = categoryData.category

  // Use category-specific meta tags or fallback to defaults
  const title = (category as any).metaTitle || category.name
  const description = (category as any).metaDescription || category.description || `Περιηγηθείτε στα άρθρα στην κατηγορία ${category.name}`
  const keywords = (category as any).metaKeywords ? (category as any).metaKeywords.split(',').map((k: string) => k.trim()) : undefined
  const canonicalUrl = (category as any).canonicalUrl ? `${origin}${(category as any).canonicalUrl}` : undefined
  const ogImage = (category as any).ogImage ? `${origin}${(category as any).ogImage}` : ((category as any).image ? `${origin}${(category as any).image}` : undefined)
  const twitterImage = (category as any).twitterImage ? `${origin}${(category as any).twitterImage}` : ((category as any).image ? `${origin}${(category as any).image}` : undefined)

  return await generateCategoryMetadata({
    title,
    description,
    keywords,
    image: ogImage,
    url: canonicalUrl,
    type: ((category as any).ogType as 'website' | 'article') || 'website',
    ogTitle: (category as any).ogTitle,
    ogDescription: (category as any).ogDescription,
    ogType: (category as any).ogType,
    ogImage: ogImage,
    twitterTitle: (category as any).twitterTitle,
    twitterDescription: (category as any).twitterDescription,
    twitterCardType: (category as any).twitterCard,
    twitterImage: twitterImage,
  })
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
    { name: 'Πιο πρόσφατα', value: 'most-recent' },
    { name: 'Περισσότερο προβεβλημένα', value: 'most-viewed' },
    { name: 'Περισσότερο συζητημένα', value: 'most-discussed' },
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
