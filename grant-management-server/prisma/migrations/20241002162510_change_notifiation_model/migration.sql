/*
  Warnings:

  - The values [APPLICATION,TICKET] on the enum `Notification_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `type` ENUM('MESSAGE', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED', 'APPLICATION_UPDATE', 'APPLICATION_RESPONSE', 'NEW_TICKET', 'TICKET_UPDATE', 'TASK_ASSIGNED', 'TASK_COMPLETED', 'PAYMENT_DUE', 'PAYMENT_COMPLETED') NOT NULL,
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
