import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export interface HeaderMenuItem {
  id: string
  label: string
  href: string
  order: number
  isActive: boolean
  isExternal: boolean
  children?: HeaderMenuItem[]
}

export async function getHeaderMenus(): Promise<HeaderMenuItem[]> {
  try {
    const headerMenus = await prisma.headerMenuItem.findMany({
      where: {
        isActive: true,
        parentId: null, // Only get parent items
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
      include: {
        children: {
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

    return headerMenus
  } catch (error) {
    console.error('Error fetching header menus:', error)
    return []
  }
}
