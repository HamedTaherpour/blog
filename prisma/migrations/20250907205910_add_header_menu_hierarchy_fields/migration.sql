-- AlterTable
ALTER TABLE "public"."HeaderMenuItem" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "linkId" TEXT,
ADD COLUMN     "linkType" TEXT NOT NULL DEFAULT 'custom',
ADD COLUMN     "path" TEXT NOT NULL DEFAULT '';
