'use client'

import { useAuth } from '@/hooks/useAuth'
import { HeaderMenuItem } from '@/lib/header-service'
import { SiteSettings } from '@/lib/settings-service'
import { Button } from '@/shared/Button'
import Logo from '@/shared/Logo'
import { PlusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { FC } from 'react'
import AvatarDropdown from './AvatarDropdown'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import Navigation from './Navigation/Navigation'
import SearchModal from './SearchModal'

interface TNavigationItem {
  id: string
  name: string
  href: string
  type?: 'dropdown' | 'mega-menu'
  children?: TNavigationItem[]
}

interface Props {
  bottomBorder?: boolean
  className?: string
  headerMenus: HeaderMenuItem[]
  siteSettings?: SiteSettings
}

const Header2: FC<Props> = ({ bottomBorder, className, headerMenus, siteSettings }) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  // Transform header menus to TNavigationItem format recursively
  const transformMenu = (menu: HeaderMenuItem): TNavigationItem => ({
    id: menu.id,
    name: menu.label,
    href: menu.href,
    type: menu.children && menu.children.length > 0 ? 'dropdown' : undefined,
    children: menu.children?.map(transformMenu),
  })

  const transformedMenus: TNavigationItem[] = headerMenus.map(transformMenu)

  return (
    <div
      className={clsx(
        'header-2 relative z-20 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
        bottomBorder && 'border-b',
        !bottomBorder && 'has-[.header-popover-full-panel]:border-b',
        className
      )}
    >
      <div className="container flex h-20 justify-between">
        <div className="flex flex-1 items-center gap-x-4 sm:gap-x-5 lg:gap-x-7">
          <Logo logoUrl={siteSettings?.logoUrl || ''} />
          <div className="h-8 border-l" />
          <div className="-ms-1.5">
            <SearchModal type="type1" />
          </div>
        </div>

        <div className="mx-4 hidden flex-2 justify-center lg:flex">
          <Navigation menu={transformedMenus} featuredPosts={[]} />
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-0.5">
          {!isLoading && isAuthenticated && (
            <>
              <div className="hidden sm:block">
                <Button className="h-10 px-3!" href={'/dashboard/posts/new'} plain>
                  <PlusIcon className="size-5!" />
                  Δημιουργία
                </Button>
              </div>
              <AvatarDropdown />
            </>
          )}
          <div className="ms-2 flex lg:hidden">
            <HamburgerBtnMenu />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header2
