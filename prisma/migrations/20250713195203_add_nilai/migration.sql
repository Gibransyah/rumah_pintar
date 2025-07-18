-- CreateTable
CREATE TABLE `Nilai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siswaId` INTEGER NOT NULL,
    `pengajarId` INTEGER NOT NULL,
    `mataPelajaran` VARCHAR(191) NOT NULL,
    `nilai` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_siswaId_fkey` FOREIGN KEY (`siswaId`) REFERENCES `Siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_pengajarId_fkey` FOREIGN KEY (`pengajarId`) REFERENCES `Pengajar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
