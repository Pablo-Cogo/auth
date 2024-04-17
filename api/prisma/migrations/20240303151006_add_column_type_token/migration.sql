/*
  Warnings:

  - Added the required column `type` to the `refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeToken" AS ENUM ('API', 'LOGIN');

-- AlterTable
ALTER TABLE "refresh_token" ADD COLUMN     "type" "TypeToken" NOT NULL;
