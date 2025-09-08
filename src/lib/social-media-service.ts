import { prisma } from '@/lib/prisma'

export interface SocialMediaLink {
  id: string
  name: string
  url: string
  iconName: string
  iconType: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateSocialMediaLinkData {
  name: string
  url: string
  iconName: string
  iconType?: string
  order?: number
  isActive?: boolean
}

export interface UpdateSocialMediaLinkData {
  name?: string
  url?: string
  iconName?: string
  iconType?: string
  order?: number
  isActive?: boolean
}

// Get all active social media links ordered by order
export async function getSocialMediaLinks(): Promise<SocialMediaLink[]> {
  try {
    const links = await prisma.socialMediaLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    return links
  } catch (error) {
    console.error('Error fetching social media links:', error)
    return []
  }
}

// Get all social media links (including inactive) for admin
export async function getAllSocialMediaLinks(): Promise<SocialMediaLink[]> {
  try {
    const links = await prisma.socialMediaLink.findMany({
      orderBy: { order: 'asc' }
    })
    return links
  } catch (error) {
    console.error('Error fetching all social media links:', error)
    return []
  }
}

// Create a new social media link
export async function createSocialMediaLink(data: CreateSocialMediaLinkData): Promise<SocialMediaLink> {
  try {
    const link = await prisma.socialMediaLink.create({
      data: {
        name: data.name.trim(),
        url: data.url.trim(),
        iconName: data.iconName.trim(),
        iconType: data.iconType?.trim() || 'hugeicons',
        order: data.order || 0,
        isActive: data.isActive ?? true
      }
    })
    return link
  } catch (error) {
    console.error('Error creating social media link:', error)
    throw new Error('Failed to create social media link')
  }
}

// Update a social media link
export async function updateSocialMediaLink(id: string, data: UpdateSocialMediaLinkData): Promise<SocialMediaLink> {
  try {
    const updateData: any = {}
    
    if (data.name !== undefined) updateData.name = data.name.trim()
    if (data.url !== undefined) updateData.url = data.url.trim()
    if (data.iconName !== undefined) updateData.iconName = data.iconName.trim()
    if (data.iconType !== undefined) updateData.iconType = data.iconType.trim()
    if (data.order !== undefined) updateData.order = data.order
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    const link = await prisma.socialMediaLink.update({
      where: { id },
      data: updateData
    })
    return link
  } catch (error) {
    console.error('Error updating social media link:', error)
    throw new Error('Failed to update social media link')
  }
}

// Delete a social media link
export async function deleteSocialMediaLink(id: string): Promise<void> {
  try {
    await prisma.socialMediaLink.delete({
      where: { id }
    })
  } catch (error) {
    console.error('Error deleting social media link:', error)
    throw new Error('Failed to delete social media link')
  }
}

// Reorder social media links
export async function reorderSocialMediaLinks(links: { id: string; order: number }[]): Promise<void> {
  try {
    await Promise.all(
      links.map(link =>
        prisma.socialMediaLink.update({
          where: { id: link.id },
          data: { order: link.order }
        })
      )
    )
  } catch (error) {
    console.error('Error reordering social media links:', error)
    throw new Error('Failed to reorder social media links')
  }
}
