/*
  Warnings:

  - Added the required column `fileUrl` to the `Materi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Materi` ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL;
