/*
  Warnings:

  - You are about to drop the `_groupstudents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_groupsupervisors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_groupstudents` DROP FOREIGN KEY `_GroupStudents_A_fkey`;

-- DropForeignKey
ALTER TABLE `_groupstudents` DROP FOREIGN KEY `_GroupStudents_B_fkey`;

-- DropForeignKey
ALTER TABLE `_groupsupervisors` DROP FOREIGN KEY `_GroupSupervisors_A_fkey`;

-- DropForeignKey
ALTER TABLE `_groupsupervisors` DROP FOREIGN KEY `_GroupSupervisors_B_fkey`;

-- AlterTable
ALTER TABLE `usergrant` ADD COLUMN `supervisorId` INTEGER NULL;

-- DropTable
DROP TABLE `_groupstudents`;

-- DropTable
DROP TABLE `_groupsupervisors`;

-- DropTable
DROP TABLE `group`;

-- AddForeignKey
ALTER TABLE `UserGrant` ADD CONSTRAINT `UserGrant_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
