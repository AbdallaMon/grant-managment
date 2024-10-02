/*
  Warnings:

  - Changed the type of `studyYear` on the `sibling` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `sibling` DROP COLUMN `studyYear`,
    ADD COLUMN `studyYear` INTEGER NOT NULL;
