'use client'

import Card20 from '@/components/PostCards/Card20'
import { TNavigationItem } from '@/data/navigation'
import { TPost } from '@/data/posts'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { FC, useCallback, useMemo, useState } from 'react'

const Lv1MenuItem = ({ menuItem }: { menuItem: TNavigationItem }) => {
  return (
    <Link
      className="flex items-center self-center rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 lg:text-[15px] xl:px-5 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      href={menuItem.href || '#'}
    >
      {menuItem.name}
      {!!menuItem.children?.length && (
        <ChevronDownIcon className="ms-1 -me-1 size-4 text-neutral-400" aria-hidden="true" />
      )}
    </Link>
  )
}

const MegaMenu = ({ menuItem, featuredPosts }: { menuItem: TNavigationItem; featuredPosts: TPost[] }) => {
  const renderNavlink = (item: TNavigationItem) => {
    return (
      <li key={item.id} className={clsx('menu-item', item.isNew && 'menuIsNew')}>
        <Link
          className="font-normal text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
          href={item.href || '#'}
        >
          {item.name}
        </Link>
      </li>
    )
  }

  return (
    <li className="menu-megamenu menu-item flex">
      <Lv1MenuItem menuItem={menuItem} />

      {menuItem.children?.length && menuItem.type === 'mega-menu' ? (
        <div className="absolute inset-x-0 top-full z-50 sub-menu">
          <div className="bg-white shadow-lg dark:bg-neutral-900">
            <div className="container">
              <div className="flex border-t border-neutral-200 py-11 text-sm dark:border-neutral-700">
                <div className="grid flex-1 grid-cols-4 gap-6 pe-10 xl:gap-8 2xl:pe-14">
                  {menuItem.children?.map((menuChild, index) => (
                    <div key={index}>
                      <p className="font-medium text-neutral-900 dark:text-neutral-200">{menuChild.name}</p>
                      <ul className="mt-4 grid space-y-4">{menuChild.children?.map(renderNavlink)}</ul>
                    </div>
                  ))}
                </div>
                <div className="grid w-2/7 grid-cols-1 gap-5 xl:w-4/9 xl:grid-cols-2">
                  {featuredPosts.map((post, index) => (
                    <Card20 key={post.id} post={post} className={clsx(index === 0 ? '' : 'hidden xl:block')} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </li>
  )
}

const DropdownMenu = ({ menuItem }: { menuItem: TNavigationItem }) => {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set())

  const toggleId = useCallback((id?: string) => {
    if (!id) return
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const isOpen = useCallback((id?: string) => (id ? openIds.has(id) : false), [openIds])

  const TreeItem: FC<{ item: TNavigationItem; level: number }> = ({ item, level }) => {
    const hasChildren = (item.children?.length ?? 0) > 0
    const open = isOpen(item.id)

    const paddingStart = useMemo(() => {
      // Increase indentation with level
      const base = 12 // px for ps-3
      const step = 12
      const total = base + level * step
      // Map to closest Tailwind padding utilities via inline style fallback
      return total
    }, [level])

    return (
      <li className="px-1" key={item.id}>
        {hasChildren ? (
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left font-normal text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            style={{ paddingInlineStart: paddingStart }}
            aria-expanded={open}
            onClick={() => toggleId(item.id)}
          >
            <span className="truncate">{item.name}</span>
            <ChevronDownIcon
              className={clsx(
                'ms-2 h-4 w-4 shrink-0 transition-transform duration-200',
                open ? 'rotate-180' : 'rotate-0'
              )}
              aria-hidden="true"
            />
          </button>
        ) : (
          <Link
            className="flex items-center rounded-md px-3 py-2 font-normal text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            style={{ paddingInlineStart: paddingStart }}
            href={item.href || '#'}
          >
            {item.name}
          </Link>
        )}

        {hasChildren && (
          <div
            className={clsx(
              'overflow-hidden ps-1',
              open ? 'max-h-[1000px]' : 'max-h-0',
              'transition-[max-height] duration-300'
            )}
            aria-hidden={!open}
          >
            <ul className="mt-1 space-y-1">
              {item.children?.map((child) => (
                <TreeItem key={child.id} item={child} level={level + 1} />
              ))}
            </ul>
          </div>
        )}
      </li>
    )
  }

  return (
    <li className="menu-dropdown relative menu-item flex">
      <Lv1MenuItem menuItem={menuItem} />
      {menuItem.children?.length && menuItem.type === 'dropdown' ? (
        <div className="absolute top-full left-0 z-50 sub-menu w-[22rem] max-w-[80vw]">
          <div className="relative rounded-lg bg-white py-3 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
            <ul className="max-h-[70vh] overflow-auto pr-1">
              {menuItem.children?.map((child) => (
                <TreeItem key={child.id} item={child} level={0} />
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </li>
  )
}

export interface Props {
  menu: TNavigationItem[]
  className?: string
  featuredPosts: TPost[]
}
const Navigation: FC<Props> = ({ menu, className, featuredPosts }) => {
  return (
    <ul className={clsx('flex', className)}>
      {menu.map((menuItem) => {
        if (menuItem.type === 'dropdown') {
          return <DropdownMenu key={menuItem.id} menuItem={menuItem} />
        }
        if (menuItem.type === 'mega-menu') {
          return <MegaMenu featuredPosts={featuredPosts} key={menuItem.id} menuItem={menuItem} />
        }
        return (
          <li key={menuItem.id} className="relative menu-item flex">
            <Lv1MenuItem key={menuItem.id} menuItem={menuItem} />
          </li>
        )
      })}
    </ul>
  )
}

export default Navigation
