-- DropForeignKey
ALTER TABLE `productincart` DROP FOREIGN KEY `ProductInCart_cartId_fkey`;

-- AlterTable
ALTER TABLE `productincart` MODIFY `cartId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ProductInCart` ADD CONSTRAINT `ProductInCart_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
