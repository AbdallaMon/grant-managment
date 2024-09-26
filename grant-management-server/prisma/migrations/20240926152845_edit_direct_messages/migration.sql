-- AlterTable
ALTER TABLE `directmessage` ADD COLUMN `status` ENUM('SENT', 'DELIVERED', 'READ') NOT NULL DEFAULT 'SENT';
