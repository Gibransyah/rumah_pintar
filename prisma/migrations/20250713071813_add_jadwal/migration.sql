-- CreateTable
CREATE TABLE `Jadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hari` VARCHAR(191) NOT NULL,
    `jamMulai` VARCHAR(191) NOT NULL,
    `jamSelesai` VARCHAR(191) NOT NULL,
    `mataPelajaran` VARCHAR(191) NOT NULL,
    `pengajarId` INTEGER NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Jadwal` ADD CONSTRAINT `Jadwal_pengajarId_fkey` FOREIGN KEY (`pengajarId`) REFERENCES `Pengajar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
