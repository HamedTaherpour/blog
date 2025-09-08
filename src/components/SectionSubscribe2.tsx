import rightImg from '@/images/SVG-subcribe2.png'
import { Badge } from '@/shared/Badge'
import ButtonCircle from '@/shared/ButtonCircle'
import Input from '@/shared/Input'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  className?: string
}

const SectionSubscribe2: FC<Props> = ({ className }) => {
  return (
    <div className={clsx('section-subscribe-2 relative flex flex-col items-center lg:flex-row', className)}>
      <div className="mb-14 shrink-0 lg:me-10 lg:mb-0 lg:w-2/5">
        <h2 className="text-4xl font-semibold">Γίνετε μέλος στο newsletter μας 🎉</h2>
        <span className="mt-6 block text-neutral-500 dark:text-neutral-400">
          Διαβάστε και μοιραστείτε νέες οπτικές σχεδόν για κάθε θέμα. Όλοι είναι ευπρόσδεκτοι.
        </span>
        <ul className="mt-10 space-y-5">
          <li className="flex items-center gap-x-4">
            <Badge color="blue">01</Badge>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Λάβετε περισσότερες εκπτώσεις</span>
          </li>
          <li className="flex items-center gap-x-4">
            <Badge color="red">02</Badge>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Αποκτήστε premium περιοδικά</span>
          </li>
        </ul>
        <form className="relative mt-10 max-w-sm" action={'#'} method="post">
          <Input required placeholder="Εισάγετε το email σας" type="email" name="email" />
          <div className="absolute end-1 top-1/2 -translate-y-1/2">
            <ButtonCircle color="dark/white" type="submit">
              <ArrowRightIcon className="size-5 rtl:rotate-180" />
            </ButtonCircle>
          </div>
        </form>
      </div>
      <div className="grow">
        <Image alt="subsc" sizes="(max-width: 768px) 100vw, 50vw" src={rightImg} />
      </div>
    </div>
  )
}

export default SectionSubscribe2
