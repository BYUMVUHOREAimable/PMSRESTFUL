-- DropForeignKey
ALTER TABLE "slot_requests" DROP CONSTRAINT "slot_requests_vehicle_id_fkey";

-- AddForeignKey
ALTER TABLE "slot_requests" ADD CONSTRAINT "slot_requests_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
