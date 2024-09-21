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
ALTER TABLE `application` MODIFY `status` ENUM('PENDING', 'UNDER_REVIEW', 'UN_COMPLETE', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `ImprovementRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fieldId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `applicationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AskedField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` ENUM('FILE', 'TEXT') NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `value` VARCHAR(191) NULL,
    `applicationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- AddForeignKey
ALTER TABLE `ImprovementRequest` ADD CONSTRAINT `ImprovementRequest_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AskedField` ADD CONSTRAINT `AskedField_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
