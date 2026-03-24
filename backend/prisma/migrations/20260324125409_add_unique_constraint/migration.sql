/*
  Warnings:

  - A unique constraint covering the columns `[metal,fixing,date]` on the table `SpotPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SpotPrice_metal_fixing_date_key" ON "SpotPrice"("metal", "fixing", "date");
