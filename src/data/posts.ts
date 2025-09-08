import { _demo_author_image_urls } from './authors'

// TODO: replace with actual images
// TODO: replace with actual images
// _demo_post_image_urls has length 20
const _demo_post_image_urls = [
  'https://images.unsplash.com/photo-1731437519600-f1219cded2cd?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1539477857993-860599c2e840?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1666792890871-0e332b76967d?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1592396355679-1e2a094e8bf1?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1532347922424-c652d9b7208e?q=80&w=2639&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1535640597419-853d35e6364f?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1674507593594-964ea25ce06a?q=80&w=2171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1560703650-db93f86c37b3?q=80&w=3791&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1641301365918-c8d4b9ce7d11?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1556104577-09754a15dff2?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1743832354699-c89a3a138237?q=80&w=3057&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1559601531-503da8fa81f7?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1622272516403-69dbe7ec7ecd?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

// TODO: replace with actual audio urls
// length NOTE: supported media files mp3, wav, ogg, aac, flac, webm, mp4, mov, etc.
const _demo_post_audio_urls = [
  'https://files.booliitheme.com/wp-content/uploads/2024/12/paudio.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2024/12/paudio2.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio3.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio4.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio5.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio6.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio7.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2024/12/paudio.mp3',
  'https://files.booliitheme.com/wp-content/uploads/2024/12/paudio2.mp3',
]

// TODO: replace with actual video urls
// length 6
const _demo_post_video_urls = [
  'https://www.youtube.com/watch?v=vHBodN0Mirs',
]

export async function getPostsDefault() {
  return [
    {
      id: 'post-1',
      featuredImage: {
        src: _demo_post_image_urls[0],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: "Lenovo's smarter devices stoke professional passions ",
      handle: 'lenovo-smarter-devices-stoke-professional-passions',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10T12:00:00Z',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: true,
      postType: 'standard',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'Sarah Wilson',
        handle: 'sarah-wilson',
        avatar: {
          src: _demo_author_image_urls[0],
          alt: 'Sarah Wilson',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Garden',
          handle: 'garden',
          color: 'indigo',
        },
      ],
    },
  ]
}
export async function getPostsAudio() {
  return [
    {
      id: 'post-audio-1',
      featuredImage: {
        src: _demo_post_image_urls[6],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'Jacob Collier x Gen Music | Google Lab Sessions | Full Session',
      handle: 'jacob-collier-x-gen-music-google-lab-sessions-full-session',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10T12:00:00Z',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: false,
      postType: 'audio',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: _demo_author_image_urls[6],
          alt: 'John Doe',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Technology',
          handle: 'technology',
          color: 'blue',
        },
      ],
      audioUrl: _demo_post_audio_urls[0],
    },
  ]
}
export async function getPostsVideo() {
  return [
    {
      id: 'post-video-1',
      featuredImage: {
        src: _demo_post_image_urls[18],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'The impact of COVID-19 on The Airport Business',
      handle: 'the-impact-of-covid-19-on-the-airport-business',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: true,
      likeCount: 3007,
      liked: false,
      postType: 'video',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: _demo_author_image_urls[8],
          alt: 'John Doe',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Technology',
          handle: 'technology',
          color: 'blue',
        },
      ],
      videoUrl: _demo_post_video_urls[0],
    },
  ]
}
export async function getPostsGallery() {
  return [
    {
      id: 'post-gallery-1',
      featuredImage: {
        src: _demo_post_image_urls[10],
        alt: "Lenovo's smarter devices stoke professional passions",
        width: 1920,
        height: 1080,
      },
      title: 'Where the Internet Lives: From Trauma to Triumph Oval',
      handle: 'where-the-internet-lives-from-trauma-to-triumph-oval',
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      date: '2025-06-10',
      readingTime: 2,
      commentCount: 11,
      viewCount: 2504,
      bookmarkCount: 3007,
      bookmarked: false,
      likeCount: 3007,
      liked: false,
      postType: 'gallery',
      status: 'published',
      author: {
        id: 'author-1',
        name: 'John Doe',
        handle: 'john-doe',
        avatar: {
          src: _demo_author_image_urls[0],
          alt: 'John Doe',
          width: 1920,
          height: 1080,
        },
      },
      categories: [
        {
          id: 'category-1',
          name: 'Technology',
          handle: 'technology',
          color: 'blue',
        },
      ],
      galleryImgs: [
        _demo_post_image_urls[10],
        _demo_post_image_urls[11],
        _demo_post_image_urls[14],
        _demo_post_image_urls[15],
        _demo_post_image_urls[16],
      ],
    },
  ]
}
export async function getAllPosts() {
  const posts = await Promise.all([getPostsDefault(), getPostsVideo(), getPostsAudio(), getPostsGallery()])

  // random shuffle
  return posts.flat().sort(() => Math.random() - 0.5)
}

export async function getPostByHandle(handle: string) {
  const posts = await getAllPosts()
  let post = posts.find((post) => post.handle === handle) as TPost
  if (!post) {
    // only for demo purposes, if the post is not found, return the first post
    console.warn(`Post with handle "${handle}" not found. Returning the first post as a fallback.`)
    post = posts[0]
  }

  return {
    ...post,
    // for demo purposes
    galleryImgs: [...(post.galleryImgs || []), ..._demo_post_image_urls],
    // for demo purposes
    videoUrl: post.videoUrl || 'https://www.youtube.com/watch?v=JcDBFAm9PPI',
    // for demo purposes
    audioUrl: post.audioUrl || 'https://files.booliitheme.com/wp-content/uploads/2025/06/paudio3.mp3',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: {
      ...post.author,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    tags: [
      // for demo purposes
      {
        id: 'tag-1',
        name: 'Technology',
        handle: 'technology',
        color: 'blue',
      },
      {
        id: 'tag-2',
        name: 'Travel',
        handle: 'travel',
        color: 'blue',
      },
      {
        id: 'tag-3',
        name: 'Food',
        handle: 'food',
        color: 'blue',
      },
      {
        id: 'tag-4',
        name: 'Health',
        handle: 'health',
        color: 'blue',
      },
    ],
    categories: [
      ...(post.categories || []),
      // for demo purposes
      {
        id: 'category-typography',
        name: 'Typography',
        handle: 'typography',
        color: 'sky',
      },
    ],
  }
}

// Types
export type TPost = Awaited<ReturnType<typeof getAllPosts>>[number] & {
  audioUrl?: string
  videoUrl?: string
  galleryImgs?: string[]
}
export type TPostDetail = Awaited<ReturnType<typeof getPostByHandle>>
