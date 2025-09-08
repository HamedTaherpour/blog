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
    // Get all active menu items
    const allMenus = await prisma.headerMenuItem.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { level: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    })

    // Build hierarchy recursively
    const buildHierarchy = (parentId: string | null = null): HeaderMenuItem[] => {
      return allMenus
        .filter(menu => menu.parentId === parentId)
        .map(menu => ({
          id: menu.id,
          label: menu.label,
          href: menu.href,
          order: menu.order,
          isActive: menu.isActive,
          isExternal: menu.isExternal,
          children: buildHierarchy(menu.id),
        }))
    }

    return buildHierarchy()
  } catch (error) {
    console.error('Error fetching header menus:', error)
    return []
  }
}
