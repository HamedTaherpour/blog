-- CreateTable
CREATE TABLE "HeaderMenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "HeaderMenuItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "HeaderMenuItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
