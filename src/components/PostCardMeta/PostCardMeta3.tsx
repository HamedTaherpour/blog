import { TPost } from '@/data/posts'
import { Link } from '@/shared/link'
import clsx from 'clsx'
import { FC } from 'react'
import LocalDate from '../LocalDate'

interface Props {
  className?: string
  date?: string
  author: TPost['author']
  readingTime?: number
}

const PostCardMeta3: FC<Props> = ({ className, author, readingTime, date }) => {
  const { name, handle } = author
  return (
    <div className={clsx('post-card-meta-3 relative flex items-center text-xs/5', className)}>
      <Link href={`/author/${handle}`} className="absolute inset-0" />

      <div className="size-10 rounded-full bg-neutral-200 flex items-center justify-center dark:bg-neutral-700">
        <svg className="size-6 text-neutral-500 dark:text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ms-3">
        <p className="font-semibold text-neutral-900 dark:text-neutral-200">{name}</p>
        <p className="flex items-center text-neutral-500 dark:text-neutral-400">
          <span>
            <LocalDate date={date ?? ''} options={{ year: 'numeric', month: 'long', day: 'numeric' }} />
          </span>
          {readingTime && (
            <>
              <span className="mx-1">·</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default PostCardMeta3
