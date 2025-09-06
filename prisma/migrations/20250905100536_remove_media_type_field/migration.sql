/*
  Warnings:

  - You are about to drop the column `type` on the `Media` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT,
    "url" TEXT NOT NULL,
    "filename" TEXT,
    "size" INTEGER,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "durationSec" INTEGER,
    "provider" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("createdAt", "durationSec", "filename", "height", "id", "mimeType", "postId", "provider", "size", "url", "width") SELECT "createdAt", "durationSec", "filename", "height", "id", "mimeType", "postId", "provider", "size", "url", "width" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
