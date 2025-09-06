import rightImgDemo from '@/images/BecomeAnAuthorImg.png'
import ButtonPrimary from '@/shared/ButtonPrimary'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { FC } from 'react'

interface Props {
  className?: string
  rightImg?: string | StaticImageData
  heading?: string
  subHeading?: string
  buttonText?: string
  excerpt: string
}

const SectionBecomeAnAuthor: FC<Props> = ({
  className,
  rightImg = rightImgDemo,
  heading,
  subHeading,
  buttonText,
  excerpt,
}) => {
  return (
    <div className={clsx('section-become-an-author relative flex flex-col items-center lg:flex-row', className)}>
      <div className="mb-14 shrink-0 lg:mr-10 lg:mb-0 lg:w-2/5">
        <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">{subHeading}</span>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{heading}</h2>
        <span className="mt-8 block text-neutral-500 dark:text-neutral-400">{excerpt}</span>
        <ButtonPrimary className="mt-8">{buttonText}</ButtonPrimary>
      </div>
      <div className="grow">
        <Image alt="hero" sizes="(max-width: 768px) 100vw, 50vw" src={rightImg} />
      </div>
    </div>
  )
}

export default SectionBecomeAnAuthor
