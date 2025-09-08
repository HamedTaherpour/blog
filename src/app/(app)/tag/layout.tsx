import { ApplicationLayout } from '@/app/(app)/application-layout'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Layout: React.FC<Props> = async ({ children }) => {
  return (
    <ApplicationLayout>
      {children}

      <div className="container space-y-20 py-20 lg:space-y-28 lg:py-28">
        {/* SUBCRIBES */}
        <SectionSubscribe2 />
      </div>
    </ApplicationLayout>
  )
}

export default Layout
