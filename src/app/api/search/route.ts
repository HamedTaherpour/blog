import { NextRequest, NextResponse } from 'next/server'
import { searchPosts } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ 
        results: [], 
        total: 0, 
        query: '' 
      })
    }

    const postsResult = await searchPosts(query, { limit })
    
    return NextResponse.json({
      results: postsResult.posts,
      total: postsResult.total,
      query: query.trim()
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
