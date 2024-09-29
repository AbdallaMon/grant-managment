/*
  Warnings:

  - You are about to drop the column `fieldId` on the `improvementrequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `improvementrequest` DROP COLUMN `fieldId`,
    ADD COLUMN `value` VARCHAR(191) NULL;
