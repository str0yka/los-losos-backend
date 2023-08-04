/*
  Warnings:

  - You are about to drop the column `type` on the `promocode` table. All the data in the column will be lost.
  - Added the required column `discountType` to the `Promocode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiriseType` to the `Promocode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `orderId` INTEGER NULL,
    ADD COLUMN `promocodeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `promocode` DROP COLUMN `type`,
    ADD COLUMN `count` INTEGER NULL,
    ADD COLUMN `date` DATETIME(3) NULL,
    ADD COLUMN `discountType` ENUM('fix', 'percentage') NOT NULL,
    ADD COLUMN `expiriseType` ENUM('count', 'date', 'infinity') NOT NULL;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('accepted', 'inWork', 'enRoute', 'delivered', 'canceled') NOT NULL,
    `whenDelivered` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_promocodeId_fkey` FOREIGN KEY (`promocodeId`) REFERENCES `Promocode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
