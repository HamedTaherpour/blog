import { useState, useEffect } from 'react'
import { TNavigationItem } from '@/data/navigation'

interface HeaderMenuItem {
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
  parentId: string | null
  children?: HeaderMenuItem[]
}

export const useHeaderMenus = () => {
  const [menus, setMenus] = useState<TNavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeaderMenus = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/header-menus?active=true')
        if (!response.ok) {
          throw new Error('Failed to fetch header menus')
        }
        
        const data: HeaderMenuItem[] = await response.json()
        
        // Transform the data to match TNavigationItem format
        const transformedMenus: TNavigationItem[] = data.map((menu) => ({
          id: menu.id,
          name: menu.label,
          href: menu.href,
          type: menu.children && menu.children.length > 0 ? 'dropdown' : undefined,
          children: menu.children?.map((child) => ({
            id: child.id,
            name: child.label,
            href: child.href,
          })),
        }))
        
        setMenus(transformedMenus)
      } catch (err) {
        console.error('Error fetching header menus:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch header menus')
        // Fallback to empty array on error
        setMenus([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeaderMenus()
  }, [])

  return { menus, isLoading, error }
}