/*
  Warnings:

  - The values [OTHER] on the enum `Grant_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `amount` to the `Grant` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `application` ADD COLUMN `commitment` VARCHAR(191) NULL,
    ADD COLUMN `scholarshipTerms` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `grant` ADD COLUMN `amount` DOUBLE NOT NULL,
    MODIFY `type` ENUM('SPONSOR', 'INDIVIDUAL') NOT NULL;

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
