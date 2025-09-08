'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/tabs'
import MetaTagsTab from './components/MetaTagsTab'
import FlexibleSocialMediaTab from './components/FlexibleSocialMediaTab'
import FooterMenusTab from './components/FooterMenusTab'
import { PermissionGuard } from '@/components/PermissionGuard'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { Badge } from '@/shared/Badge'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <PermissionGuard 
      resource="settings" 
      action="read" 
      fallback={
        <div className="container mx-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Access Denied</CardTitle>
              <CardDescription>
                You don&apos;t have permission to access settings. Only administrators can manage site settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your current role: <Badge color="orange">{user?.role || 'Unknown'}</Badge>
                </p>
                <p className="text-sm text-muted-foreground">
                  Required role: <Badge color="orange">ADMIN</Badge>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your site settings, SEO, social media links, and navigation menus.
          </p>
        </div>

        <Tabs defaultValue="meta-tags" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="meta-tags">Meta Tags</TabsTrigger>
            <TabsTrigger value="social-media">Social Media</TabsTrigger>
            <TabsTrigger value="footer-menus">Footer Menus</TabsTrigger>
          </TabsList>

          <TabsContent value="meta-tags" className="space-y-6">
            <MetaTagsTab />
          </TabsContent>

          <TabsContent value="social-media" className="space-y-6">
            <FlexibleSocialMediaTab />
          </TabsContent>

          <TabsContent value="footer-menus" className="space-y-6">
            <FooterMenusTab />
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  )
}
