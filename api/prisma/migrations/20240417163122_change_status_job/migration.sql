/*
  Warnings:

  - The values [CANCEL] on the enum `StatusJobEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusJobEnum_new" AS ENUM ('SUCCESS', 'FAIL');
ALTER TABLE "jobs" ALTER COLUMN "status" TYPE "StatusJobEnum_new" USING ("status"::text::"StatusJobEnum_new");
ALTER TYPE "StatusJobEnum" RENAME TO "StatusJobEnum_old";
ALTER TYPE "StatusJobEnum_new" RENAME TO "StatusJobEnum";
DROP TYPE "StatusJobEnum_old";
COMMIT;
