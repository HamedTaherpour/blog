'use client'

import { TPost } from '@/data/posts'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { HeadingWithSubProps } from '@/shared/Heading'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { FC, useState, useMemo } from 'react'
import Card8 from './PostCards/Card8'
import Card9 from './PostCards/Card9'
import SectionTabHeader from './SectionTabHeader'

type Props = Pick<HeadingWithSubProps, 'subHeading' | 'dimHeading'> & {
  posts: TPost[]
  categories: Array<{
    id: string
    name: string
    handle: string
  }>
  className?: string
  heading?: string
}

const SectionMagazine4: FC<Props> = ({ posts, categories, heading, className, subHeading, dimHeading }) => {
  const [activeTab, setActiveTab] = useState('All')

  // Create tabs array with "All" as first tab and category names
  const tabs = useMemo(() => {
    return ['All', ...categories.slice(0, 4).map(cat => cat.name)]
  }, [categories])

  // Filter posts based on active tab
  const filteredPosts = useMemo(() => {
    if (activeTab === 'All') {
      return posts
    }
    
    const selectedCategory = categories.find(cat => cat.name === activeTab)
    if (!selectedCategory) {
      return posts
    }
    
    return posts.filter(post => 
      post.categories.some(cat => cat.id === selectedCategory.id)
    )
  }, [posts, categories, activeTab])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className={clsx('section-magazine-4 relative', className)}>
      <SectionTabHeader
        heading={heading}
        subHeading={subHeading}
        dimHeading={dimHeading}
        tabActive={activeTab}
        tabs={tabs}
        onChangeTab={handleTabChange}
      />

      {!filteredPosts?.length && <span>Nothing we found!</span>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
        {filteredPosts[0] && <Card8 className="sm:col-span-2" post={filteredPosts[0]} />}
        {filteredPosts.slice(1, 3).map((item, index) => (
          <Card9 key={index} post={item} />
        ))}
        {filteredPosts.slice(3, 5).map((item, index) => (
          <Card9 key={index} post={item} />
        ))}
        {filteredPosts[5] && <Card8 className="sm:col-span-2" post={filteredPosts[5]} />}
      </div>

      <div className="mt-20 flex justify-center">
        <ButtonPrimary>
          Show me more
          <ArrowRightIcon className="size-4" />
        </ButtonPrimary>
      </div>
    </div>
  )
}

export default SectionMagazine4
