'use client'

import { TPostDetail } from '@/data/posts'
import { Button } from '@/shared/Button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/shared/dialog'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import {
  ClipboardIcon,
  Facebook01Icon,
  Mail01Icon,
  MoreHorizontalIcon,
  NewTwitterIcon,
  Share03Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { FC, useState } from 'react'

function ActionDropdown({ handle, title, author }: { handle: string; title: string; author: TPostDetail['author'] }) {
  const [isOpenDialogHideAuthor, setIsOpenDialogHideAuthor] = useState(false)
  const [isOpenDialogReportPost, setIsOpenDialogReportPost] = useState(false)

  const actions = [
    {
      name: 'Αντιγραφή συνδέσμου',
      icon: ClipboardIcon,
      onClick: () => {
        navigator.clipboard.writeText(window.location.href)
      },
    },
  ]

  return (
    <>
      <Dropdown>
        <DropdownButton
          as="button"
          className="flex size-8.5 items-center justify-center rounded-full bg-neutral-50 transition-colors duration-300 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
        </DropdownButton>
        <DropdownMenu>
          {actions.map((item) => (
            <DropdownItem key={item.name} onClick={item.onClick}>
              <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
              {item.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* DIALOG HIDE AUTHOR */}
      <Dialog open={isOpenDialogHideAuthor} onClose={() => setIsOpenDialogHideAuthor(false)}>
        <DialogTitle>
          Απόκρυψη αυτού του συγγραφέα? <span className="font-semibold">({author.name.trim()})</span>
        </DialogTitle>
        <DialogBody>
          <p>
            Είστε σίγουροι ότι θέλετε να αποκρύψετε τον <span className="font-semibold">{author.name.trim()}</span>? Αυτή η ενέργεια
            θα αποκρύψει όλα τα άρθρα από αυτόν τον συγγραφέα.
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
        <DialogTitle>Αναφορά αυτού του άρθρου?</DialogTitle>
        <DialogBody>
          <p>
            Είστε σίγουροι ότι θέλετε να αναφέρετε το <span className="font-semibold">&quot;{title.trim()}&quot;</span>? Αυτή η
            ενέργεια θα αναφέρει αυτό το άρθρο.
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
      <DropdownButton
        as="button"
        className="flex size-8.5 items-center justify-center rounded-full bg-neutral-50 transition-colors duration-300 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20"
      >
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

interface Props extends Pick<TPostDetail, 'handle' | 'title' | 'author'> {
  className?: string
}

const SingleMetaAction: FC<Props> = ({ className, handle, title, author }) => {
  return (
    <div className={clsx('single-meta-action', className)}>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <ShareDropdown handle={handle} />
        <ActionDropdown handle={handle} title={title} author={author} />
      </div>
    </div>
  )
}

export { ActionDropdown, ShareDropdown, SingleMetaAction }
