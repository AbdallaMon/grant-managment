/*
  Warnings:

  - You are about to drop the column `transcriptId` on the `academicperformance` table. All the data in the column will be lost.
  - You are about to drop the column `siblingId` on the `file` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `academicperformance` DROP FOREIGN KEY `AcademicPerformance_transcriptId_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `File_siblingId_fkey`;

-- DropForeignKey
ALTER TABLE `supportingfiles` DROP FOREIGN KEY `MedicalReport_FK`;

-- DropForeignKey
ALTER TABLE `supportingfiles` DROP FOREIGN KEY `PersonalId_FK`;

-- DropForeignKey
ALTER TABLE `supportingfiles` DROP FOREIGN KEY `PersonalPhoto_FK`;

-- DropForeignKey
ALTER TABLE `supportingfiles` DROP FOREIGN KEY `ProofOfAddress_FK`;

-- DropForeignKey
ALTER TABLE `supportingfiles` DROP FOREIGN KEY `StudentDoc_FK`;

-- AlterTable
ALTER TABLE `academicperformance` DROP COLUMN `transcriptId`,
    ADD COLUMN `transcript` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `file` DROP COLUMN `siblingId`;

-- AlterTable
ALTER TABLE `sibling` ADD COLUMN `document` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `supportingfiles` ADD COLUMN `medicalReport` VARCHAR(191) NULL,
    ADD COLUMN `personalId` VARCHAR(191) NULL,
    ADD COLUMN `personalPhoto` VARCHAR(191) NULL,
    ADD COLUMN `proofOfAddress` VARCHAR(191) NULL,
    ADD COLUMN `studentDoc` VARCHAR(191) NULL;
