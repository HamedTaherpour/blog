'use client'

import FollowButton from '@/components/FollowButton'
import { TTag } from '@/data/categories'
import { Badge } from '@/shared/Badge'
import { Button } from '@/shared/Button'
import ButtonCircle from '@/shared/ButtonCircle'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/shared/dialog'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import {
  CopyLinkIcon,
  Facebook01Icon,
  Fire03Icon,
  Flag03Icon,
  Mail01Icon,
  MoreHorizontalIcon,
  NewTwitterIcon,
  Share03Icon,
  ViewOffSlashIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { useState } from 'react'

const PageHeader = ({ tag, className }: { tag: TTag; className?: string }) => {
  const { name, description, handle, count } = tag

  return (
    <div className={clsx('w-full', className)}>
      <div className="relative h-32 w-full bg-neutral-100 md:h-48 dark:bg-white/10" />
      <div className="container -mt-16">
        <div className="relative flex flex-col items-start gap-6 rounded-3xl border border-transparent bg-white p-5 shadow-xl md:flex-row md:rounded-4xl lg:p-8 dark:border-neutral-700 dark:bg-neutral-900">

          {/* INFO */}
          <div className="flex-1 lg:ps-4">
            <div className="max-w-(--breakpoint-sm) space-y-3.5">
              <div>
                <Badge color="indigo">#Tag</Badge>
                <h2 className="mt-2 text-2xl font-semibold lg:text-3xl">#{name}</h2>
              </div>
              <p className="text-sm/6 text-neutral-600 dark:text-neutral-300">{description}</p>
              <p className="mt-auto flex items-center gap-x-1 text-sm">
                <HugeiconsIcon icon={Fire03Icon} size={20} />
                <span>{count} άρθρα</span>
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-x-2 self-start">
            <ShareDropdown handle={handle} />
            <ActionDropdown handle={handle} tag={tag} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ShareDropdown({ handle }: { handle: string }) {
  const socialsShare = [
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook01Icon,
    },
    {
      name: 'Email',
      href: '#',
      icon: Mail01Icon,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: NewTwitterIcon,
    },
  ]

  return (
    <Dropdown>
      <DropdownButton as={ButtonCircle} outline className="size-10">
        <HugeiconsIcon icon={Share03Icon} size={20} />
      </DropdownButton>
      <DropdownMenu>
        {socialsShare.map((item, index) => (
          <DropdownItem key={index} href={item.href}>
            <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

function ActionDropdown({ handle, tag }: { handle: string; tag: TTag }) {
  const [isOpenDialogHideAuthor, setIsOpenDialogHideAuthor] = useState(false)
  const [isOpenDialogReportPost, setIsOpenDialogReportPost] = useState(false)

  const actions = [
    {
      name: 'Αντιγραφή συνδέσμου',
      icon: CopyLinkIcon,
      onClick: () => {
        navigator.clipboard.writeText(window.location.href)
      },
    },
  ]
  return (
    <>
      <Dropdown>
        <DropdownButton as={ButtonCircle} outline className="size-10">
          <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
        </DropdownButton>
        <DropdownMenu>
          {actions.map((item, index) => (
            <DropdownItem key={index} onClick={item.onClick}>
              <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
              {item.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* DIALOG HIDE AUTHOR */}
      <Dialog open={isOpenDialogHideAuthor} onClose={() => setIsOpenDialogHideAuthor(false)}>
        <DialogTitle>
          Απόκρυψη αυτής της ετικέτας? <span className="font-semibold">({tag.name.trim()})</span>
        </DialogTitle>
        <DialogBody>
          <p>
            Είστε σίγουροι ότι θέλετε να αποκρύψετε την <span className="font-semibold">{tag.name.trim()}</span>? Αυτή η ενέργεια θα
            αποκρύψει όλα τα άρθρα από αυτή την ετικέτα.
          </p>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpenDialogHideAuthor(false)}>
            Ακύρωση
          </Button>
          <Button onClick={() => setIsOpenDialogHideAuthor(false)}>Απόκρυψη</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG REPORT POST */}
      <Dialog open={isOpenDialogReportPost} onClose={() => setIsOpenDialogReportPost(false)}>
        <DialogTitle>Αναφορά αυτής της ετικέτας?</DialogTitle>
        <DialogBody>
          <p>
            Είστε σίγουροι ότι θέλετε να αναφέρετε την <span className="font-semibold">&quot;{tag.name.trim()}&quot;</span>?
            Αυτή η ενέργεια θα αναφέρει αυτή την ετικέτα.
          </p>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpenDialogReportPost(false)}>
            Ακύρωση
          </Button>
          <Button onClick={() => setIsOpenDialogReportPost(false)}>Αναφορά</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PageHeader
