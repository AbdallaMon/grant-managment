/*
  Warnings:

  - You are about to drop the column `value` on the `improvementrequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `application` MODIFY `status` ENUM('DRAFT', 'PENDING', 'UNDER_REVIEW', 'UN_COMPLETE', 'UPDATED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `improvementrequest` DROP COLUMN `value`;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `href` VARCHAR(191) NULL,
    MODIFY `type` ENUM('APPLICATION', 'TICKET', 'MESSAGE', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED', 'APPLICATION_UPDATE', 'APPLICATION_RESPONSE', 'TASK_ASSIGNED', 'TASK_COMPLETED', 'PAYMENT_DUE', 'PAYMENT_COMPLETED') NOT NULL;
