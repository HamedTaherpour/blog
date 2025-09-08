import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import ThemeProvider from './theme-provider'
import SessionProvider from '@/components/providers/SessionProvider'
import { Toaster } from 'sonner'
import { generateSiteMetadata } from '@/lib/metadata'
import { SiteStructuredData } from '@/components/SiteStructuredData'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = await generateSiteMetadata()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={beVietnamPro.className}>
      <body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        <ThemeProvider>
          <SessionProvider>
            <div>{children}</div>
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <SiteStructuredData />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
