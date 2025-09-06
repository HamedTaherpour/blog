-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogType" TEXT DEFAULT 'website',
    "ogImage" TEXT,
    "twitterCard" TEXT DEFAULT 'summary',
    "twitterTitle" TEXT,
    "twitterDescription" TEXT,
    "twitterImage" TEXT,
    "iconType" TEXT,
    "iconMediaId" TEXT,
    "coverMediaId" TEXT,
    "ogImageMediaId" TEXT,
    "twitterImageMediaId" TEXT,
    "parentId" TEXT,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "description", "id", "image", "name", "slug", "updatedAt") SELECT "createdAt", "description", "id", "image", "name", "slug", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE TABLE "new_SiteSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteName" TEXT NOT NULL,
    "siteDesc" TEXT,
    "logoUrl" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSetting" ("facebook", "id", "instagram", "logoUrl", "siteDesc", "siteName", "twitter", "updatedAt") SELECT "facebook", "id", "instagram", "logoUrl", "siteDesc", "siteName", "twitter", "updatedAt" FROM "SiteSetting";
DROP TABLE "SiteSetting";
ALTER TABLE "new_SiteSetting" RENAME TO "SiteSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
