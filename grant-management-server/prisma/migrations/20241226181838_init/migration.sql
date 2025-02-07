-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('ADMIN', 'SUPERVISOR', 'STUDENT', 'SPONSOR', 'INDIVIDUAL') NOT NULL DEFAULT 'STUDENT',
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(64) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `emailConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `basicInfoId` INTEGER NULL,
    `contactInfoId` INTEGER NULL,
    `studyInfoId` INTEGER NULL,

    UNIQUE INDEX `PersonalInfo_userId_key`(`userId`),
    UNIQUE INDEX `PersonalInfo_basicInfoId_key`(`basicInfoId`),
    UNIQUE INDEX `PersonalInfo_contactInfoId_key`(`contactInfoId`),
    UNIQUE INDEX `PersonalInfo_studyInfoId_key`(`studyInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BasicInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `familyName` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NULL,
    `residenceCountry` VARCHAR(191) NULL,
    `passport` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `hasDisability` BOOLEAN NULL,
    `disability` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudyInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `programType` VARCHAR(191) NOT NULL,
    `university` VARCHAR(191) NOT NULL,
    `college` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `studentIdNo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `supervisorId` INTEGER NULL,
    `status` ENUM('DRAFT', 'PENDING', 'UNDER_REVIEW', 'UN_COMPLETE', 'UPDATED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `rejectReason` VARCHAR(191) NULL,
    `commitment` BOOLEAN NULL,
    `scholarshipTerms` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScholarshipInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supportType` ENUM('FULL_SCHOLARSHIP', 'PARTIAL_SCHOLARSHIP', 'TUITION_ONLY', 'PERSONAL_EXPENSES') NOT NULL,
    `annualTuitionFee` DOUBLE NULL,
    `providedAmount` DOUBLE NULL,
    `requestedAmount` DOUBLE NULL,
    `applicationId` INTEGER NOT NULL,

    UNIQUE INDEX `ScholarshipInfo_applicationId_key`(`applicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AcademicPerformance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeOfStudy` ENUM('NEW_STUDENT', 'CURRENT_STUDENT') NOT NULL,
    `gpaType` ENUM('GPA_4', 'PERCENTAGE') NOT NULL,
    `gpaValue` DOUBLE NULL,
    `transcript` VARCHAR(191) NULL,
    `applicationId` INTEGER NOT NULL,

    UNIQUE INDEX `AcademicPerformance_applicationId_key`(`applicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResidenceInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `residenceType` ENUM('FAMILY', 'PRIVATE_HOUSING', 'DORMITORY') NOT NULL,
    `fatherStatus` ENUM('ALIVE', 'DECEASED', 'MISSING') NULL,
    `fatherIncome` DOUBLE NULL,
    `motherStatus` ENUM('ALIVE', 'DECEASED', 'MISSING') NULL,
    `motherIncome` DOUBLE NULL,
    `familyIncome` DOUBLE NULL,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `applicationId` INTEGER NOT NULL,

    UNIQUE INDEX `ResidenceInformation_applicationId_key`(`applicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportingFiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personalId` VARCHAR(191) NULL,
    `studentDoc` VARCHAR(191) NULL,
    `medicalReport` VARCHAR(191) NULL,
    `personalPhoto` VARCHAR(191) NULL,
    `proofOfAddress` VARCHAR(191) NULL,
    `applicationId` INTEGER NOT NULL,

    UNIQUE INDEX `SupportingFiles_applicationId_key`(`applicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sibling` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `relation` VARCHAR(191) NOT NULL,
    `university` VARCHAR(191) NOT NULL,
    `college` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `studyYear` INTEGER NOT NULL,
    `sourceOfStudy` ENUM('SELF_FUNDED', 'SCHOLARSHIP') NOT NULL,
    `grantSource` VARCHAR(191) NULL,
    `grantAmount` DOUBLE NULL,
    `document` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applicationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('SPONSOR', 'INDIVIDUAL') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `amountLeft` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGrant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `grantId` INTEGER NOT NULL,
    `supervisorId` INTEGER NULL,
    `applicationId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `payEvery` VARCHAR(191) NOT NULL,
    `totalAmounts` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userGrantId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `amountPaid` DOUBLE NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `paymentId` INTEGER NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImprovementRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `applicationId` INTEGER NOT NULL,
    `modelName` VARCHAR(191) NOT NULL,
    `fieldName` VARCHAR(191) NOT NULL,
    `arModelName` VARCHAR(191) NOT NULL,
    `arFieldName` VARCHAR(191) NOT NULL,

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

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NULL,
    `type` ENUM('MESSAGE', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED', 'APPLICATION_UPDATE', 'APPLICATION_UN_COMPLETE', 'APPLICATION_RESPONSE', 'APPLICATION_NEW', 'APPLICATION_UNDER_REVIEW', 'APPLICATION_COMPLETED', 'NEW_TICKET', 'TICKET_UPDATE', 'TASK_ASSIGNED', 'TASK_COMPLETED', 'PAYMENT_DUE', 'PAYMENT_COMPLETED') NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminNotification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `notificationId` INTEGER NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `senderId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DirectMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `senderId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,
    `status` ENUM('SENT', 'DELIVERED', 'READ') NOT NULL DEFAULT 'SENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `supervisorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FAQ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applicationId` INTEGER NULL,
    `academicPerformanceId` INTEGER NULL,

    UNIQUE INDEX `File_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GrantViewAccess` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GrantViewAccess_AB_unique`(`A`, `B`),
    INDEX `_GrantViewAccess_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonalInfo` ADD CONSTRAINT `PersonalInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalInfo` ADD CONSTRAINT `PersonalInfo_basicInfoId_fkey` FOREIGN KEY (`basicInfoId`) REFERENCES `BasicInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalInfo` ADD CONSTRAINT `PersonalInfo_contactInfoId_fkey` FOREIGN KEY (`contactInfoId`) REFERENCES `ContactInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalInfo` ADD CONSTRAINT `PersonalInfo_studyInfoId_fkey` FOREIGN KEY (`studyInfoId`) REFERENCES `StudyInformation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `UserGrant` ADD CONSTRAINT `UserGrant_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGrant` ADD CONSTRAINT `UserGrant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGrant` ADD CONSTRAINT `UserGrant_grantId_fkey` FOREIGN KEY (`grantId`) REFERENCES `Grant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGrant` ADD CONSTRAINT `UserGrant_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userGrantId_fkey` FOREIGN KEY (`userGrantId`) REFERENCES `UserGrant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImprovementRequest` ADD CONSTRAINT `ImprovementRequest_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AskedField` ADD CONSTRAINT `AskedField_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNotification` ADD CONSTRAINT `AdminNotification_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNotification` ADD CONSTRAINT `AdminNotification_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessage` ADD CONSTRAINT `DirectMessage_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessage` ADD CONSTRAINT `DirectMessage_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_academicPerformanceId_fkey` FOREIGN KEY (`academicPerformanceId`) REFERENCES `AcademicPerformance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GrantViewAccess` ADD CONSTRAINT `_GrantViewAccess_A_fkey` FOREIGN KEY (`A`) REFERENCES `Grant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GrantViewAccess` ADD CONSTRAINT `_GrantViewAccess_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
