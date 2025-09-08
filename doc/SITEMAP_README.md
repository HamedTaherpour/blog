# Sitemap Configuration

This project includes automatic sitemap generation for SEO optimization. The sitemap is dynamically generated from your database content and automatically updates when you publish, update, or delete posts.

## Features

- **Dynamic Sitemap Generation**: Automatically includes all published posts, categories, and tags
- **Automatic Updates**: Sitemap regenerates when content changes
- **SEO Optimized**: Includes proper priority, change frequency, and last modified dates
- **Robots.txt**: Automatically generated robots.txt file

## Configuration

### Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Note**: No additional security token is required as the sitemap regeneration endpoint uses your existing authentication system.

## How It Works

### 1. Sitemap Generation (`/sitemap.xml`)

The sitemap is automatically generated from your database and includes:

- **Homepage** (priority: 1.0, change frequency: daily)
- **Published Posts** (priority: 0.8, change frequency: weekly)
- **Categories** (priority: 0.7, change frequency: weekly)
- **Tags** (priority: 0.6, change frequency: monthly)
- **Static Pages** (about, contact, privacy, terms)

### 2. Automatic Regeneration

The sitemap automatically regenerates when:

- A new post is published
- An existing post is updated (status changes)
- A published post is deleted
- Categories or tags are modified

### 3. Manual Regeneration

You can manually trigger sitemap regeneration by calling:

```bash
curl -X POST https://yourdomain.com/api/sitemap/regenerate
```

**Note**: You need to be authenticated (logged in) to use this endpoint.

## File Structure

```
src/
├── app/
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── robots.ts               # Robots.txt generation
│   └── api/
│       └── sitemap/
│           └── regenerate/
│               └── route.ts    # Sitemap regeneration webhook
├── lib/
│   └── sitemap-utils.ts        # Utility functions for sitemap management
└── app/api/posts/
    ├── route.ts                # Post creation with sitemap trigger
    └── [id]/route.ts           # Post update/delete with sitemap trigger
```

## Testing

### 1. Check Sitemap Generation

Visit your sitemap at: `https://yourdomain.com/sitemap.xml`

### 2. Check Robots.txt

Visit your robots.txt at: `https://yourdomain.com/robots.txt`

### 3. Test Manual Regeneration

```bash
# Test the regeneration endpoint (requires authentication)
curl -X POST https://yourdomain.com/api/sitemap/regenerate
```

## SEO Benefits

- **Search Engine Discovery**: Helps search engines find all your content
- **Fresh Content**: Automatically includes new posts
- **Priority Signals**: Tells search engines which pages are most important
- **Update Frequency**: Helps search engines know how often to crawl
- **Last Modified Dates**: Helps with caching and freshness signals

## Troubleshooting

### Sitemap Not Updating

1. Check that `NEXT_PUBLIC_SITE_URL` is set correctly
2. Ensure you're logged in when testing manual regeneration
3. Check server logs for sitemap regeneration errors
4. Ensure posts have `status: 'PUBLISHED'` and `allowIndexing: true`

### Missing URLs in Sitemap

1. Verify posts have `status: 'PUBLISHED'`
2. Check that `allowIndexing` is `true` for posts
3. Ensure categories and tags exist in the database
4. Check that slugs are properly formatted

### Performance Considerations

- Sitemap generation is cached by Next.js
- Regeneration only happens when content changes
- Database queries are optimized for performance
- Large sites may need pagination for sitemap generation

## Customization

### Adding Custom URLs

Edit `src/app/sitemap.ts` to add custom static pages:

```typescript
// Add custom pages
{
  url: `${baseUrl}/custom-page`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.5,
},
```

### Modifying Priorities

Adjust the priority values in `src/app/sitemap.ts`:

```typescript
// Higher priority for important content
priority: 0.9,  // Very important
priority: 0.8,  // Important
priority: 0.7,  // Moderately important
priority: 0.6,  // Less important
```

### Change Frequencies

Modify change frequency values:

```typescript
changeFrequency: 'daily',    // Updates daily
changeFrequency: 'weekly',   // Updates weekly
changeFrequency: 'monthly',  // Updates monthly
changeFrequency: 'yearly',  // Updates yearly
```
