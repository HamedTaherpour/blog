import { prisma } from '@/lib/prisma'

export interface CategoryWithChildren {
  id: string
  slug: string
  name: string
  description: string | null
  image: string | null
  color: string | null
  order: number
  level: number
  path: string
  createdAt: Date
  updatedAt: Date
  parentId: string | null
  parent?: CategoryWithChildren | null
  children?: CategoryWithChildren[]
  _count?: {
    posts: number
  }
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  image?: string
  color?: string
  parentId?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogType?: string
  ogImage?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  iconType?: string
  iconMediaId?: string
  coverMediaId?: string
  ogImageMediaId?: string
  twitterImageMediaId?: string
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  order?: number
  level?: number
  path?: string
}

export interface ReorderCategoriesData {
  categoryId: string
  newOrder: number
  newParentId?: string
}

/**
 * Get all categories in hierarchical structure
 */
export async function getCategoriesHierarchy(): Promise<CategoryWithChildren[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true
        }
      }
    },
    orderBy: [
      { level: 'asc' },
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  return buildHierarchy(categories)
}

/**
 * Get categories as flat list with hierarchy info
 */
export async function getCategoriesFlat(): Promise<CategoryWithChildren[]> {
  return await prisma.category.findMany({
    include: {
      parent: true,
      _count: {
        select: {
          posts: true
        }
      }
    },
    orderBy: [
      { level: 'asc' },
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  })
}

/**
 * Get a single category with its hierarchy
 */
export async function getCategoryById(id: string): Promise<CategoryWithChildren | null> {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'asc' }
        ]
      },
      _count: {
        select: {
          posts: true
        }
      }
    }
  })
}

/**
 * Create a new category
 */
export async function createCategory(data: CreateCategoryData): Promise<CategoryWithChildren> {
  const parentId = data.parentId
  let level = 0
  let path = ''
  let order = 0

  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: parentId }
    })
    
    if (!parent) {
      throw new Error('Parent category not found')
    }

    level = parent.level + 1
    path = parent.path ? `${parent.path}/${parent.id}` : parent.id
    
    // Get the next order for this level
    const lastCategory = await prisma.category.findFirst({
      where: { parentId },
      orderBy: { order: 'desc' }
    })
    order = (lastCategory?.order ?? -1) + 1
  } else {
    // Get the next order for root level
    const lastCategory = await prisma.category.findFirst({
      where: { parentId: null },
      orderBy: { order: 'desc' }
    })
    order = (lastCategory?.order ?? -1) + 1
  }

  const category = await prisma.category.create({
    data: {
      ...data,
      level,
      path,
      order
    },
    include: {
      parent: true,
      _count: {
        select: {
          posts: true
        }
      }
    }
  })

  return category
}

/**
 * Update a category
 */
export async function updateCategory(id: string, data: UpdateCategoryData): Promise<CategoryWithChildren> {
  const existingCategory = await prisma.category.findUnique({
    where: { id }
  })

  if (!existingCategory) {
    throw new Error('Category not found')
  }

  // If parent is changing, update hierarchy
  if (data.parentId !== undefined && data.parentId !== existingCategory.parentId) {
    const newParentId = data.parentId
    let level = 0
    let path = ''

    if (newParentId) {
      const parent = await prisma.category.findUnique({
        where: { id: newParentId }
      })
      
      if (!parent) {
        throw new Error('Parent category not found')
      }

      // Prevent circular reference
      if (parent.path.includes(existingCategory.id)) {
        throw new Error('Cannot set parent to a descendant category')
      }

      level = parent.level + 1
      path = parent.path ? `${parent.path}/${parent.id}` : parent.id
    }

    // Update all descendants' levels and paths
    await updateDescendantsHierarchy(id, level, path)

    data.level = level
    data.path = path
  }

  const category = await prisma.category.update({
    where: { id },
    data,
    include: {
      parent: true,
      _count: {
        select: {
          posts: true
        }
      }
    }
  })

  return category
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      _count: {
        select: {
          posts: true
        }
      }
    }
  })

  if (!category) {
    throw new Error('Category not found')
  }

  if (category._count.posts > 0) {
    throw new Error('Cannot delete category with posts. Please move or delete posts first.')
  }

  if (category.children.length > 0) {
    throw new Error('Cannot delete category with subcategories. Please delete subcategories first.')
  }

  await prisma.category.delete({
    where: { id }
  })

  // Reorder remaining categories at the same level
  await reorderCategoriesAtLevel(category.parentId, category.order)
}

/**
 * Reorder categories
 */
export async function reorderCategories(data: ReorderCategoriesData[]): Promise<void> {
  for (const item of data) {
    const { categoryId, newOrder, newParentId } = item

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      throw new Error(`Category ${categoryId} not found`)
    }

    const oldParentId = category.parentId
    const oldOrder = category.order

    // If parent is changing
    if (newParentId !== undefined && newParentId !== oldParentId) {
      let level = 0
      let path = ''

      if (newParentId) {
        const parent = await prisma.category.findUnique({
          where: { id: newParentId }
        })
        
        if (!parent) {
          throw new Error('Parent category not found')
        }

        // Prevent circular reference
        if (parent.path.includes(categoryId)) {
          throw new Error('Cannot set parent to a descendant category')
        }

        level = parent.level + 1
        path = parent.path ? `${parent.path}/${parent.id}` : parent.id
      }

      // Update all descendants' levels and paths
      await updateDescendantsHierarchy(categoryId, level, path)

      // Update category
      await prisma.category.update({
        where: { id: categoryId },
        data: {
          parentId: newParentId,
          level,
          path
        }
      })
    }

    // Reorder categories
    await reorderCategoryAtLevel(categoryId, newOrder, newParentId ?? oldParentId)
  }
}

/**
 * Get category breadcrumb path
 */
export async function getCategoryBreadcrumb(categoryId: string): Promise<CategoryWithChildren[]> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      parent: true
    }
  })

  if (!category) {
    return []
  }

  const breadcrumb: CategoryWithChildren[] = [category]

  if (category.path) {
    const pathIds = category.path.split('/')
    const ancestors = await prisma.category.findMany({
      where: {
        id: {
          in: pathIds
        }
      },
      orderBy: {
        level: 'asc'
      }
    })

    breadcrumb.unshift(...ancestors)
  }

  return breadcrumb
}

/**
 * Helper function to build hierarchy from flat list
 */
function buildHierarchy(categories: CategoryWithChildren[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>()
  const rootCategories: CategoryWithChildren[] = []

  // Create map for quick lookup
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] })
  })

  // Build hierarchy
  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id)!
    
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId)
      if (parent) {
        parent.children!.push(categoryWithChildren)
      }
    } else {
      rootCategories.push(categoryWithChildren)
    }
  })

  return rootCategories
}

/**
 * Helper function to update descendants hierarchy
 */
async function updateDescendantsHierarchy(parentId: string, newLevel: number, newPath: string): Promise<void> {
  const descendants = await prisma.category.findMany({
    where: {
      path: {
        startsWith: parentId
      }
    }
  })

  for (const descendant of descendants) {
    const pathParts = descendant.path.split('/')
    const parentIndex = pathParts.indexOf(parentId)
    
    if (parentIndex !== -1) {
      const newDescendantPath = [...pathParts.slice(0, parentIndex), parentId, ...pathParts.slice(parentIndex + 1)].join('/')
      const newDescendantLevel = newLevel + (descendant.level - (pathParts.length - 1))

      await prisma.category.update({
        where: { id: descendant.id },
        data: {
          level: newDescendantLevel,
          path: newDescendantPath
        }
      })
    }
  }
}

/**
 * Helper function to reorder categories at a specific level
 */
async function reorderCategoriesAtLevel(parentId: string | null, removedOrder: number): Promise<void> {
  await prisma.category.updateMany({
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
 * Helper function to reorder a single category at a level
 */
async function reorderCategoryAtLevel(categoryId: string, newOrder: number, parentId: string | null): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })

  if (!category) {
    throw new Error('Category not found')
  }

  const oldOrder = category.order

  if (oldOrder === newOrder) {
    return
  }

  // Get all siblings at the same level
  const siblings = await prisma.category.findMany({
    where: { parentId },
    orderBy: { order: 'asc' }
  })

  // Create new order array
  const newOrderArray = siblings
    .filter(sibling => sibling.id !== categoryId)
    .map(sibling => ({ id: sibling.id, order: sibling.order }))

  // Insert the moved category at the new position
  newOrderArray.splice(newOrder, 0, { id: categoryId, order: newOrder })

  // Update all orders
  for (let i = 0; i < newOrderArray.length; i++) {
    await prisma.category.update({
      where: { id: newOrderArray[i].id },
      data: { order: i }
    })
  }
}
