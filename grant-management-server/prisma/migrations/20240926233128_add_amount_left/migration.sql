/*
  Warnings:

  - Added the required column `amountLeft` to the `Grant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `grant` ADD COLUMN `amountLeft` DOUBLE NOT NULL;
