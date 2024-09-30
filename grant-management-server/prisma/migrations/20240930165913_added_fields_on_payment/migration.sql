/*
  Warnings:

  - Added the required column `endDate` to the `UserGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payEvery` to the `UserGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `UserGrant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `amountPaid` DOUBLE NULL;

-- AlterTable
ALTER TABLE `usergrant` ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `payEvery` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;
