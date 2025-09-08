'use client'

import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/shared/Pagination'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useMemo } from 'react'

interface Props {
  totalPages?: number
  className?: string
}

function PaginationComponent({ totalPages = 1, className }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const currentPage = useMemo(() => {
    const p = Number(searchParams.get('page') || '1')
    return Number.isFinite(p) && p > 0 ? p : 1
  }, [searchParams])

  const pages = useMemo(() => {
    const result: Array<number | 'gap'> = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) result.push(i)
      return result
    }

    const add = (n: number | 'gap') => result.push(n)
    const showWindow = 1

    add(1)
    if (currentPage > 2 + showWindow) add('gap')

    const start = Math.max(2, currentPage - showWindow)
    const end = Math.min(totalPages - 1, currentPage + showWindow)

    for (let i = start; i <= end; i++) add(i)

    if (currentPage < totalPages - (1 + showWindow)) add('gap')
    add(totalPages)

    return result
  }, [currentPage, totalPages])

  if (totalPages <= 1) return null

  return (
    <Pagination className={className}>
      <PaginationPrevious
        href={currentPage > 1 ? pathname + '?' + createQueryString('page', (currentPage - 1).toString()) : null}
      />
      <PaginationList>
        {pages.map((p, idx) =>
          p === 'gap' ? (
            <PaginationGap key={`gap-${idx}`} />
          ) : (
            <PaginationPage key={p} current={p === currentPage} href={pathname + '?' + createQueryString('page', String(p))}>
              {p}
            </PaginationPage>
          )
        )}
      </PaginationList>
      <PaginationNext
        href={
          currentPage < totalPages ? pathname + '?' + createQueryString('page', (currentPage + 1).toString()) : null
        }
      />
    </Pagination>
  )
}

export default function PaginationWrapper(props: Props) {
  return (
    <Suspense>
      <PaginationComponent {...props} />
    </Suspense>
  )
}
