/*
  Warnings:

  - Added the required column `token` to the `refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_token" ADD COLUMN     "token" TEXT NOT NULL;
