-- DropForeignKey
ALTER TABLE `academicperformance` DROP FOREIGN KEY `AcademicPerformance_applicationId_fkey`;

-- DropForeignKey
ALTER TABLE `residenceinformation` DROP FOREIGN KEY `ResidenceInformation_applicationId_fkey`;

-- DropForeignKey
ALTER TABLE `scholarshipinfo` DROP FOREIGN KEY `ScholarshipInfo_applicationId_fkey`;

-- DropForeignKey
ALTER TABLE `sibling` DROP FOREIGN KEY `Sibling_applicationId_fkey`;

-- DropForeignKey
ALTER TABLE `supportingfiles` DROP FOREIGN KEY `SupportingFiles_applicationId_fkey`;

-- AddForeignKey
ALTER TABLE `ScholarshipInfo` ADD CONSTRAINT `ScholarshipInfo_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AcademicPerformance` ADD CONSTRAINT `AcademicPerformance_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResidenceInformation` ADD CONSTRAINT `ResidenceInformation_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingFiles` ADD CONSTRAINT `SupportingFiles_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sibling` ADD CONSTRAINT `Sibling_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
