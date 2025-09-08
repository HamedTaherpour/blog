import { SiteSocialLinks } from '@/components/SiteSocialLinks'
import { FooterMenuGroup } from '@/lib/footer-service'
import { SiteSettings } from '@/lib/settings-service'
import Logo from '@/shared/Logo'
import React from 'react'

export interface WidgetFooterMenu {
  id: string
  title: string
}

interface FooterProps {
  footerMenus: FooterMenuGroup[]
  siteSettings?: SiteSettings
}

const Footer: React.FC<FooterProps> = ({ footerMenus, siteSettings }) => {
  const renderDatabaseFooterMenu = (group: FooterMenuGroup) => {
    if (!group.isActive) return null

    return (
      <div key={group.id} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">{group.title}</h2>
        <ul className="mt-5 space-y-4">
          {group.menuItems
            .filter((item) => item.isActive)
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <li key={item.id}>
                <a
                  className="text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                  href={item.href}
                  target={item.isExternal ? '_blank' : '_self'}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
        </ul>
      </div>
    )
  }

  return (
    <>
      {/* footer */}
      <div className="nc-Footer relative border-t border-neutral-200 py-16 lg:py-28 dark:border-neutral-700">
        <div className="container grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
          <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:flex lg:flex-col lg:md:col-span-1">
            <div className="col-span-2 md:col-span-1">
              <Logo logoUrl={siteSettings?.logoUrl || ''} />
            </div>
            <div className="col-span-2 flex items-center md:col-span-3">
              <SiteSocialLinks className="flex gap-4" />
            </div>
          </div>

          {/* Render database footer menus */}
          {footerMenus
            .filter((group) => group.isActive)
            .sort((a, b) => a.order - b.order)
            .map(renderDatabaseFooterMenu)}
        </div>
      </div>
    </>
  )
}

export default Footer
