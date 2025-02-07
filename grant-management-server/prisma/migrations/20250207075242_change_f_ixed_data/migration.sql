/*
  Warnings:

  - You are about to drop the `commitment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `commitment`;

-- CreateTable
CREATE TABLE `FixedData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `type` ENUM('COMMITMENT', 'GRANTTERMS') NOT NULL DEFAULT 'COMMITMENT',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
