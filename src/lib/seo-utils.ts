/**
 * SEO utility functions for auto-populating and validating SEO fields
 */

interface SEOData {
  title: string
  excerpt?: string | null
  content?: string
  featuredImageUrl?: string | null
}

interface SEOFields {
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  focusKeyword?: string | null
  canonicalUrl?: string | null
  allowIndexing?: boolean
  ogTitle?: string | null
  ogDescription?: string | null
  ogType?: string | null
  ogImage?: string | null
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterCardType?: string | null
  twitterImage?: string | null
}

interface SEOValidationResult {
  isValid: boolean
  errors: string[]
  autoPopulatedFields: Partial<SEOFields>
}

/**
 * Extracts keywords from text content
 */
function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  if (!text) return []

  // Remove HTML tags and normalize text
  const cleanText = text.replace(/<[^>]*>/g, ' ').toLowerCase()

  // Split into words and filter out common stop words
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'this',
    'that',
    'these',
    'those',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'me',
    'him',
    'her',
    'us',
    'them',
    'my',
    'your',
    'his',
    'her',
    'its',
    'our',
    'their',
    'mine',
    'yours',
    'hers',
    'ours',
    'theirs',
  ])

  const words = cleanText
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .filter((word) => /^[a-zA-Z]+$/.test(word)) // Only alphabetic words

  // Count word frequency
  const wordCount: Record<string, number> = {}
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word)
}

/**
 * Generates a meta description from content
 */
function generateMetaDescription(content: string, excerpt?: string | null, maxLength: number = 160): string {
  // Prioritize excerpt if available
  if (excerpt && excerpt.trim() !== '') {
    const cleanExcerpt = excerpt.trim()

    // If excerpt is within length limit, use it as is
    if (cleanExcerpt.length <= maxLength) {
      return cleanExcerpt
    }

    // If excerpt is too long, truncate it at word boundary
    const truncated = cleanExcerpt.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')

    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...'
    }

    return truncated + '...'
  }

  // Fallback to content if excerpt is empty or null
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanContent.length <= maxLength) {
    return cleanContent
  }

  // Truncate at word boundary
  const truncated = cleanContent.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }

  return truncated + '...'
}

/**
 * Generates canonical URL from title
 */
function generateCanonicalUrl(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  return `/posts/${slug}`
}

/**
 * Auto-populates SEO fields based on post data
 */
export function autoPopulateSEOFields(data: SEOData, existingFields: SEOFields = {}): Partial<SEOFields> {
  const autoPopulated: Partial<SEOFields> = {}

  // Auto-populate meta title if not provided
  if (!existingFields.metaTitle && data.title) {
    autoPopulated.metaTitle = data.title.length > 60 ? data.title.substring(0, 57) + '...' : data.title
  }

  // Auto-populate meta description if not provided
  // Always prioritize excerpt over content
  if (!existingFields.metaDescription && (data.excerpt || data.content)) {
    autoPopulated.metaDescription = generateMetaDescription(data.content || '', data.excerpt, 160)
  }

  // Auto-populate meta keywords if not provided
  if (!existingFields.metaKeywords && data.content) {
    const keywords = extractKeywords(data.content, 10)
    if (keywords.length > 0) {
      autoPopulated.metaKeywords = keywords.join(', ')
    }
  }

  // Auto-populate focus keyword from title if not provided
  if (!existingFields.focusKeyword && data.title) {
    const titleKeywords = extractKeywords(data.title, 1)
    if (titleKeywords.length > 0) {
      autoPopulated.focusKeyword = titleKeywords[0]
    }
  }

  // Auto-populate canonical URL if not provided
  if (!existingFields.canonicalUrl && data.title) {
    autoPopulated.canonicalUrl = generateCanonicalUrl(data.title)
  }

  // Auto-populate OG title if not provided
  if (!existingFields.ogTitle && data.title) {
    autoPopulated.ogTitle = data.title
  }

  // Auto-populate OG description if not provided
  // Always prioritize excerpt over content
  if (!existingFields.ogDescription && (data.excerpt || data.content)) {
    autoPopulated.ogDescription = generateMetaDescription(data.content || '', data.excerpt, 200)
  }

  // Auto-populate OG image with featured image if not provided
  if (!existingFields.ogImage && data.featuredImageUrl) {
    autoPopulated.ogImage = data.featuredImageUrl
  }

  // Auto-populate Twitter title if not provided
  if (!existingFields.twitterTitle && data.title) {
    autoPopulated.twitterTitle = data.title
  }

  // Auto-populate Twitter description if not provided
  // Always prioritize excerpt over content
  if (!existingFields.twitterDescription && (data.excerpt || data.content)) {
    autoPopulated.twitterDescription = generateMetaDescription(data.content || '', data.excerpt, 200)
  }

  // Auto-populate Twitter image with featured image if not provided
  if (!existingFields.twitterImage && data.featuredImageUrl) {
    autoPopulated.twitterImage = data.featuredImageUrl
  }

  // Set default values
  if (!existingFields.ogType) {
    autoPopulated.ogType = 'article'
  }

  if (!existingFields.twitterCardType) {
    autoPopulated.twitterCardType = 'summary_large_image'
  }

  if (existingFields.allowIndexing === undefined) {
    autoPopulated.allowIndexing = true
  }

  return autoPopulated
}

/**
 * Validates SEO fields and returns validation result
 */
export function validateSEOFields(fields: SEOFields): SEOValidationResult {
  const errors: string[] = []
  const autoPopulatedFields: Partial<SEOFields> = {}

  // Required fields validation
  if (!fields.metaTitle || fields.metaTitle.trim() === '') {
    errors.push('Meta title is required')
  }
  if (!fields.metaDescription || fields.metaDescription.trim() === '') {
    errors.push('Meta description is required')
  }

  if (!fields.focusKeyword || fields.focusKeyword.trim() === '') {
    errors.push('Focus keyword is required')
  }

  if (!fields.canonicalUrl || fields.canonicalUrl.trim() === '') {
    errors.push('Canonical URL is required')
  }

  // OG fields validation
  if (!fields.ogTitle || fields.ogTitle.trim() === '') {
    errors.push('OG title is required')
  }

  if (!fields.ogDescription || fields.ogDescription.trim() === '') {
    errors.push('OG description is required')
  }

  if (!fields.ogImage || fields.ogImage.trim() === '') {
    errors.push('OG image is required')
  }

  // Twitter fields validation
  if (!fields.twitterTitle || fields.twitterTitle.trim() === '') {
    errors.push('Twitter title is required')
  }

  if (!fields.twitterDescription || fields.twitterDescription.trim() === '') {
    errors.push('Twitter description is required')
  }

  if (!fields.twitterImage || fields.twitterImage.trim() === '') {
    errors.push('Twitter image is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
    autoPopulatedFields,
  }
}

/**
 * Processes SEO fields with auto-population and validation
 */
export function processSEOFields(
  postData: SEOData,
  submittedFields: SEOFields,
  featuredImageUrl?: string | null
): { processedFields: SEOFields; validationResult: SEOValidationResult } {
  // Add featured image URL to post data
  const dataWithImage = { ...postData, featuredImageUrl }

  // Auto-populate missing fields
  const autoPopulated = autoPopulateSEOFields(dataWithImage, submittedFields)

  // Merge submitted fields with auto-populated fields
  const processedFields: SEOFields = {
    ...submittedFields,
    ...autoPopulated,
  }

  // Validate the processed fields
  const validationResult = validateSEOFields(processedFields)

  return {
    processedFields,
    validationResult,
  }
}

/**
 * Site settings interface for SEO defaults
 */
interface SiteSettings {
  siteName: string
  siteDesc: string | null
  logoUrl: string | null
  twitter: string | null
  facebook: string | null
  instagram: string | null
}

/**
 * Generates default SEO meta tags based on site settings
 */
export function generateSiteDefaultMetaTags(settings: SiteSettings) {
  return {
    metaTitle: settings.siteName,
    metaDescription: settings.siteDesc || `Welcome to ${settings.siteName}`,
    ogTitle: settings.siteName,
    ogDescription: settings.siteDesc || `Welcome to ${settings.siteName}`,
    ogImage: settings.logoUrl,
    ogType: 'website',
    twitterTitle: settings.siteName,
    twitterDescription: settings.siteDesc || `Welcome to ${settings.siteName}`,
    twitterImage: settings.logoUrl,
    twitterCardType: 'summary_large_image',
  }
}

/**
 * Generates structured data for the site
 */
export function generateSiteStructuredData(settings: SiteSettings, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    description: settings.siteDesc,
    url: baseUrl,
    logo: settings.logoUrl ? `${baseUrl}${settings.logoUrl}` : undefined,
    sameAs: [
      settings.twitter,
      settings.facebook,
      settings.instagram,
    ].filter(Boolean),
  }
}