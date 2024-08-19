/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "cart_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "cart_id_key" ON "cart"("id");
