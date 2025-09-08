import PageHeader from '@/app/(app)/tag/page-header'
import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import { fetchCategories, fetchTagByHandle, fetchTagWithPosts, fetchTags } from '@/lib/api'
import { generatePageMetadata } from '@/lib/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const tag = await fetchTagByHandle(handle)

  if (!tag) {
    return {
      title: 'Ετικέτα δεν βρέθηκε',
      description: 'Ετικέτα δεν βρέθηκε',
    }
  }

  return await generatePageMetadata({
    title: `Άρθρα με ετικέτα "${tag.name}"`,
    description: `Περιηγηθείτε σε όλα τα άρθρα με ετικέτα ${tag.name}`,
    type: 'website',
  })
}

const Page = async ({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) => {
  const { handle } = await params
  const sp = await searchParams

  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const sortParam = Array.isArray(sp['sort-by']) ? sp['sort-by'][0] : sp['sort-by']

  const currentPage = Number(pageParam || '1')
  const perPage = 12

  // Map sort-by values to backend accepted options
  const sortBy = sortParam === 'most-viewed' ? 'most-viewed' : sortParam === 'most-discussed' ? 'most-discussed' : 'most-recent'

  const tagWithPosts = await fetchTagWithPosts(handle, {
    status: 'PUBLISHED',
    limit: perPage,
    offset: Number.isFinite(currentPage) && currentPage > 0 ? (currentPage - 1) * perPage : 0,
    sortBy,
  })

  if (!tagWithPosts) {
    return notFound()
  }

  const { tag, posts, total } = tagWithPosts
  const categories = await fetchCategories()
  const tags = await fetchTags()

  const filterOptions = [
    { name: 'Πιο πρόσφατα', value: 'most-recent' },
    { name: 'Επιλεγμένα από διαχειριστή', value: 'curated-by-admin' },
    { name: 'Περισσότερο εκτιμημένα', value: 'most-appreciated' },
    { name: 'Περισσότερο συζητημένα', value: 'most-discussed' },
    { name: 'Περισσότερο προβεβλημένα', value: 'most-viewed' },
  ]

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage))

  return (
    <div className={`page-tag-${handle}`}>
      {/* HEADER */}
      <PageHeader tag={tag as any} />

      <div className="container pt-10 lg:pt-16">
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
        <PaginationWrapper className="mt-20" totalPages={totalPages} />
      </div>
    </div>
  )
}

export default Page
