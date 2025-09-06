'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/tabs'
import MetaTagsTab from './components/MetaTagsTab'
import SocialMediaTab from './components/SocialMediaTab'
import FooterMenusTab from './components/FooterMenusTab'
import HeaderMenusTab from './components/HeaderMenusTab'

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your site settings, SEO, social media links, and navigation menus.
        </p>
      </div>

      <Tabs defaultValue="meta-tags" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="meta-tags">Meta Tags</TabsTrigger>
          <TabsTrigger value="social-media">Social Media</TabsTrigger>
          <TabsTrigger value="footer-menus">Footer Menus</TabsTrigger>
          <TabsTrigger value="header-menus">Header Menus</TabsTrigger>
        </TabsList>

        <TabsContent value="meta-tags" className="space-y-6">
          <MetaTagsTab />
        </TabsContent>

        <TabsContent value="social-media" className="space-y-6">
          <SocialMediaTab />
        </TabsContent>

        <TabsContent value="footer-menus" className="space-y-6">
          <FooterMenusTab />
        </TabsContent>

        <TabsContent value="header-menus" className="space-y-6">
          <HeaderMenusTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
