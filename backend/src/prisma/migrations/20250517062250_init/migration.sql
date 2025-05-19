-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "otp_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);
