-- DropForeignKey
ALTER TABLE "parking_sessions" DROP CONSTRAINT "parking_sessions_slot_id_fkey";

-- AddForeignKey
ALTER TABLE "parking_sessions" ADD CONSTRAINT "parking_sessions_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "parking_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
