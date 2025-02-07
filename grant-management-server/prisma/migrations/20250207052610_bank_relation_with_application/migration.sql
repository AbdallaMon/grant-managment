/*
  Warnings:

  - A unique constraint covering the columns `[bankInfoId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `application` ADD COLUMN `bankInfoId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Application_bankInfoId_key` ON `Application`(`bankInfoId`);

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_bankInfoId_fkey` FOREIGN KEY (`bankInfoId`) REFERENCES `BankInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
