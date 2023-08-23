/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Cart_orderId_fkey` ON `cart`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `ordersId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Orders_userId_key` ON `Orders`(`userId`);
