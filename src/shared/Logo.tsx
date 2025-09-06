import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

interface Props extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: string
}

const Logo: React.FC<Props> = ({ className, size = 'size-12 sm:size-14', ...props }) => {
  return (
    <Link href="/" className={clsx('inline-block shrink-0  ', className, size)}>
      <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
    </Link>
  )
}

export default Logo
