/**
 * Category SEO utility functions for auto-populating and validating SEO fields
 */

interface CategorySEOData {
  name: string
  description?: string | null
  image?: string | null
}

interface CategorySEOFields {
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogType?: string | null
  ogImage?: string | null
  twitterCard?: string | null
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterImage?: string | null
}

interface CategorySEOValidationResult {
  isValid: boolean
  errors: string[]
  autoPopulatedFields: Partial<CategorySEOFields>
}

/**
 * Extracts keywords from category name and description
 */
function extractCategoryKeywords(name: string, description?: string | null, maxKeywords: number = 8): string[] {
  const text = `${name} ${description || ''}`.toLowerCase()
  
  // Remove HTML tags and normalize text
  const cleanText = text.replace(/<[^>]*>/g, ' ')
  
  // Split into words and filter out common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
    'category', 'categories', 'post', 'posts', 'article', 'articles', 'content', 'blog'
  ])
  
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter(word => /^[a-zA-Z]+$/.test(word)) // Only alphabetic words
  
  // Count word frequency
  const wordCount: Record<string, number> = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word)
}

/**
 * Generates a meta description for categories
 */
function generateCategoryMetaDescription(name: string, description?: string | null, maxLength: number = 160): string {
  // Prioritize description if available
  if (description && description.trim() !== '') {
    const cleanDescription = description.trim()
    
    // If description is within length limit, use it as is
    if (cleanDescription.length <= maxLength) {
      return cleanDescription
    }
    
    // If description is too long, truncate it at word boundary
    const truncated = cleanDescription.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...'
    }
    
    return truncated + '...'
  }
  
  // Fallback to category name with generic description
  const genericDescription = `Explore ${name} posts and articles. Find the latest content in ${name} category.`
  
  if (genericDescription.length <= maxLength) {
    return genericDescription
  }
  
  // Truncate at word boundary
  const truncated = genericDescription.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }
  
  return truncated + '...'
}

/**
 * Generates canonical URL for categories
 */
function generateCategoryCanonicalUrl(slug: string, baseUrl: string = process.env.NEXTAUTH_URL || 'https://example.com'): string {
  return `${baseUrl}/category/${slug}`
}

/**
 * Auto-populates category SEO fields based on category data
 */
export function autoPopulateCategorySEOFields(data: CategorySEOData, existingFields: CategorySEOFields = {}): Partial<CategorySEOFields> {
  const autoPopulated: Partial<CategorySEOFields> = {}
  
  // Auto-populate meta title if not provided
  if (!existingFields.metaTitle && data.name) {
    const metaTitle = `${data.name} - Category`
    autoPopulated.metaTitle = metaTitle.length > 60 
      ? metaTitle.substring(0, 57) + '...' 
      : metaTitle
  }
  
  // Auto-populate meta description if not provided
  // Always prioritize description over name
  if (!existingFields.metaDescription && (data.description || data.name)) {
    autoPopulated.metaDescription = generateCategoryMetaDescription(
      data.name, 
      data.description, 
      160
    )
  }
  
  // Auto-populate meta keywords if not provided
  if (!existingFields.metaKeywords && (data.name || data.description)) {
    const keywords = extractCategoryKeywords(data.name, data.description, 8)
    if (keywords.length > 0) {
      autoPopulated.metaKeywords = keywords.join(', ')
    }
  }
  
  // Auto-populate canonical URL if not provided
  if (!existingFields.canonicalUrl && data.name) {
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    autoPopulated.canonicalUrl = generateCategoryCanonicalUrl(slug)
  }
  
  // Auto-populate OG title if not provided
  if (!existingFields.ogTitle && data.name) {
    autoPopulated.ogTitle = `${data.name} - Category`
  }
  
  // Auto-populate OG description if not provided
  // Always prioritize description over name
  if (!existingFields.ogDescription && (data.description || data.name)) {
    autoPopulated.ogDescription = generateCategoryMetaDescription(
      data.name, 
      data.description, 
      200
    )
  }
  
  // Auto-populate OG image with category image if not provided
  if (!existingFields.ogImage && data.image) {
    autoPopulated.ogImage = data.image
  }
  
  // Auto-populate Twitter title if not provided
  if (!existingFields.twitterTitle && data.name) {
    autoPopulated.twitterTitle = `${data.name} - Category`
  }
  
  // Auto-populate Twitter description if not provided
  // Always prioritize description over name
  if (!existingFields.twitterDescription && (data.description || data.name)) {
    autoPopulated.twitterDescription = generateCategoryMetaDescription(
      data.name, 
      data.description, 
      200
    )
  }
  
  // Auto-populate Twitter image with category image if not provided
  if (!existingFields.twitterImage && data.image) {
    autoPopulated.twitterImage = data.image
  }
  
  // Set default values
  if (!existingFields.ogType) {
    autoPopulated.ogType = 'website'
  }
  
  if (!existingFields.twitterCard) {
    autoPopulated.twitterCard = 'summary_large_image'
  }
  
  return autoPopulated
}

/**
 * Validates category SEO fields and returns validation result
 */
export function validateCategorySEOFields(fields: CategorySEOFields): CategorySEOValidationResult {
  const errors: string[] = []
  const autoPopulatedFields: Partial<CategorySEOFields> = {}
  
  // Required fields validation
  if (!fields.metaTitle || fields.metaTitle.trim() === '') {
    errors.push('Meta title is required')
  } 
  
  if (!fields.metaDescription || fields.metaDescription.trim() === '') {
    errors.push('Meta description is required')
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
    autoPopulatedFields
  }
}

/**
 * Processes category SEO fields with auto-population and validation
 */
export function processCategorySEOFields(
  categoryData: CategorySEOData, 
  submittedFields: CategorySEOFields,
  categoryImage?: string | null
): { processedFields: CategorySEOFields; validationResult: CategorySEOValidationResult } {
  // Add category image to category data
  const dataWithImage = { ...categoryData, image: categoryImage }
  
  // Auto-populate missing fields
  const autoPopulated = autoPopulateCategorySEOFields(dataWithImage, submittedFields)
  
  // Merge submitted fields with auto-populated fields
  const processedFields: CategorySEOFields = {
    ...submittedFields,
    ...autoPopulated
  }
  
  // Validate the processed fields
  const validationResult = validateCategorySEOFields(processedFields)
  
  return {
    processedFields,
    validationResult
  }
}
