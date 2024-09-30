/*
  Warnings:

  - Added the required column `totalAmounts` to the `UserGrant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usergrant` ADD COLUMN `totalAmounts` DOUBLE NOT NULL;
