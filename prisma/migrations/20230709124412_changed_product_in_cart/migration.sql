/*
  Warnings:

  - Made the column `cartId` on table `productincart` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `productincart` DROP FOREIGN KEY `ProductInCart_cartId_fkey`;

-- DropIndex
DROP INDEX `ProductInCart_cartId_productId_key` ON `productincart`;

-- AlterTable
ALTER TABLE `productincart` MODIFY `cartId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ProductInCart` ADD CONSTRAINT `ProductInCart_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
