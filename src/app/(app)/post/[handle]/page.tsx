import WidgetCategories from '@/components/WidgetCategories'
import WidgetPosts from '@/components/WidgetPosts'
import WidgetTags from '@/components/WidgetTags'
import { fetchCategories, fetchPostByHandle, fetchPosts, fetchRelatedPosts, fetchTags } from '@/lib/api'
import { generatePostMetadata } from '@/lib/metadata'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import SingleContentContainer from '../SingleContentContainer'
import SingleHeaderContainer from '../SingleHeaderContainer'
import SingleRelatedPosts from '../SingleRelatedPosts'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const post = await fetchPostByHandle(handle)

  const headersList = await headers()
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const host = headersList.get('x-forwarded-host')
  const origin = `${protocol}://${host}`

  if (!post) {
    return {
      title: 'Άρθρο δεν βρέθηκε',
      description: 'Το ζητούμενο άρθρο δεν μπόρεσε να βρεθεί.',
    }
  }

  // Use post-specific SEO fields or fallback to basic fields
  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || 'Διαβάστε αυτό το άρθρο στο blog μας'
  const keywords = post.metaKeywords ? post.metaKeywords.split(',').map((k: string) => k.trim()) : undefined
  const canonicalUrl = post.canonicalUrl ? `${origin}${post.canonicalUrl}` : undefined
  const ogImage = post.ogImage ? `${origin}${post.ogImage}` : (post.coverImage ? `${origin}${post.coverImage}` : undefined)
  const twitterImage = post.twitterImage ? `${origin}${post.twitterImage}` : (post.coverImage ? `${origin}${post.coverImage}` : undefined)

  return await generatePostMetadata({
    title,
    description,
    keywords,
    image: ogImage,
    url: canonicalUrl,
    type: 'article',
    author: post.author.name,
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt,
    tags: post.tags?.map((tag: any) => tag.name),
    allowIndexing: post.allowIndexing,
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    ogType: post.ogType,
    ogImage: ogImage,
    twitterTitle: post.twitterTitle,
    twitterDescription: post.twitterDescription,
    twitterCardType: post.twitterCardType,
    twitterImage: twitterImage,
    focusKeyword: post.focusKeyword,
  })
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params

  try {
    const post = await fetchPostByHandle(handle)

    if (!post) {
      notFound()
    }

    // Fetch related data using service functions
    const [relatedPosts, widgetPostsData, widgetCategories, widgetTags] = await Promise.all([
      fetchRelatedPosts(post.id, post.categories[0]?.id || null, 6),
      fetchPosts({ status: 'PUBLISHED', limit: 6 }),
      fetchCategories().then((cats) => cats.slice(0, 6)),
      fetchTags().then((tags) => tags.slice(0, 6)),
    ])

    const widgetPosts = widgetPostsData.posts

    return (
      <>
        <div className="single-post-page">
          <SingleHeaderContainer post={post} />

          <div className="container mt-12 flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/5 xl:w-2/3 xl:pe-20">
              <SingleContentContainer post={post} tags={post.tags || []} />
            </div>
            <div className="mt-12 w-full lg:mt-0 lg:w-2/5 lg:ps-10 xl:w-1/3 xl:ps-0">
              <div className="space-y-7 lg:sticky lg:top-7">
                <WidgetTags tags={widgetTags} />
                <WidgetCategories categories={widgetCategories} />
                <WidgetPosts posts={widgetPosts} />
              </div>
            </div>
          </div>

          <SingleRelatedPosts relatedPosts={relatedPosts} />
        </div>
      </>
    )
  } catch (error) {
    console.error('Error loading post:', error)
    notFound()
  }
}

export default Page
