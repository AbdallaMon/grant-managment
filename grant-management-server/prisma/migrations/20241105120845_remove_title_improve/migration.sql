/*
  Warnings:

  - You are about to drop the column `title` on the `improvementrequest` table. All the data in the column will be lost.
  - Added the required column `arFieldName` to the `ImprovementRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arModelName` to the `ImprovementRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldName` to the `ImprovementRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelName` to the `ImprovementRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `improvementrequest` DROP COLUMN `title`,
    ADD COLUMN `arFieldName` VARCHAR(191) NOT NULL,
    ADD COLUMN `arModelName` VARCHAR(191) NOT NULL,
    ADD COLUMN `fieldName` VARCHAR(191) NOT NULL,
    ADD COLUMN `modelName` VARCHAR(191) NOT NULL;
