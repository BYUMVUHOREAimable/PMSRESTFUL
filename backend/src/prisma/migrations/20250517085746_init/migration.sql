/*
  Warnings:

  - Added the required column `description` to the `vehicle_transfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehicle_transfers" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
