import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { prisma } from '@/lib/prisma'
import { SiteSocialLinks } from '@/components/SiteSocialLinks'
import { Divider } from '@/shared/divider'
import { Metadata } from 'next'

const fallbackInfo = [
  {
    title: '🗺 ΔΙΕΥΘΥΝΣΗ',
    description: '—',
  },
  {
    title: '💌 EMAIL',
    description: '—',
  },
  {
    title: '☎ ΤΗΛΕΦΩΝΟ',
    description: '—',
  },
]

export const metadata: Metadata = {
  title: 'Επικοινωνία',
  description: 'Εξερευνήστε τη σελίδα επικοινωνίας',
}

async function getContactSettings() {
  // Server-side fetch directly from Prisma; ensure settings exist
  let settings = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        id: 1,
        siteName: 'My Blog',
        allowIndexing: true,
        ogType: 'website',
        twitterCardType: 'summary',
      },
    })
  }
  return settings
}

const PageContact = async () => {
  const settings = await getContactSettings()
  const s = settings as any
  const info = [
    {
      title: '🗺 ΔΙΕΥΘΥΝΣΗ',
      description: (s.contactAddress?.trim?.() as string) || '—',
    },
    {
      title: '💌 EMAIL',
      description: (s.contactEmail?.trim?.() as string) || '—',
    },
    {
      title: '☎ ΤΗΛΕΦΩΝΟ',
      description: (s.contactPhone?.trim?.() as string) || '—',
    },
  ]

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl">
        <div className="grid shrink-0 grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2">
          <div>
            <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">Επικοινωνία</h1>
            <div className="mt-10 flex max-w-sm flex-col gap-y-8 sm:mt-20">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold tracking-wider uppercase dark:text-neutral-200">{item.title}</h3>
                  <span className="mt-2 block text-neutral-500 dark:text-neutral-400">{item.description}</span>
                </div>
              ))}
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase dark:text-neutral-200">
                  🌏 ΚΟΙΝΩΝΙΚΑ ΔΙΚΤΥΑ
                </h3>
                <SiteSocialLinks className="flex gap-4 mt-2" />
              </div>
            </div>
          </div>
          {/* Contact form removed as requested */}
        </div>
      </div>

      {/* OTHER SECTIONS */}
      <div className="container mt-20 lg:mt-32">
        <Divider />
        <SectionSubscribe2 className="mt-20 lg:mt-32" />
      </div>
    </div>
  )
}

export default PageContact
