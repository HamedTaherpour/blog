-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteName" TEXT NOT NULL,
    "siteDesc" TEXT,
    "logoUrl" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "siteAuthor" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "focusKeyword" TEXT,
    "canonicalUrl" TEXT,
    "allowIndexing" BOOLEAN NOT NULL DEFAULT true,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogType" TEXT DEFAULT 'website',
    "ogImage" TEXT,
    "twitterTitle" TEXT,
    "twitterDescription" TEXT,
    "twitterCardType" TEXT DEFAULT 'summary',
    "twitterImage" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "tiktok" TEXT,
    "github" TEXT,
    "discord" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSetting" ("facebook", "id", "instagram", "logoUrl", "siteDesc", "siteName", "twitter", "updatedAt") SELECT "facebook", "id", "instagram", "logoUrl", "siteDesc", "siteName", "twitter", "updatedAt" FROM "SiteSetting";
DROP TABLE "SiteSetting";
ALTER TABLE "new_SiteSetting" RENAME TO "SiteSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
