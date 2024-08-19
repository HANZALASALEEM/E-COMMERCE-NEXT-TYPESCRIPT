/*
  Warnings:

  - The primary key for the `cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cart` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `cart_id` on the `cartItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "cartItem" DROP CONSTRAINT "cartItem_cart_id_fkey";

-- DropIndex
DROP INDEX "cart_id_key";

-- AlterTable
ALTER TABLE "cart" DROP CONSTRAINT "cart_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "cart_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cartItem" DROP COLUMN "cart_id",
ADD COLUMN     "cart_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
