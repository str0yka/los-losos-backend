-- AddForeignKey
ALTER TABLE `ProductInCart` ADD CONSTRAINT `ProductInCart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
