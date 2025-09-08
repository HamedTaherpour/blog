import { canAccess } from '@/lib/api-middleware'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    // Check if user has permission to read settings
    const hasPermission = canAccess(session.user.role as UserRole, 'settings', 'read')
    if (!hasPermission) {
      return NextResponse.json(
        {
          message: 'Insufficient permissions to read settings',
          userRole: session.user.role,
        },
        { status: 403 }
      )
    }

    // Always get or create the single settings record with ID 1
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
    })

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          id: 1, // Explicitly set ID to 1
          siteName: 'My Blog',
          siteDesc: 'A modern blog platform',
          logoUrl: '',
          siteAuthor: '',
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          focusKeyword: '',
          canonicalUrl: '',
          allowIndexing: true,
          ogTitle: '',
          ogDescription: '',
          ogType: 'website',
          ogImage: '',
          twitterTitle: '',
          twitterDescription: '',
          twitterCardType: 'summary',
          twitterImage: '',
          // contact defaults
          contactAddress: '',
          contactEmail: '',
          contactPhone: '',
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    // Check if user has permission to update settings
    const hasPermission = canAccess(session.user.role as UserRole, 'settings', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        {
          message: 'Insufficient permissions to update settings',
          userRole: session.user.role,
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      siteName,
      siteDesc,
      logoUrl,
      siteAuthor,
      metaTitle,
      metaDescription,
      metaKeywords,
      focusKeyword,
      canonicalUrl,
      allowIndexing,
      ogTitle,
      ogDescription,
      ogType,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterCardType,
      twitterImage,
      contactAddress,
      contactEmail,
      contactPhone,
    } = body

    // Always update the single settings record with ID 1
    // First ensure the record exists, then update it
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
    })

    if (!settings) {
      // Create the single record if it doesn't exist
      settings = await prisma.siteSetting.create({
        data: {
          id: 1,
          siteName: siteName?.trim() || 'My Blog',
          siteDesc: siteDesc?.trim() || null,
          logoUrl: logoUrl?.trim() || null,
          siteAuthor: siteAuthor?.trim() || null,
          metaTitle: metaTitle?.trim() || null,
          metaDescription: metaDescription?.trim() || null,
          metaKeywords: metaKeywords?.trim() || null,
          focusKeyword: focusKeyword?.trim() || null,
          canonicalUrl: canonicalUrl?.trim() || null,
          allowIndexing: allowIndexing ?? true,
          ogTitle: ogTitle?.trim() || null,
          ogDescription: ogDescription?.trim() || null,
          ogType: ogType?.trim() || 'website',
          ogImage: ogImage?.trim() || null,
          twitterTitle: twitterTitle?.trim() || null,
          twitterDescription: twitterDescription?.trim() || null,
          twitterCardType: twitterCardType?.trim() || 'summary',
          twitterImage: twitterImage?.trim() || null,
          contactAddress: contactAddress?.trim() || null,
          contactEmail: contactEmail?.trim() || null,
          contactPhone: contactPhone?.trim() || null,
        },
      })
    } else {
      // Update only the provided fields
      settings = await prisma.siteSetting.update({
        where: { id: 1 },
        data: {
          siteName,
          siteDesc,
          logoUrl,
          siteAuthor,
          metaTitle,
          metaDescription,
          metaKeywords,
          focusKeyword,
          canonicalUrl,
          allowIndexing,
          ogTitle,
          ogDescription,
          ogType,
          ogImage,
          twitterTitle,
          twitterDescription,
          twitterCardType,
          twitterImage,
          contactAddress,
          contactEmail,
          contactPhone,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 })
  }
}
