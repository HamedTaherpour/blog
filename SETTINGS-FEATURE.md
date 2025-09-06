# Site Settings Feature

This feature provides a comprehensive settings management system for the website, allowing administrators to configure site-wide settings including meta tags, social media links, and branding.

## Features

### 🎛️ Site Configuration
- **Site Name**: Configure the main site name
- **Site Description**: Set a brief description for the site
- **Logo URL**: Upload and configure site logo
- **Social Media Links**: Add Twitter, Facebook, and Instagram profiles

### 🔧 Technical Features
- **Admin-only Access**: Only users with ADMIN role can access settings
- **Real-time Updates**: Changes are saved immediately
- **Form Validation**: Comprehensive validation for all fields
- **Responsive Design**: Works on all device sizes
- **Dark Mode Support**: Full dark mode compatibility

## File Structure

```
src/
├── app/
│   ├── api/settings/
│   │   └── route.ts              # API endpoints for settings
│   └── dashboard/settings/
│       └── page.tsx              # Settings page component
├── components/
│   ├── SiteLogo.tsx              # Reusable site logo component
│   └── SiteSocialLinks.tsx       # Social media links component
├── hooks/
│   └── useSiteSettings.ts        # Custom hook for settings management
├── lib/
│   └── seo-utils.ts              # Enhanced SEO utilities
└── shared/
    └── tabs.tsx                  # Tabs component for settings UI
```

## API Endpoints

### GET /api/settings
Retrieves current site settings.

**Response:**
```json
{
  "id": 1,
  "siteName": "My Blog",
  "siteDesc": "A modern blog platform",
  "logoUrl": "/uploads/logo.png",
  "twitter": "https://twitter.com/myblog",
  "facebook": "https://facebook.com/myblog",
  "instagram": "https://instagram.com/myblog",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/settings
Updates site settings.

**Request Body:**
```json
{
  "siteName": "My Blog",
  "siteDesc": "A modern blog platform",
  "logoUrl": "/uploads/logo.png",
  "twitter": "https://twitter.com/myblog",
  "facebook": "https://facebook.com/myblog",
  "instagram": "https://instagram.com/myblog"
}
```

## Usage Examples

### Using the Settings Hook

```tsx
import { useSiteSettings } from '@/hooks/useSiteSettings'

function MyComponent() {
  const { settings, loading, error, refetch } = useSiteSettings()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!settings) return <div>No settings found</div>

  return (
    <div>
      <h1>{settings.siteName}</h1>
      <p>{settings.siteDesc}</p>
    </div>
  )
}
```

### Using Site Logo Component

```tsx
import { SiteLogo } from '@/components/SiteLogo'

function Header() {
  return (
    <header>
      <SiteLogo showName={true} size="lg" />
    </header>
  )
}
```

### Using Social Links Component

```tsx
import { SiteSocialLinks } from '@/components/SiteSocialLinks'

function Footer() {
  return (
    <footer>
      <SiteSocialLinks className="flex gap-4" />
    </footer>
  )
}
```

## Database Schema

The settings are stored in the `SiteSetting` table:

```sql
CREATE TABLE SiteSetting (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  siteName TEXT NOT NULL,
  siteDesc TEXT,
  logoUrl TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## SEO Integration

The settings automatically generate default meta tags:

- **Meta Title**: Uses site name
- **Meta Description**: Uses site description
- **Open Graph Tags**: Generated from site settings
- **Twitter Cards**: Configured with site information
- **Structured Data**: JSON-LD schema for better SEO

## Security

- **Authentication Required**: All API endpoints require authentication
- **Admin Role Check**: Only ADMIN users can modify settings
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection Protection**: Using Prisma ORM for safe database operations

## Future Enhancements

- [ ] File upload for logo management
- [ ] Additional social media platforms
- [ ] Site analytics configuration
- [ ] Email settings configuration
- [ ] Multi-language support
- [ ] Theme customization options

## Contributing

When adding new settings:

1. Update the Prisma schema
2. Add API endpoint handlers
3. Update the settings form
4. Add validation rules
5. Update the documentation

## Testing

To test the settings feature:

1. Navigate to `/dashboard/settings`
2. Ensure you're logged in as an ADMIN user
3. Modify settings and save
4. Verify changes are persisted
5. Check that social links and logo appear correctly
