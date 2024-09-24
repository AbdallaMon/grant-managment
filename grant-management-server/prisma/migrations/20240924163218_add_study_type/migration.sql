/*
  Warnings:

  - Added the required column `typeOfStudy` to the `AcademicPerformance` table without a default value. This is not possible if the table is not empty.

*/
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
ALTER TABLE `academicperformance` ADD COLUMN `typeOfStudy` ENUM('NEW_STUDENT', 'CURRENT_STUDENT') NOT NULL;

-- AddForeignKey
ALTER TABLE `SupportingFiles` ADD CONSTRAINT `PersonalId_FK` FOREIGN KEY (`id`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingFiles` ADD CONSTRAINT `StudentDoc_FK` FOREIGN KEY (`id`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingFiles` ADD CONSTRAINT `MedicalReport_FK` FOREIGN KEY (`id`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingFiles` ADD CONSTRAINT `PersonalPhoto_FK` FOREIGN KEY (`id`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingFiles` ADD CONSTRAINT `ProofOfAddress_FK` FOREIGN KEY (`id`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
