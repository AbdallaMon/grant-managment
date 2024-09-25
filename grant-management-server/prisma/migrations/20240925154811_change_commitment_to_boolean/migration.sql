/*
  Warnings:

  - You are about to alter the column `commitment` on the `application` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `scholarshipTerms` on the `application` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `application` MODIFY `commitment` BOOLEAN NULL,
    MODIFY `scholarshipTerms` BOOLEAN NULL;
