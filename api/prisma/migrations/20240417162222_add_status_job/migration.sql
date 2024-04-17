/*
  Warnings:

  - Added the required column `status` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusJobEnum" AS ENUM ('SUCCESS', 'FAIL', 'CANCEL');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "status" "StatusJobEnum" NOT NULL;
