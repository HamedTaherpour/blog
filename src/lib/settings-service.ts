import { prisma } from '@/lib/prisma'

export interface SiteSettings {
  id: number
  siteName: string
  siteDesc?: string | null
  logoUrl?: string | null
  twitter?: string | null
  facebook?: string | null
  instagram?: string | null
  siteAuthor?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  focusKeyword?: string | null
  canonicalUrl?: string | null
  allowIndexing: boolean
  ogTitle?: string | null
  ogDescription?: string | null
  ogType?: string | null
  ogImage?: string | null
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterCardType?: string | null
  twitterImage?: string | null
  linkedin?: string | null
  youtube?: string | null
  tiktok?: string | null
  github?: string | null
  discord?: string | null
  updatedAt: Date
}

export interface MetaTagsData {
  siteName: string
  siteDesc?: string
  siteAuthor?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  focusKeyword?: string
  canonicalUrl?: string
  allowIndexing?: boolean
  ogTitle?: string
  ogDescription?: string
  ogType?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterCardType?: string
  twitterImage?: string
}

export interface SocialMediaData {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
  github?: string
  discord?: string
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    // Always get the single settings record with ID 1
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 1 }
    })
    return settings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    // Always work with the single settings record with ID 1
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 1 }
    })

    // Build update data object with only provided fields
    const updateData: any = {}
    
    // Only include fields that are actually provided in the data object
    if (data.siteName !== undefined) updateData.siteName = data.siteName.trim()
    if (data.siteDesc !== undefined) updateData.siteDesc = data.siteDesc?.trim() || null
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl?.trim() || null
    if (data.twitter !== undefined) updateData.twitter = data.twitter?.trim() || null
    if (data.facebook !== undefined) updateData.facebook = data.facebook?.trim() || null
    if (data.instagram !== undefined) updateData.instagram = data.instagram?.trim() || null
    if (data.siteAuthor !== undefined) updateData.siteAuthor = data.siteAuthor?.trim() || null
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle?.trim() || null
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription?.trim() || null
    if (data.metaKeywords !== undefined) updateData.metaKeywords = data.metaKeywords?.trim() || null
    if (data.focusKeyword !== undefined) updateData.focusKeyword = data.focusKeyword?.trim() || null
    if (data.canonicalUrl !== undefined) updateData.canonicalUrl = data.canonicalUrl?.trim() || null
    if (data.allowIndexing !== undefined) updateData.allowIndexing = data.allowIndexing
    if (data.ogTitle !== undefined) updateData.ogTitle = data.ogTitle?.trim() || null
    if (data.ogDescription !== undefined) updateData.ogDescription = data.ogDescription?.trim() || null
    if (data.ogType !== undefined) updateData.ogType = data.ogType?.trim() || 'website'
    if (data.ogImage !== undefined) updateData.ogImage = data.ogImage?.trim() || null
    if (data.twitterTitle !== undefined) updateData.twitterTitle = data.twitterTitle?.trim() || null
    if (data.twitterDescription !== undefined) updateData.twitterDescription = data.twitterDescription?.trim() || null
    if (data.twitterCardType !== undefined) updateData.twitterCardType = data.twitterCardType?.trim() || 'summary'
    if (data.twitterImage !== undefined) updateData.twitterImage = data.twitterImage?.trim() || null
    if (data.linkedin !== undefined) updateData.linkedin = data.linkedin?.trim() || null
    if (data.youtube !== undefined) updateData.youtube = data.youtube?.trim() || null
    if (data.tiktok !== undefined) updateData.tiktok = data.tiktok?.trim() || null
    if (data.github !== undefined) updateData.github = data.github?.trim() || null
    if (data.discord !== undefined) updateData.discord = data.discord?.trim() || null

    if (!settings) {
      // Create the single record if it doesn't exist with default values
      const createData = {
        id: 1,
        siteName: 'My Blog',
        siteDesc: 'A modern blog platform',
        logoUrl: null,
        twitter: null,
        facebook: null,
        instagram: null,
        siteAuthor: null,
        metaTitle: null,
        metaDescription: null,
        metaKeywords: null,
        focusKeyword: null,
        canonicalUrl: null,
        allowIndexing: true,
        ogTitle: null,
        ogDescription: null,
        ogType: 'website',
        ogImage: null,
        twitterTitle: null,
        twitterDescription: null,
        twitterCardType: 'summary',
        twitterImage: null,
        linkedin: null,
        youtube: null,
        tiktok: null,
        github: null,
        discord: null,
        ...updateData // Override with provided values
      }
      
      settings = await prisma.siteSetting.create({
        data: createData
      })
    } else {
      // Update only the provided fields
      settings = await prisma.siteSetting.update({
        where: { id: 1 },
        data: updateData
      })
    }
    return settings
  } catch (error) {
    console.error('Error updating site settings:', error)
    throw new Error('Failed to update site settings')
  }
}

export async function updateMetaTags(data: MetaTagsData): Promise<SiteSettings> {
  try {
    return await updateSiteSettings(data)
  } catch (error) {
    console.error('Error updating meta tags:', error)
    throw new Error('Failed to update meta tags')
  }
}

export async function updateSocialMedia(data: SocialMediaData): Promise<SiteSettings> {
  try {
    return await updateSiteSettings(data)
  } catch (error) {
    console.error('Error updating social media:', error)
    throw new Error('Failed to update social media')
  }
}
