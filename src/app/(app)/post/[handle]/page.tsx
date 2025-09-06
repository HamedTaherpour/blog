import WidgetCategories from '@/components/WidgetCategories'
import WidgetPosts from '@/components/WidgetPosts'
import WidgetTags from '@/components/WidgetTags'
import { fetchCategories, fetchPostByHandle, fetchPosts, fetchRelatedPosts, fetchTags } from '@/lib/api'
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
  const protocol = headersList.get('x-forwarded-proto') || 'http' // Default to http if not present
  const host = headersList.get('x-forwarded-host')

  const origin = `${protocol}://${host}`

  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.',
    }
  }

  // Use SEO fields if available, otherwise fallback to basic fields
  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt || 'Read this post on our blog'
  const keywords = post.seo?.metaKeywords || undefined
  const canonicalUrl = origin + post.seo?.canonicalUrl || undefined

  // Open Graph data
  const ogTitle = post.seo?.ogTitle || post.title
  const ogDescription = post.seo?.ogDescription || post.excerpt || description
  const ogType = post.seo?.ogType || 'article'
  const ogImage = origin + (post.seo?.ogImage || (post.featuredImage ? post.featuredImage.src : undefined))

  // Twitter Card data
  const twitterTitle = post.seo?.twitterTitle || post.title
  const twitterDescription = post.seo?.twitterDescription || post.excerpt || description
  const twitterCard = post.seo?.twitterCardType || 'summary_large_image'
  const twitterImage = origin + (post.seo?.twitterImage || (post.featuredImage ? post.featuredImage.src : undefined))

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords ? keywords.split(',').map((k: string) => k.trim()) : undefined,
    authors: [{ name: post.author.name }],
    robots: post.seo?.allowIndexing !== false ? 'index,follow' : 'noindex,nofollow',
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: ogType as any,
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
      siteName: 'NCMAZ Blog',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags?.map((tag: any) => tag.name) || undefined,
    },
    twitter: {
      card: twitterCard as any,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
      creator: `@${post.author.handle}`,
    },
  }

  return metadata
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
