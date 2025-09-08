'use client'

import { prisma } from '@/lib/prisma'
import SocialsList from '@/shared/SocialsList'
import { 
  Facebook01Icon, 
  InstagramIcon, 
  NewTwitterIcon, 
  YoutubeIcon,
  LinkedinIcon,
  GithubIcon,
  DiscordIcon,
  TiktokIcon,
  TelegramIcon,
  WhatsappIcon,
  SnapchatIcon,
  PinterestIcon,
  RedditIcon,
  TwitchIcon,
  VimeoIcon,
  BehanceIcon,
  DribbbleIcon,
  MediumIcon,
  TumblrIcon,
  SkypeIcon,
  SlackIcon,
  MailIcon,
  AiPhoneIcon,
  GlobeIcon
} from '@hugeicons/core-free-icons'
import { IconSvgElement } from '@hugeicons/react'

interface SiteSocialLinksProps {
  className?: string
}


async function getSocialMediaLinks() {
  // Server-side fetch dire ctly from Prisma; ensure settings exist
  const socialMediaLinks = await prisma.socialMediaLink.findMany()
  if (socialMediaLinks.length === 0) return []
  return socialMediaLinks
}


export async function SiteSocialLinks({ className }: SiteSocialLinksProps) {
  const socialMediaLinks = await getSocialMediaLinks()

  // Icon mapping
  const iconMapping: Record<string, IconSvgElement> = {
    'Facebook01Icon': Facebook01Icon,
    'NewTwitterIcon': NewTwitterIcon,
    'InstagramIcon': InstagramIcon,
    'YoutubeIcon': YoutubeIcon,
    'LinkedinIcon': LinkedinIcon,
    'GithubIcon': GithubIcon,
    'DiscordIcon': DiscordIcon,
    'TiktokIcon': TiktokIcon,
    'TelegramIcon': TelegramIcon,
    'WhatsappIcon': WhatsappIcon,
    'SnapchatIcon': SnapchatIcon,
    'PinterestIcon': PinterestIcon,
    'RedditIcon': RedditIcon,
    'TwitchIcon': TwitchIcon,
    'VimeoIcon': VimeoIcon,
    'BehanceIcon': BehanceIcon,
    'DribbbleIcon': DribbbleIcon,
    'MediumIcon': MediumIcon,
    'TumblrIcon': TumblrIcon,
    'SkypeIcon': SkypeIcon,
    'SlackIcon': SlackIcon,
    'MailIcon': MailIcon,
    'PhoneIcon': AiPhoneIcon,
    'GlobeIcon': GlobeIcon,
  }

  if (!socialMediaLinks || socialMediaLinks.length === 0) {
    return null
  }

  // Convert social media links to the format expected by SocialsList
  const socials = socialMediaLinks
    .filter(link => link.url && link.url.trim() !== '')
    .map(link => ({
      name: link.name,
      href: link.url,
      icon: iconMapping[link.iconName] || GlobeIcon
    }))

  if (socials.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <SocialsList socials={socials} />
    </div>
  )
}
