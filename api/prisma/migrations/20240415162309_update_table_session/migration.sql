/*
  Warnings:

  - You are about to drop the column `ip` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `device` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip_address` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "ip",
ADD COLUMN     "device" TEXT NOT NULL,
ADD COLUMN     "ip_address" TEXT NOT NULL;
