import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export interface FooterMenuGroup {
  id: string
  title: string
  order: number
  isActive: boolean
  menuItems: FooterMenuItem[]
}

export interface FooterMenuItem {
  id: string
  label: string
  href: string
  order: number
  isActive: boolean
  isExternal: boolean
}

export async function getFooterMenus(): Promise<FooterMenuGroup[]> {
  try {
    const footerMenus = await prisma.footerMenuGroup.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
      include: {
        menuItems: {
          where: {
            isActive: true,
          },
          orderBy: [
            { order: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
    })

    return footerMenus
  } catch (error) {
    console.error('Error fetching footer menus:', error)
    return []
  }
}
