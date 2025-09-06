/*
  Warnings:

  - You are about to drop the `Bookmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Subscription_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Bookmark";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Comment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Follow";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Like";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Subscription";
PRAGMA foreign_keys=on;

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
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "canonicalUrl", "categoryId", "content", "coverImage", "createdAt", "excerpt", "focusKeyword", "id", "metaKeywords", "metaTitle", "ogImage", "ogTitle", "publishedAt", "scheduledAt", "slug", "status", "title", "twitterImage", "twitterTitle", "updatedAt") SELECT "authorId", "canonicalUrl", "categoryId", "content", "coverImage", "createdAt", "excerpt", "focusKeyword", "id", "metaKeywords", "metaTitle", "ogImage", "ogTitle", "publishedAt", "scheduledAt", "slug", "status", "title", "twitterImage", "twitterTitle", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
