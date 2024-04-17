/*
  Warnings:

  - Added the required column `city` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ALTER COLUMN "last_access" SET DEFAULT CURRENT_TIMESTAMP;
