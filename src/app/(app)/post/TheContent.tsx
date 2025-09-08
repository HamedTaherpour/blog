import { FC } from 'react'

interface TheContentProps {
  content: string
}

const TheContent: FC<TheContentProps> = ({ content }) => {
  // If content is empty or null, show a placeholder
  if (!content || content.trim() === '') {
    return (
      <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
        <p>No content available for this post.</p>
      </div>
    )
  }

  // Render HTML content safely
  return (
    <div 
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default TheContent