import { prisma } from '@/lib/prisma'

export interface HeaderMenuItemWithChildren {
  id: string
  label: string
  href: string
  order: number
  level: number
  path: string
  isActive: boolean
  isExternal: boolean
  linkType: string
  linkId: string | null
  createdAt: Date
  updatedAt: Date
  parentId: string | null
  parent?: HeaderMenuItemWithChildren | null
  children?: HeaderMenuItemWithChildren[]
}

export interface CreateHeaderMenuItemData {
  label: string
  href: string
  linkType?: string
  linkId?: string
  parentId?: string
  isActive?: boolean
  isExternal?: boolean
}

export interface UpdateHeaderMenuItemData extends Partial<CreateHeaderMenuItemData> {
  order?: number
}

export interface ReorderHeaderMenuData {
  menuItemId: string
  newOrder: number
  newParentId?: string
}

/**
 * Get all header menu items in hierarchical structure
 */
export async function getHeaderMenusHierarchy(): Promise<HeaderMenuItemWithChildren[]> {
  const menuItems = await prisma.headerMenuItem.findMany({
    orderBy: [
      { level: 'asc' },
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  return buildMenuHierarchy(menuItems)
}

/**
 * Get header menu items as flat list
 */
export async function getHeaderMenusFlat(): Promise<HeaderMenuItemWithChildren[]> {
  return await prisma.headerMenuItem.findMany({
    include: {
      parent: true
    },
    orderBy: [
      { level: 'asc' },
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  })
}

/**
 * Get active header menu items for frontend
 */
export async function getActiveHeaderMenus(): Promise<HeaderMenuItemWithChildren[]> {
  const menuItems = await prisma.headerMenuItem.findMany({
    where: {
      isActive: true
    },
    orderBy: [
      { level: 'asc' },
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  // Filter to only show parent items (items without parentId)
  const parentMenus = menuItems.filter(menu => !menu.parentId)
  
  return buildMenuHierarchy(parentMenus)
}

/**
 * Create a new header menu item
 */
export async function createHeaderMenuItem(data: CreateHeaderMenuItemData): Promise<HeaderMenuItemWithChildren> {
  const parentId = data.parentId
  let level = 0
  let path = ''
  let order = 0

  if (parentId) {
    const parent = await prisma.headerMenuItem.findUnique({
      where: { id: parentId }
    })
    
    if (!parent) {
      throw new Error('Parent menu item not found')
    }

    level = parent.level + 1
    path = parent.path ? `${parent.path}/${parent.id}` : parent.id
    
    // Get the next order for this level
    const lastMenuItem = await prisma.headerMenuItem.findFirst({
      where: { parentId },
      orderBy: { order: 'desc' }
    })
    order = (lastMenuItem?.order ?? -1) + 1
  } else {
    // Get the next order for root level
    const lastMenuItem = await prisma.headerMenuItem.findFirst({
      where: { parentId: null },
      orderBy: { order: 'desc' }
    })
    order = (lastMenuItem?.order ?? -1) + 1
  }

  const menuItem = await prisma.headerMenuItem.create({
    data: {
      ...data,
      level,
      path,
      order,
      linkType: data.linkType || 'custom',
      isActive: data.isActive !== false,
      isExternal: data.isExternal || false
    }
  })

  return menuItem
}

/**
 * Update a header menu item
 */
export async function updateHeaderMenuItem(id: string, data: UpdateHeaderMenuItemData): Promise<HeaderMenuItemWithChildren> {
  const existingMenuItem = await prisma.headerMenuItem.findUnique({
    where: { id }
  })

  if (!existingMenuItem) {
    throw new Error('Menu item not found')
  }

  // If parent is changing, update hierarchy
  if (data.parentId !== undefined && data.parentId !== existingMenuItem.parentId) {
    const newParentId = data.parentId
    let level = 0
    let path = ''

    if (newParentId) {
      const parent = await prisma.headerMenuItem.findUnique({
        where: { id: newParentId }
      })
      
      if (!parent) {
        throw new Error('Parent menu item not found')
      }

      // Prevent circular reference
      if (parent.path.includes(existingMenuItem.id)) {
        throw new Error('Cannot set parent to a descendant menu item')
      }

      level = parent.level + 1
      path = parent.path ? `${parent.path}/${parent.id}` : parent.id
    }

    // Update all descendants' levels and paths
    await updateMenuDescendantsHierarchy(id, level, path)

    const updatedItem = await prisma.headerMenuItem.update({
      where: { id },
      data: {
        ...data,
        level,
        path,
        order: data.order ?? existingMenuItem.order
      }
    })

    return updatedItem
  }

  const menuItem = await prisma.headerMenuItem.update({
    where: { id },
    data: {
      ...data,
      order: data.order ?? existingMenuItem.order
    }
  })

  return menuItem
}

/**
 * Delete a header menu item
 */
export async function deleteHeaderMenuItem(id: string): Promise<void> {
  const menuItem = await prisma.headerMenuItem.findUnique({
    where: { id },
    include: {
      children: true
    }
  })

  if (!menuItem) {
    throw new Error('Menu item not found')
  }

  // Delete all children first
  if (menuItem.children && menuItem.children.length > 0) {
    for (const child of menuItem.children) {
      await deleteHeaderMenuItem(child.id)
    }
  }

  // Delete the item itself
  await prisma.headerMenuItem.delete({
    where: { id }
  })

  // Reorder remaining items at the same level
  await reorderMenuItemsAtLevel(menuItem.parentId, menuItem.order)
}

/**
 * Perform bulk actions on header menu items
 */
export async function bulkUpdateHeaderMenuItems(
  action: string,
  itemIds: string[]
): Promise<{ message: string; affectedCount: number }> {
  let affectedCount = 0

  switch (action) {
    case 'activate':
      const activateResult = await prisma.headerMenuItem.updateMany({
        where: { id: { in: itemIds } },
        data: { isActive: true }
      })
      affectedCount = activateResult.count
      break

    case 'deactivate':
      const deactivateResult = await prisma.headerMenuItem.updateMany({
        where: { id: { in: itemIds } },
        data: { isActive: false }
      })
      affectedCount = deactivateResult.count
      break

    case 'delete':
      // Delete items one by one to handle children properly
      for (const id of itemIds) {
        await deleteHeaderMenuItem(id)
        affectedCount++
      }
      break

    default:
      throw new Error(`Unknown bulk action: ${action}`)
  }

  return {
    message: `Bulk ${action} completed successfully`,
    affectedCount
  }
}

/**
 * Get link options for menu items (categories, tags, pages)
 */
export async function getLinkOptions() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        level: true,
        parentId: true
      },
      orderBy: { name: 'asc' }
    }),
    prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: { name: 'asc' }
    })
  ])

  // Format categories
  const formattedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    href: `/category/${cat.slug}`,
    type: 'category',
    level: cat.level,
    parentId: cat.parentId
  }))

  // Format tags
  const formattedTags = tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    href: `/tag/${tag.slug}`,
    type: 'tag'
  }))

  // Predefined pages
  const predefinedPages = [
    { id: 'home', name: 'Αρχική', href: '/', type: 'page' },
    { id: 'about', name: 'Σχετικά', href: '/about', type: 'page' },
    { id: 'contact', name: 'Επικοινωνία', href: '/contact', type: 'page' },
    { id: 'search', name: 'Αναζήτηση', href: '/search', type: 'page' },
  ]

  return {
    categories: formattedCategories,
    tags: formattedTags,
    pages: predefinedPages
  }
}

/**
 * Reorder header menu items
 */
export async function reorderHeaderMenuItems(items: HeaderMenuItemWithChildren[]): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    await prisma.headerMenuItem.update({
      where: { id: item.id },
      data: { order: i }
    })
  }
}

/**
 * Reorder multiple header menu items
 */
export async function reorderHeaderMenus(reorderData: ReorderHeaderMenuData[]): Promise<void> {
  for (const data of reorderData) {
    await reorderHeaderMenuItem(data)
  }
}

/**
 * Reorder a single menu item
 */
export async function reorderHeaderMenuItem(data: ReorderHeaderMenuData): Promise<void> {
  const menuItem = await prisma.headerMenuItem.findUnique({
    where: { id: data.menuItemId }
  })

  if (!menuItem) {
    throw new Error('Menu item not found')
  }

  const oldOrder = menuItem.order
  const oldParentId = menuItem.parentId

  if (oldOrder === data.newOrder && oldParentId === data.newParentId) {
    return
  }

  // If parent is changing, update hierarchy
  if (data.newParentId !== oldParentId) {
    const newParentId = data.newParentId
    let level = 0
    let path = ''

    if (newParentId) {
      const parent = await prisma.headerMenuItem.findUnique({
        where: { id: newParentId }
      })
      
      if (!parent) {
        throw new Error('Parent menu item not found')
      }

      // Prevent circular reference
      if (parent.path.includes(menuItem.id)) {
        throw new Error('Cannot set parent to a descendant menu item')
      }

      level = parent.level + 1
      path = parent.path ? `${parent.path}/${parent.id}` : parent.id
    }

    // Update all descendants' levels and paths
    await updateMenuDescendantsHierarchy(menuItem.id, level, path)

    await prisma.headerMenuItem.update({
      where: { id: menuItem.id },
      data: {
        parentId: newParentId || null,
        level,
        path
      }
    })
  }

  // Reorder items at the old level
  await reorderMenuItemsAtLevel(oldParentId, oldOrder)

  // Reorder items at the new level
  await reorderMenuItemAtLevel(menuItem.id, data.newOrder, data.newParentId || null)
}

/**
 * Build menu hierarchy from flat list
 */
function buildMenuHierarchy(menuItems: any[]): HeaderMenuItemWithChildren[] {
  const itemMap = new Map<string, HeaderMenuItemWithChildren>()
  const rootItems: HeaderMenuItemWithChildren[] = []

  // Create a map of all items
  menuItems.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] })
  })

  // Build hierarchy
  menuItems.forEach(item => {
    const menuItem = itemMap.get(item.id)!
    
    if (item.parentId) {
      const parent = itemMap.get(item.parentId)
      if (parent) {
        parent.children!.push(menuItem)
      }
    } else {
      rootItems.push(menuItem)
    }
  })

  return rootItems
}

/**
 * Update menu descendants hierarchy
 */
async function updateMenuDescendantsHierarchy(parentId: string, parentLevel: number, parentPath: string): Promise<void> {
  const children = await prisma.headerMenuItem.findMany({
    where: { parentId }
  })

  for (const child of children) {
    const newLevel = parentLevel + 1
    const newPath = parentPath ? `${parentPath}/${parentId}` : parentId

    await prisma.headerMenuItem.update({
      where: { id: child.id },
      data: {
        level: newLevel,
        path: newPath
      }
    })

    // Recursively update grandchildren
    await updateMenuDescendantsHierarchy(child.id, newLevel, newPath)
  }
}

/**
 * Helper function to reorder menu items at a level
 */
async function reorderMenuItemsAtLevel(parentId: string | null, removedOrder: number): Promise<void> {
  await prisma.headerMenuItem.updateMany({
    where: {
      parentId,
      order: {
        gt: removedOrder
      }
    },
    data: {
      order: {
        decrement: 1
      }
    }
  })
}

/**
 * Helper function to reorder a single menu item at a level
 */
async function reorderMenuItemAtLevel(menuItemId: string, newOrder: number, parentId: string | null): Promise<void> {
  const menuItem = await prisma.headerMenuItem.findUnique({
    where: { id: menuItemId }
  })

  if (!menuItem) {
    throw new Error('Menu item not found')
  }

  const oldOrder = menuItem.order

  if (oldOrder === newOrder) {
    return
  }

  // Get all siblings at the same level
  const siblings = await prisma.headerMenuItem.findMany({
    where: { parentId },
    orderBy: { order: 'asc' }
  })

  // Create new order array
  const newOrderArray = siblings
    .filter(sibling => sibling.id !== menuItemId)
    .map(sibling => ({ id: sibling.id, order: sibling.order }))

  // Insert the moved menu item at the new position
  newOrderArray.splice(newOrder, 0, { id: menuItemId, order: newOrder })

  // Update all orders
  for (let i = 0; i < newOrderArray.length; i++) {
    await prisma.headerMenuItem.update({
      where: { id: newOrderArray[i].id },
      data: { order: i }
    })
  }
}