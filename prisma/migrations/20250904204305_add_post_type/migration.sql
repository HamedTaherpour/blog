-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "postType" TEXT NOT NULL DEFAULT 'IMAGE',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "scheduledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "metaTitle" TEXT,
    "metaKeywords" TEXT,
    "focusKeyword" TEXT,
    "canonicalUrl" TEXT,
    "metaDescription" TEXT,
    "allowIndexing" BOOLEAN NOT NULL DEFAULT true,
    "ogTitle" TEXT,
    "ogImage" TEXT,
    "ogType" TEXT DEFAULT 'article',
    "ogDescription" TEXT,
    "twitterTitle" TEXT,
    "twitterImage" TEXT,
    "twitterCardType" TEXT DEFAULT 'summary',
    "twitterDescription" TEXT,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("allowIndexing", "authorId", "canonicalUrl", "categoryId", "content", "coverImage", "createdAt", "excerpt", "focusKeyword", "id", "metaDescription", "metaKeywords", "metaTitle", "ogDescription", "ogImage", "ogTitle", "ogType", "publishedAt", "scheduledAt", "slug", "status", "title", "twitterCardType", "twitterDescription", "twitterImage", "twitterTitle", "updatedAt") SELECT "allowIndexing", "authorId", "canonicalUrl", "categoryId", "content", "coverImage", "createdAt", "excerpt", "focusKeyword", "id", "metaDescription", "metaKeywords", "metaTitle", "ogDescription", "ogImage", "ogTitle", "ogType", "publishedAt", "scheduledAt", "slug", "status", "title", "twitterCardType", "twitterDescription", "twitterImage", "twitterTitle", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
