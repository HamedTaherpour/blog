import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed process...')

  // Step 1: Seed Categories
  await seedCategories()

  // Step 2: Seed Tags
  await seedTags()

  // Step 3: Seed Users/Authors
  await seedUsers()

  // Step 4: Seed Posts
  await seedPosts()

  // Step 5: Seed Header Menus
  await seedHeaderMenus()

  // Step 6: Seed Footer Menus
  await seedFooterMenus()

  // Step 7: Seed Site Settings
  await seedSiteSettings()

  // Step 8: Seed Social Media Links
  await seedSocialMediaLinks()

  console.log('✅ Seed completed successfully!')
}

async function seedCategories() {
  console.log('📂 Seeding categories...')

  const categories = [
    {
      slug: 'technology',
      name: 'Τεχνολογία',
      description: 'Τελευταία νέα τεχνολογίας, gadgets και καινοτομίες',
      image: '/uploads/category/mac-book.jpg',
      color: 'blue',
      metaTitle: 'Νέα & Αξιολογήσεις Τεχνολογίας',
      metaDescription: 'Μείνετε ενημερωμένοι με τις τελευταίες τάσεις τεχνολογίας, αξιολογήσεις gadgets και καινοτομίες',
      metaKeywords: 'τεχνολογία, gadgets, νέα τεχνολογίας, καινοτομία, αξιολογήσεις',
    },
    {
      slug: 'mobile-devices',
      name: 'Κινητές Συσκευές',
      description: 'Smartphones, tablets και αξεσουάρ κινητών',
      image: '/uploads/category/iPad.jpg',
      color: 'purple',
      metaTitle: 'Κινητές Συσκευές & Αξεσουάρ',
      metaDescription: 'Ανακαλύψτε τις τελευταίες κινητές συσκευές, smartphones, tablets και αξεσουάρ',
      metaKeywords: 'κινητό, smartphone, tablet, αξεσουάρ, iOS, Android',
    },
    {
      slug: 'wearables',
      name: 'Wearables',
      description: 'Smartwatches, fitness trackers και φορετή τεχνολογία',
      image: '/uploads/category/apple-watch.jpg',
      color: 'green',
      metaTitle: 'Φορετή Τεχνολογία',
      metaDescription: 'Εξερευνήστε smartwatches, fitness trackers και φορετές συσκευές',
      metaKeywords: 'wearables, smartwatch, fitness tracker, health tech',
    },
    {
      slug: 'audio',
      name: 'Ήχος',
      description: 'Ακουστικά, ηχεία και ηχητικός εξοπλισμός',
      image: '/uploads/category/air-pods.jpg',
      color: 'orange',
      metaTitle: 'Ηχητικός Εξοπλισμός & Αξεσουάρ',
      metaDescription: 'Βρείτε τα καλύτερα ακουστικά, ηχεία και ηχητικό εξοπλισμό',
      metaKeywords: 'ήχος, ακουστικά, ηχεία, sound, music',
    },
    {
      slug: 'automotive',
      name: 'Αυτοκίνητο',
      description: 'Αυτοκίνητα, ηλεκτρικά οχήματα και τεχνολογία αυτοκινήτου',
      image: '/uploads/category/car.jpg',
      color: 'red',
      metaTitle: 'Τεχνολογία Αυτοκινήτου',
      metaDescription: 'Τελευταία νέα αυτοκινήτου, ηλεκτρικά οχήματα και τεχνολογία',
      metaKeywords: 'αυτοκίνητο, ηλεκτρικά οχήματα, auto tech',
    },
    {
      slug: 'entertainment',
      name: 'Ψυχαγωγία',
      description: 'TV, streaming, gaming και τεχνολογία ψυχαγωγίας',
      image: '/uploads/category/tv.jpg',
      color: 'indigo',
      metaTitle: 'Τεχνολογία Ψυχαγωγίας',
      metaDescription: 'Τεχνολογία ψυχαγωγίας: TVs, streaming, gaming και media',
      metaKeywords: 'ψυχαγωγία, TV, streaming, gaming, media',
    },
  ]

  for (const categoryData of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: categoryData.slug },
    })

    if (!existingCategory) {
      const category = await prisma.category.create({
        data: categoryData,
      })
      console.log(`✅ Created category: ${category.name}`)
    } else {
      console.log(`⚠️  Category already exists: ${categoryData.name}`)
    }
  }

  console.log('📂 Categories seeding completed!')
}

async function seedTags() {
  console.log('🏷️  Seeding tags...')

  const tags = [
    {
      slug: 'tech-news',
      name: 'Τεχνολογικά Νέα',
    },
    {
      slug: 'reviews',
      name: 'Αξιολογήσεις',
    },
    {
      slug: 'smartphone',
      name: 'Smartphone',
    },
    {
      slug: 'laptop',
      name: 'Laptop',
    },
    {
      slug: 'tablet',
      name: 'Tablet',
    },
    {
      slug: 'smartwatch',
      name: 'Smartwatch',
    },
    {
      slug: 'headphones',
      name: 'Ακουστικά',
    },
    {
      slug: 'speakers',
      name: 'Ηχεία',
    },
    {
      slug: 'electric-car',
      name: 'Ηλεκτρικό Αυτοκίνητο',
    },
    {
      slug: 'automotive-tech',
      name: 'Τεχνολογία Αυτοκινήτου',
    },
    {
      slug: 'tv',
      name: 'TV',
    },
    {
      slug: 'streaming',
      name: 'Streaming',
    },
    {
      slug: 'gaming',
      name: 'Gaming',
    },
    {
      slug: 'ai',
      name: 'AI',
    },
    {
      slug: 'innovation',
      name: 'Καινοτομία',
    },
    {
      slug: 'apple',
      name: 'Apple',
    },
    {
      slug: 'android',
      name: 'Android',
    },
    {
      slug: 'ios',
      name: 'iOS',
    },
    {
      slug: 'wireless',
      name: 'Ασύρματο',
    },
    {
      slug: 'bluetooth',
      name: 'Bluetooth',
    },
  ]

  for (const tagData of tags) {
    const existingTag = await prisma.tag.findUnique({
      where: { slug: tagData.slug },
    })

    if (!existingTag) {
      const tag = await prisma.tag.create({
        data: tagData,
      })
      console.log(`✅ Created tag: ${tag.name}`)
    } else {
      console.log(`⚠️  Tag already exists: ${tagData.name}`)
    }
  }

  console.log('🏷️  Tags seeding completed!')
}

async function seedUsers() {
  console.log('👥 Seeding admin user...')

  const adminUser = {
    id: 'admin-1',
    name: 'Admin User',
    username: 'admin',
    email: 'skhammari@gmail.com',
    bio: 'Administrator of the platform with full access to all features.',
    image: '/images/placeholder-image.png',
    role: 'ADMIN' as const,
    passwordHash: '$2b$12$C9puvbfKtLy66uXGjBivcOMDIZrpYaraDRPkAA36K1zrXrwPpGWbG',
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: adminUser.email },
  })

  if (!existingUser) {
    const user = await prisma.user.create({
      data: adminUser,
    })
    console.log(`✅ Created admin user: ${user.name}`)
  } else {
    console.log(`⚠️  Admin user already exists: ${adminUser.name}`)
  }

  console.log('👥 Admin user seeding completed!')
}

async function seedPosts() {
  console.log('📝 Seeding posts...')

  // Get categories and tags for relationships
  const categories = await prisma.category.findMany()
  const tags = await prisma.tag.findMany()
  const users = await prisma.user.findMany()

  if (categories.length === 0 || tags.length === 0 || users.length === 0) {
    console.log('⚠️  Skipping posts seeding - missing categories, tags, or users')
    return
  }

  const posts = [
    {
      slug: 'lenovo-smarter-devices-professional-passions',
      title: "Lenovo's smarter devices stoke professional passions",
      excerpt: 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.',
      content: `
        <h2>Introduction</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Advanced AI integration</li>
          <li>Enhanced productivity tools</li>
          <li>Seamless connectivity</li>
          <li>Professional-grade performance</li>
        </ul>
        
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      `,
      coverImage: '/uploads/img/image/Gz0kaQKWIAAVWUz.jpg',
      postType: 'IMAGE' as const,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-06-10T12:00:00Z'),
      authorId: users[0].id,
      categoryId: categories.find(c => c.slug === 'technology')?.id,
      tagSlugs: ['tech-news', 'reviews', 'laptop'],
      metaTitle: "Lenovo's smarter devices stoke professional passions",
      metaDescription: 'Discover how Lenovo\'s latest devices are revolutionizing professional workflows',
      metaKeywords: 'lenovo, professional devices, productivity, technology',
    },
    {
      slug: 'future-remote-work-2025-complete-guide',
      title: 'The Future of Remote Work in 2025 - Complete Guide',
      excerpt: 'Remote work is evolving rapidly. Discover the latest trends and technologies shaping the future of work.',
      content: `
        <h2>The Evolution of Remote Work</h2>
        <p>Remote work has transformed from a temporary solution to a permanent fixture in the modern workplace. As we move through 2025, several key trends are emerging that will shape the future of how we work.</p>
        
        <h3>Key Trends for 2025</h3>
        <ol>
          <li>Hybrid work models becoming standard</li>
          <li>AI-powered collaboration tools</li>
          <li>Virtual reality meeting spaces</li>
          <li>Enhanced cybersecurity measures</li>
        </ol>
        
        <p>The future of remote work is not just about working from home, but about creating flexible, efficient, and engaging work environments that adapt to individual needs and preferences.</p>
      `,
      coverImage: '/uploads/img/image/Gz0kbKVWwAArmc2.jpg',
      postType: 'IMAGE' as const,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-05-15T12:00:00Z'),
      authorId: users[0].id,
      categoryId: categories.find(c => c.slug === 'technology')?.id,
      tagSlugs: ['tech-news', 'ai', 'innovation'],
      metaTitle: 'The Future of Remote Work in 2025 - Complete Guide',
      metaDescription: 'Discover the latest trends and technologies shaping the future of remote work',
      metaKeywords: 'remote work, future of work, hybrid work, technology trends',
    },
    {
      slug: 'jacob-collier-gen-music-google-lab-sessions',
      title: 'Jacob Collier x Gen Music | Google Lab Sessions | Full Session',
      excerpt: 'Experience the full majesty of Jacob Collier\'s innovative musical approach in this exclusive Google Lab session.',
      content: `
        <h2>Musical Innovation Meets Technology</h2>
        <p>Jacob Collier's collaboration with Google represents a fascinating intersection of musical creativity and technological innovation. This session showcases how modern technology can enhance and amplify musical expression.</p>
        
        <h3>Session Highlights</h3>
        <ul>
          <li>Real-time audio processing</li>
          <li>Interactive musical elements</li>
          <li>Collaborative composition tools</li>
          <li>Live audience interaction</li>
        </ul>
        
        <p>The session demonstrates the potential for technology to democratize music creation and provide new avenues for artistic expression.</p>
      `,
      coverImage: '/uploads/img/audio/GyagsZiXQAAPi04.jpg',
      postType: 'AUDIO' as const,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-06-10T12:00:00Z'),
      authorId: users[0].id,
      categoryId: categories.find(c => c.slug === 'audio')?.id,
      tagSlugs: ['music', 'innovation', 'technology'],
      metaTitle: 'Jacob Collier x Gen Music | Google Lab Sessions',
      metaDescription: 'Exclusive musical session featuring Jacob Collier and Google\'s innovative music technology',
      metaKeywords: 'jacob collier, music technology, google labs, innovation',
      audioUrl: '/uploads/audio/1.mp3',
    },
    {
      slug: 'ai-revolution-next-decade-breakthroughs',
      title: 'AI Revolution: What to Expect in the Next Decade',
      excerpt: 'Exploring the potential impact of artificial intelligence on our daily lives and future society.',
      content: `
        <h2>The AI Revolution Unfolds</h2>
        <p>Artificial Intelligence is no longer a futuristic concept but a present reality that's rapidly transforming every aspect of our lives. As we look ahead to the next decade, several breakthrough areas are emerging.</p>
        
        <h3>Key Areas of Development</h3>
        <ol>
          <li>Healthcare and medical diagnosis</li>
          <li>Autonomous transportation</li>
          <li>Personalized education</li>
          <li>Climate change solutions</li>
        </ol>
        
        <p>The next decade will see AI become more integrated into our daily lives, with significant implications for how we work, learn, and interact with technology.</p>
      `,
      coverImage: '/uploads/img/audio/video/F03DfROWcAoczuP.jpg',
      postType: 'VIDEO' as const,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-03-05T12:00:00Z'),
      authorId: users[0].id,
      categoryId: categories.find(c => c.slug === 'entertainment')?.id,
      tagSlugs: ['ai', 'innovation', 'tech-news'],
      metaTitle: 'AI Revolution: What to Expect in the Next Decade',
      metaDescription: 'Exploring the potential impact of artificial intelligence on our daily lives and future society',
      metaKeywords: 'artificial intelligence, AI revolution, future technology, innovation',
      videoUrl: '/uploads/video/02_MTB_Helmet_FrontSideMount_406x406.webm',
    },
    {
      slug: 'sustainable-living-complete-guide',
      title: 'The Complete Guide to Living Sustainably',
      excerpt: 'Learn how to reduce your carbon footprint and live a more sustainable lifestyle with these practical tips.',
      content: `
        <h2>Embracing Sustainable Living</h2>
        <p>Sustainable living is not just a trend but a necessity for preserving our planet for future generations. This comprehensive guide provides practical steps you can take to reduce your environmental impact.</p>
        
        <h3>Key Areas to Focus On</h3>
        <ul>
          <li>Energy consumption and renewable sources</li>
          <li>Waste reduction and recycling</li>
          <li>Sustainable transportation options</li>
          <li>Conscious consumption habits</li>
        </ul>
        
        <p>Every small action contributes to a larger positive impact. Start with one area and gradually expand your sustainable practices.</p>
      `,
      coverImage: '/uploads/img/image/Gz0kdT9XoAAaQ3S.jpg',
      postType: 'IMAGE' as const,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-04-20T12:00:00Z'),
      authorId: users[0].id,
      categoryId: categories.find(c => c.slug === 'technology')?.id,
      tagSlugs: ['innovation', 'reviews'],
      metaTitle: 'The Complete Guide to Living Sustainably',
      metaDescription: 'Learn how to reduce your carbon footprint and live a more sustainable lifestyle',
      metaKeywords: 'sustainable living, eco-friendly, carbon footprint, green living',
    },
    {
      slug: 'beethoven-symphony-no-9-complete-performance',
      title: 'Beethoven Symphony No. 9 - Complete Performance',
      excerpt: "Experience the full majesty of Beethoven's Ninth Symphony in this complete performance.",
      content: `
        <h2>Musical Masterpiece</h2>
        <p>Beethoven's Ninth Symphony stands as one of the greatest achievements in classical music. This complete performance captures the emotional depth and technical brilliance of this timeless work.</p>
        
        <h3>Performance Highlights</h3>
        <ul>
          <li>Full orchestral arrangement</li>
          <li>Choral finale with soloists</li>
          <li>Historical interpretation</li>
          <li>High-quality audio recording</li>
        </ul>
        
        <p>This recording preserves the essence of Beethoven's vision while bringing it to life for modern audiences.</p>
      `,
      coverImage: '/uploads/img/audio/GyagtRVXYAAAirI.jpg',
      postType: 'AUDIO' as const,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-05-15T12:00:00Z'),
      authorId: users[0].id,
      categoryId: categories.find(c => c.slug === 'audio')?.id,
      tagSlugs: ['music', 'reviews'],
      metaTitle: 'Beethoven Symphony No. 9 - Complete Performance',
      metaDescription: 'Experience the full majesty of Beethoven\'s Ninth Symphony in this complete performance',
      metaKeywords: 'beethoven, symphony, classical music, performance',
      audioUrl: '/uploads/audio/2.mp3',
    },
    {
      slug: 'hiking-camp-volta-adventure-guide',
      title: 'Hiking Camp Volta: Complete Adventure Guide',
      excerpt: 'Discover the breathtaking landscapes and thrilling adventures of Volta region in this comprehensive hiking guide.',
      content: `
        <h2>Volta Region Adventure</h2>
        <p>The Volta region offers some of the most spectacular hiking trails and camping experiences. This guide will help you plan the perfect outdoor adventure.</p>
        
        <h3>Trail Highlights</h3>
        <ul>
          <li>Mountain peak trails</li>
          <li>Waterfall routes</li>
          <li>Wildlife viewing spots</li>
          <li>Camping locations</li>
        </ul>
        
        <p>Whether you're a beginner or experienced hiker, Volta has something to offer everyone seeking outdoor adventure.</p>
      `,
      coverImage: '/uploads/img/audio/video/F03Di4_WcAILsVA.jpg',
      postType: 'VIDEO' as const,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-04-20T12:00:00Z'),
      authorId: users[0].id,
      categoryId: categories.find(c => c.slug === 'entertainment')?.id,
      tagSlugs: ['reviews', 'innovation'],
      metaTitle: 'Hiking Camp Volta: Complete Adventure Guide',
      metaDescription: 'Discover the breathtaking landscapes and thrilling adventures of Volta region',
      metaKeywords: 'hiking, camping, volta, adventure, outdoor',
      videoUrl: '/uploads/video/03_HikeCamp_Volta_406x406.mp4',
    },
  ]

  for (const postData of posts) {
    const existingPost = await prisma.post.findUnique({
      where: { slug: postData.slug },
    })

    if (!existingPost) {
      // Create the post
      const post = await prisma.post.create({
        data: {
          slug: postData.slug,
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          coverImage: postData.coverImage,
          postType: postData.postType,
          status: postData.status,
          publishedAt: postData.publishedAt,
          authorId: postData.authorId,
          categoryId: postData.categoryId,
          metaTitle: postData.metaTitle,
          metaDescription: postData.metaDescription,
          metaKeywords: postData.metaKeywords,
        },
      })

      // Create featured image media for all posts
      if (postData.coverImage) {
        const imageFilename = postData.coverImage.split('/').pop() || 'featured-image.jpg'
        const imageMimeType = imageFilename.endsWith('.jpg') ? 'image/jpeg' : 
                             imageFilename.endsWith('.png') ? 'image/png' : 
                             imageFilename.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
        
        await prisma.media.create({
          data: {
            postId: post.id,
            url: postData.coverImage,
            filename: imageFilename,
            mimeType: imageMimeType,
            provider: 'local',
          },
        })
      }

      // Create media if audio/video URL exists
      if (postData.audioUrl) {
        const audioFilename = postData.audioUrl.split('/').pop() || 'audio-file.mp3'
        const audioMimeType = audioFilename.endsWith('.mp3') ? 'audio/mpeg' : 'audio/wav'
        
        await prisma.media.create({
          data: {
            postId: post.id,
            url: postData.audioUrl,
            filename: audioFilename,
            mimeType: audioMimeType,
            provider: 'local',
          },
        })
      }

      if (postData.videoUrl) {
        const videoFilename = postData.videoUrl.split('/').pop() || 'video-file.mp4'
        const videoMimeType = videoFilename.endsWith('.webm') ? 'video/webm' : 
                             videoFilename.endsWith('.mp4') ? 'video/mp4' : 'video/mp4'
        
        await prisma.media.create({
          data: {
            postId: post.id,
            url: postData.videoUrl,
            filename: videoFilename,
            mimeType: videoMimeType,
            provider: 'local',
          },
        })
      }

      // Link tags to the post
      if (postData.tagSlugs && postData.tagSlugs.length > 0) {
        const postTags = tags.filter(tag => postData.tagSlugs!.includes(tag.slug))
        
        for (const tag of postTags) {
          await prisma.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
            },
          })
        }
      }

      console.log(`✅ Created post: ${post.title}`)
    } else {
      console.log(`⚠️  Post already exists: ${postData.title}`)
    }
  }

  console.log('📝 Posts seeding completed!')
}

async function seedHeaderMenus() {
  console.log('🧭 Seeding header menus...')

  const headerMenuItems = [
    {
      label: 'Αρχική',
      href: '/',
      order: 1,
      isActive: true,
      isExternal: false,
    },
    {
      label: 'Τεχνολογία',
      href: '/category/technology',
      order: 2,
      isActive: true,
      isExternal: false,
    },
    {
      label: 'Κινητές Συσκευές',
      href: '/category/mobile-devices',
      order: 3,
      isActive: true,
      isExternal: false,
    },
    {
      label: 'Ήχος',
      href: '/category/audio',
      order: 4,
      isActive: true,
      isExternal: false,
    },
    {
      label: 'Ψυχαγωγία',
      href: '/category/entertainment',
      order: 5,
      isActive: true,
      isExternal: false,
    },
    {
      label: 'Σχετικά',
      href: '/about',
      order: 6,
      isActive: true,
      isExternal: false,
    },
    {
      label: 'Επικοινωνία',
      href: '/contact',
      order: 7,
      isActive: true,
      isExternal: false,
    },
  ]

  for (const itemData of headerMenuItems) {
    const existingItem = await prisma.headerMenuItem.findFirst({
      where: { 
        label: itemData.label,
        href: itemData.href 
      }
    })

    if (!existingItem) {
      const item = await prisma.headerMenuItem.create({
        data: itemData,
      })
      console.log(`✅ Created header menu item: ${item.label}`)
    } else {
      console.log(`⚠️  Header menu item already exists: ${itemData.label}`)
    }
  }

  console.log('🧭 Header menus seeding completed!')
}

async function seedFooterMenus() {
  console.log('🦶 Seeding footer menus...')

  const footerMenuGroups = [
    {
      title: 'Ξεκινώντας',
      order: 1,
      menuItems: [
        { label: 'Εγκατάσταση', href: '/docs/installation', order: 1, isExternal: false },
        { label: 'Σημειώσεις Έκδοσης', href: '/docs/release-notes', order: 2, isExternal: false },
        { label: 'Οδηγός Αναβάθμισης', href: '/docs/upgrade', order: 3, isExternal: false },
        { label: 'Υποστήριξη Browser', href: '/docs/browser-support', order: 4, isExternal: false },
        { label: 'Υποστήριξη Editor', href: '/docs/editor-support', order: 5, isExternal: false },
      ]
    },
    {
      title: 'Εξερεύνηση',
      order: 2,
      menuItems: [
        { label: 'Χαρακτηριστικά Σχεδιασμού', href: '/features/design', order: 1, isExternal: false },
        { label: 'Πρωτοτυποποίηση', href: '/features/prototyping', order: 2, isExternal: false },
        { label: 'Συστήματα Σχεδιασμού', href: '/features/design-systems', order: 3, isExternal: false },
        { label: 'Τιμολόγηση', href: '/pricing', order: 4, isExternal: false },
        { label: 'Πελάτες', href: '/customers', order: 5, isExternal: false },
      ]
    },
    {
      title: 'Πόροι',
      order: 3,
      menuItems: [
        { label: 'Καλές Πρακτικές', href: '/resources/best-practices', order: 1, isExternal: false },
        { label: 'Υποστήριξη', href: '/support', order: 2, isExternal: false },
        { label: 'Προγραμματιστές', href: '/developers', order: 3, isExternal: false },
        { label: 'Μάθε Σχεδιασμό', href: '/learn', order: 4, isExternal: false },
        { label: 'Τι Νέο Υπάρχει', href: '/whats-new', order: 5, isExternal: false },
      ]
    },
    {
      title: 'Κοινότητα',
      order: 4,
      menuItems: [
        { label: 'Φόρουμ Συζητήσεων', href: 'https://community.example.com', order: 1, isExternal: true },
        { label: 'Κώδικας Δεοντολογίας', href: '/community/code-of-conduct', order: 2, isExternal: false },
        { label: 'Πόροι Κοινότητας', href: '/community/resources', order: 3, isExternal: false },
        { label: 'Συνεισφορά', href: '/community/contributing', order: 4, isExternal: false },
        { label: 'Λειτουργία Concurrent', href: '/community/concurrent-mode', order: 5, isExternal: false },
      ]
    }
  ]

  for (const groupData of footerMenuGroups) {
    const existingGroup = await prisma.footerMenuGroup.findFirst({
      where: { title: groupData.title }
    })

    if (!existingGroup) {
      const group = await prisma.footerMenuGroup.create({
        data: {
          title: groupData.title,
          order: groupData.order,
        }
      })

      // Create menu items for this group
      for (const itemData of groupData.menuItems) {
        await prisma.footerMenuItem.create({
          data: {
            label: itemData.label,
            href: itemData.href,
            order: itemData.order,
            isExternal: itemData.isExternal,
            groupId: group.id,
          }
        })
      }

      console.log(`✅ Created footer menu group: ${group.title}`)
    } else {
      console.log(`⚠️  Footer menu group already exists: ${groupData.title}`)
    }
  }

  console.log('🦶 Footer menus seeding completed!')
}

async function seedSiteSettings() {
  console.log('⚙️ Seeding site settings...')

  // Check if site settings already exist
  const existingSettings = await prisma.siteSetting.findFirst()

  if (existingSettings) {
    console.log('⚠️  Site settings already exist, skipping...')
    return
  }

  // Create default site settings
  const siteSettings = await prisma.siteSetting.create({
    data: {
      siteName: 'enpap-blog Blog',
      siteDesc: 'Μια σύγχρονη πλατφόρμα blog για κοινοποίηση άρθρων και ειδήσεων',
      logoUrl: '/images/logo.png',

      // Site Author
      siteAuthor: 'enpap-blog Team',
      
      // Meta Tags
      metaTitle: 'enpap-blog Blog - Σύγχρονη Πλατφόρμα Blog',
      metaDescription: 'Διαβάστε τα καλύτερα άρθρα και ειδήσεις για τεχνολογία, επιχειρήσεις και καθημερινή ζωή στο enpap-blog Blog',
      metaKeywords: 'blog, άρθρα, ειδήσεις, τεχνολογία, επιχειρήσεις, lifestyle',
      focusKeyword: 'σύγχρονο blog',
      canonicalUrl: 'https://enpap-blog.com',
      allowIndexing: true,
      
      // Open Graph
      ogTitle: 'enpap-blog Blog - Σύγχρονη Πλατφόρμα Blog',
      ogDescription: 'Τα καλύτερα άρθρα και ειδήσεις για τεχνολογία, επιχειρήσεις και καθημερινή ζωή',
      ogType: 'website',
      ogImage: '/images/og-image.jpg',
      
      // Twitter Card
      twitterTitle: 'enpap-blog Blog - Σύγχρονη Πλατφόρμα Blog',
      twitterDescription: 'Τα καλύτερα άρθρα και ειδήσεις για τεχνολογία, επιχειρήσεις και καθημερινή ζωή',
      twitterCardType: 'summary_large_image',
      twitterImage: '/images/twitter-card.jpg',
    }
  })

  console.log('✅ Site settings created successfully!')
  console.log(`   Site Name: ${siteSettings.siteName}`)
  console.log(`   Site Description: ${siteSettings.siteDesc}`)
}

async function seedSocialMediaLinks() {
  console.log('🔗 Seeding social media links...')

  const socialMediaLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/enpap-blog',
      iconName: 'Facebook01Icon',
      iconType: 'hugeicons',
      order: 1,
      isActive: true,
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/enpap-blog',
      iconName: 'NewTwitterIcon',
      iconType: 'hugeicons',
      order: 2,
      isActive: true,
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/enpap-blog',
      iconName: 'InstagramIcon',
      iconType: 'hugeicons',
      order: 3,
      isActive: true,
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@enpap-blog',
      iconName: 'YoutubeIcon',
      iconType: 'hugeicons',
      order: 4,
      isActive: true,
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/enpap-blog',
      iconName: 'LinkedinIcon',
      iconType: 'hugeicons',
      order: 5,
      isActive: true,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/enpap-blog',
      iconName: 'GithubIcon',
      iconType: 'hugeicons',
      order: 6,
      isActive: true,
    },
  ]

  for (const linkData of socialMediaLinks) {
    const existingLink = await prisma.socialMediaLink.findFirst({
      where: { 
        name: linkData.name,
        url: linkData.url 
      }
    })

    if (!existingLink) {
      const link = await prisma.socialMediaLink.create({
        data: linkData,
      })
      console.log(`✅ Created social media link: ${link.name}`)
    } else {
      console.log(`⚠️  Social media link already exists: ${linkData.name}`)
    }
  }

  console.log('🔗 Social media links seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
