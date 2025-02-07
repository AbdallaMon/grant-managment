/*
  Warnings:

  - The values [TASK_ASSIGNED,TASK_COMPLETED] on the enum `Notification_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_supervisorId_fkey`;

-- AlterTable
ALTER TABLE `notification` MODIFY `type` ENUM('MESSAGE', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED', 'APPLICATION_UPDATE', 'APPLICATION_UN_COMPLETE', 'APPLICATION_RESPONSE', 'APPLICATION_NEW', 'APPLICATION_UNDER_REVIEW', 'APPLICATION_COMPLETED', 'NEW_TICKET', 'TICKET_UPDATE', 'PAYMENT_DUE', 'PAYMENT_COMPLETED') NOT NULL;

-- AlterTable
ALTER TABLE `personalinfo` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `task`;

-- CreateTable
CREATE TABLE `BankInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryName` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `branchCode` VARCHAR(191) NOT NULL,
    `bankAddress` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `currency` ENUM('USD', 'EUR', 'TRY', 'SYP', 'EGP', 'GBP') NOT NULL,
    `iban` VARCHAR(191) NOT NULL,
    `personalInfoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commitment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FixedFiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FixedFiles_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankInfo` ADD CONSTRAINT `BankInfo_personalInfoId_fkey` FOREIGN KEY (`personalInfoId`) REFERENCES `PersonalInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
