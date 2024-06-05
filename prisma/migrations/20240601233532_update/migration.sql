/*
  Warnings:

  - You are about to drop the column `emailVErified` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVErified",
ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
