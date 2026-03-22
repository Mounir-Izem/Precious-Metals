-- CreateEnum
CREATE TYPE "Fixing" AS ENUM ('AM', 'PM');

-- CreateEnum
CREATE TYPE "Metal" AS ENUM ('gold', 'silver');

-- CreateTable
CREATE TABLE "SpotPrice" (
    "id" SERIAL NOT NULL,
    "metal" "Metal" NOT NULL,
    "fixing" "Fixing" NOT NULL,
    "oz_price_usd" DECIMAL(65,30) NOT NULL,
    "usd_to_eur" DECIMAL(65,30) NOT NULL,
    "usd_to_gbp" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpotPrice_pkey" PRIMARY KEY ("id")
);
