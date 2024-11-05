-- AlterTable
ALTER TABLE `file` ADD COLUMN `academicPerformanceId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_academicPerformanceId_fkey` FOREIGN KEY (`academicPerformanceId`) REFERENCES `AcademicPerformance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
