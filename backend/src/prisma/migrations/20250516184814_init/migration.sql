-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "parking_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
