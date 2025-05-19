/*
  Warnings:

  - You are about to drop the column `isOccupied` on the `parking_slots` table. All the data in the column will be lost.
  - Added the required column `location` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `parking_slots` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "parking_slots" DROP COLUMN "isOccupied",
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "size" "SlotSize" NOT NULL,
ADD COLUMN     "status" "SlotStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL;
