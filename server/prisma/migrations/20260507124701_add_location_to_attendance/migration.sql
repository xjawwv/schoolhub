-- AlterTable
ALTER TABLE `attendance_details` ADD COLUMN `accuracy` DOUBLE NULL,
    ADD COLUMN `is_location_valid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;
