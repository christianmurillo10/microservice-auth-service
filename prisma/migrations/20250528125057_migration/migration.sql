-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_logged` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `last_logged_at` DATETIME(0) NULL;
