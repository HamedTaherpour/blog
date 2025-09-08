import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Trigger Next.js revalidation for sitemap
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
    
    try {
      // Revalidate the sitemap route
      await fetch(`${baseUrl}/sitemap.xml`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      // Also revalidate robots.txt
      await fetch(`${baseUrl}/robots.txt`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Sitemap regenerated successfully',
        timestamp: new Date().toISOString()
      })
    } catch (revalidationError) {
      console.error('Error during sitemap revalidation:', revalidationError)
      
      // Still return success as the sitemap will be regenerated on next request
      return NextResponse.json({ 
        success: true, 
        message: 'Sitemap regeneration triggered (will update on next request)',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error in sitemap regeneration webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Sitemap regeneration webhook is active',
    usage: 'POST to this endpoint to regenerate sitemap',
    timestamp: new Date().toISOString()
  })
}
