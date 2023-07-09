/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId]` on the table `ProductInCart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProductInCart_cartId_productId_key` ON `ProductInCart`(`cartId`, `productId`);
