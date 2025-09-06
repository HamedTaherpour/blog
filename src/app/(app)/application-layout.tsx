import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header2'
import AsideSidebarNavigation from '@/components/aside-sidebar-navigation'
import Banner from '@/shared/banner'
import React, { ReactNode } from 'react'
import { getFooterMenus } from '@/lib/footer-service'
import { getHeaderMenus } from '@/lib/header-service'

interface Props {
  children: ReactNode
  headerHasBorder?: boolean
  showBanner?: boolean
}

const ApplicationLayout: React.FC<Props> = async ({
  children,
  headerHasBorder,
  showBanner = false,
}) => {
  // Fetch footer and header menus on the server side
  const [footerMenus, headerMenus] = await Promise.all([
    getFooterMenus(),
    getHeaderMenus(),
  ])

  return (
    <>
      {/* header - Chose header style here / header 1 or header 2*/}
      {showBanner && <Banner />}
      <Header bottomBorder={headerHasBorder} headerMenus={headerMenus} />

      {children}

      {/* footer - Chose footer style here / footer 1 or footer 2 or footer 3 or footer 4 */}
      <Footer footerMenus={footerMenus} />
      {/* aside sidebar navigation */}
      <AsideSidebarNavigation headerMenus={headerMenus} />
    </>
  )
}

export { ApplicationLayout }
