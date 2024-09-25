/*
  Warnings:

  - You are about to drop the column `education` on the `sibling` table. All the data in the column will be lost.
  - Added the required column `college` to the `Sibling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Sibling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyYear` to the `Sibling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `university` to the `Sibling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sibling` DROP COLUMN `education`,
    ADD COLUMN `college` VARCHAR(191) NOT NULL,
    ADD COLUMN `department` VARCHAR(191) NOT NULL,
    ADD COLUMN `studyYear` DATETIME(3) NOT NULL,
    ADD COLUMN `university` VARCHAR(191) NOT NULL;
