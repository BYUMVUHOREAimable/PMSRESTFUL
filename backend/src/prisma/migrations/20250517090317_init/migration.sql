/*
  Warnings:

  - The values [COMPLETED,CANCELLED] on the enum `TransferStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransferStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "vehicle_transfers" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "vehicle_transfers" ALTER COLUMN "status" TYPE "TransferStatus_new" USING ("status"::text::"TransferStatus_new");
ALTER TYPE "TransferStatus" RENAME TO "TransferStatus_old";
ALTER TYPE "TransferStatus_new" RENAME TO "TransferStatus";
DROP TYPE "TransferStatus_old";
ALTER TABLE "vehicle_transfers" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
