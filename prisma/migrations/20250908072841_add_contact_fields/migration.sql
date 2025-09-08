/*
  Warnings:

  - You are about to drop the column `facebook` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `youtube` on the `SiteSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SiteSetting" DROP COLUMN "facebook",
DROP COLUMN "instagram",
DROP COLUMN "twitter",
DROP COLUMN "youtube",
ADD COLUMN     "contactAddress" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT;
