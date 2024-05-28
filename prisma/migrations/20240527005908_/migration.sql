/*
  Warnings:

  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - Added the required column `inStock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "inStock" INTEGER NOT NULL,
ADD COLUMN     "sizes" "Size"[] DEFAULT ARRAY[]::"Size"[];
