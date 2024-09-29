/*
  Warnings:

  - A unique constraint covering the columns `[basicInfoId]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactInfoId]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studyInfoId]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `personalinfo` DROP FOREIGN KEY `BasicInfo_FK`;

-- DropForeignKey
ALTER TABLE `personalinfo` DROP FOREIGN KEY `ContactInfo_FK`;

-- DropForeignKey
ALTER TABLE `personalinfo` DROP FOREIGN KEY `StudyInfo_FK`;

-- AlterTable
ALTER TABLE `personalinfo` ADD COLUMN `basicInfoId` INTEGER NULL,
    ADD COLUMN `contactInfoId` INTEGER NULL,
    ADD COLUMN `studyInfoId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PersonalInfo_basicInfoId_key` ON `PersonalInfo`(`basicInfoId`);

-- CreateIndex
CREATE UNIQUE INDEX `PersonalInfo_contactInfoId_key` ON `PersonalInfo`(`contactInfoId`);

-- CreateIndex
CREATE UNIQUE INDEX `PersonalInfo_studyInfoId_key` ON `PersonalInfo`(`studyInfoId`);

-- AddForeignKey
ALTER TABLE `PersonalInfo` ADD CONSTRAINT `PersonalInfo_basicInfoId_fkey` FOREIGN KEY (`basicInfoId`) REFERENCES `BasicInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalInfo` ADD CONSTRAINT `PersonalInfo_contactInfoId_fkey` FOREIGN KEY (`contactInfoId`) REFERENCES `ContactInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalInfo` ADD CONSTRAINT `PersonalInfo_studyInfoId_fkey` FOREIGN KEY (`studyInfoId`) REFERENCES `StudyInformation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
