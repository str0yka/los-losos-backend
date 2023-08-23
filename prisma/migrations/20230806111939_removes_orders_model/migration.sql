/*
  Warnings:

  - You are about to drop the column `ordersId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `ordersId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_ordersId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `Orders_userId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `ordersId`,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `ordersId`;

-- DropTable
DROP TABLE `orders`;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
