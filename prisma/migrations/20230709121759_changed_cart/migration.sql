/*
  Warnings:

  - A unique constraint covering the columns `[cartId]` on the table `ProductInCart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `productincart` DROP FOREIGN KEY `ProductInCart_productId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `ProductInCart_cartId_key` ON `ProductInCart`(`cartId`);
