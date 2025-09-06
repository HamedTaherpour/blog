'use client'

import SidebarNavigation from './Header/Navigation/SidebarNavigation'
import Aside from './aside'
import { HeaderMenuItem } from '@/lib/header-service'
import { TNavigationItem } from '@/data/navigation'

interface Props {
  className?: string
  headerMenus: HeaderMenuItem[]
}

const AsideSidebarNavigation = ({ className, headerMenus }: Props) => {
  // Transform header menus to TNavigationItem format
  const transformedMenus: TNavigationItem[] = headerMenus.map((menu) => ({
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

  return (
    <Aside openFrom="right" type="sidebar-navigation" logoOnHeading contentMaxWidthClassName="max-w-md">
      <div className="flex h-full flex-col">
        <div className="hidden-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-6">
          <SidebarNavigation data={transformedMenus} />
        </div>
      </div>
    </Aside>
  )
}

export default AsideSidebarNavigation
