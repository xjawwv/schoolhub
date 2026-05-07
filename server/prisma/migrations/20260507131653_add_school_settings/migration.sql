-- CreateTable
CREATE TABLE `school_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_name` VARCHAR(200) NOT NULL,
    `school_latitude` DOUBLE NOT NULL,
    `school_longitude` DOUBLE NOT NULL,
    `school_radius` INTEGER NOT NULL DEFAULT 100,
    `updated_by` INTEGER NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
