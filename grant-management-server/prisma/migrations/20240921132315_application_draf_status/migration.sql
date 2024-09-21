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
ALTER TABLE `application` MODIFY `status` ENUM('DRAFT', 'PENDING', 'UNDER_REVIEW', 'UN_COMPLETE', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

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
