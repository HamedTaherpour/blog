import { Facebook01Icon, InstagramIcon, NewTwitterIcon, YoutubeIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  className?: string
  itemClass?: string
  socials: { name: string; href: string; icon: IconSvgElement }[]
}
 

const SocialsList: FC<Props> = ({ className, itemClass, socials }) => {
  return (
    <div className={clsx('flex gap-x-3.5', className)}>
      {socials.map((item, i) => (
        <Link key={i} className={clsx('block', itemClass)} href={item.href} target="_blank" rel="noopener noreferrer">
          <HugeiconsIcon icon={item.icon} size={20} />
        </Link>
      ))}
    </div>
  )
}

export default SocialsList
