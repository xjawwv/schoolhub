/*
  Warnings:

  - You are about to drop the column `teacher_id` on the `attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `attendance_teacher_id_fkey`;

-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `teacher_id`;

-- AlterTable
ALTER TABLE `attendance_details` ADD COLUMN `check_in_time` DATETIME(3) NULL;
