'use client'

import { useSiteSettings } from '@/hooks/useSiteSettings'
import SocialsList from '@/shared/SocialsList'
import { Facebook01Icon, InstagramIcon, NewTwitterIcon, YoutubeIcon } from '@hugeicons/core-free-icons'

interface SiteSocialLinksProps {
  className?: string
}

export function SiteSocialLinks({ className }: SiteSocialLinksProps) {
  const { settings, loading } = useSiteSettings()

  if (loading || !settings) {
    return null
  }

  // Filter out empty social media links
  const socialLinks = [
    { name: 'Twitter', href: settings.twitter || '', icon: NewTwitterIcon },
    { name: 'Facebook', href: settings.facebook || '', icon: Facebook01Icon },
    { name: 'Instagram', href: settings.instagram || '', icon: InstagramIcon },
    { name: 'Youtube', href: settings.youtube || '', icon: YoutubeIcon },
  ].filter((link) => link.href && link.href.trim() !== '')

  if (socialLinks.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <SocialsList socials={socialLinks} />
    </div>
  )
}
