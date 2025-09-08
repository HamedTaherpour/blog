import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

interface Props extends React.SVGProps<SVGSVGElement> {
  className?: string
  logoUrl?: string
}

const Logo: React.FC<Props> = ({ className, logoUrl, ...props }) => {
  return (
    <Link href="/" className={clsx('inline-block shrink-0', className)}>
      <img src={logoUrl || '/images/logo.png'} alt="Logo" />
    </Link>
  )
}

export default Logo
