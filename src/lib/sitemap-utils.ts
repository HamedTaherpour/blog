/**
 * Triggers sitemap regeneration by calling the regeneration webhook
 * This function is used across different API endpoints to ensure
 * the sitemap stays up-to-date when content changes
 */
export async function triggerSitemapRegeneration(): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

    const response = await fetch(`${baseUrl}/api/sitemap/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Failed to trigger sitemap regeneration:', response.status, response.statusText)
    } else {
      console.log('Sitemap regeneration triggered successfully')
    }
  } catch (error) {
    console.error('Error triggering sitemap regeneration:', error)
    // Don't throw error - sitemap regeneration failure shouldn't break the main operation
  }
}

/**
 * Checks if sitemap regeneration should be triggered based on content changes
 * @param oldStatus - Previous status of the content
 * @param newStatus - New status of the content
 * @returns true if sitemap should be regenerated
 */
export function shouldRegenerateSitemap(oldStatus?: string, newStatus?: string): boolean {
  // Regenerate if content becomes published or if published content changes
  return newStatus === 'PUBLISHED' || (oldStatus === 'PUBLISHED' && newStatus !== oldStatus)
}
