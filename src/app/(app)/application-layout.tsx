import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header2'
import AsideSidebarNavigation from '@/components/aside-sidebar-navigation'
import React, { ReactNode } from 'react'
import { getFooterMenus } from '@/lib/footer-service'
import { getHeaderMenus } from '@/lib/header-service'
import { getSiteSettings } from '@/lib/settings-service'

interface Props {
  children: ReactNode
  headerHasBorder?: boolean
}

const ApplicationLayout: React.FC<Props> = async ({
  children,
  headerHasBorder,
}) => {
  // Fetch footer and header menus on the server side
  const [footerMenus, headerMenus, siteSettings] = await Promise.all([
    getFooterMenus(),
    getHeaderMenus(),
    getSiteSettings(),
  ])

  return (
    <>
      {/* header - Chose header style here / header 1 or header 2*/}
      <Header bottomBorder={headerHasBorder} headerMenus={headerMenus} siteSettings={siteSettings || undefined} />

      {children}

      {/* footer - Chose footer style here / footer 1 or footer 2 or footer 3 or footer 4 */}
      <Footer footerMenus={footerMenus} siteSettings={siteSettings || undefined} />
      {/* aside sidebar navigation */}
      <AsideSidebarNavigation headerMenus={headerMenus} />
    </>
  )
}

export { ApplicationLayout }
