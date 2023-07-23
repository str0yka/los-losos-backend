/*
  Warnings:

  - Added the required column `type` to the `Promocode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Promocode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `promocode` ADD COLUMN `type` ENUM('fix', 'percentage') NOT NULL,
    ADD COLUMN `value` INTEGER NOT NULL;
