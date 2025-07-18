import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server'; // Menggunakan NextResponse untuk API Routes Next.js

// Rute API untuk membuat jadwal baru
export async function POST(req: Request) {
  try {
    // Mendefinisikan tipe data yang diharapkan dari body request untuk validasi yang lebih baik
    const data: {
      hari: string;
      jamMulai: string;
      jamSelesai: string;
      kelas: string;
      mataPelajaran: string;
      pengajarId: number | string; // Bisa berupa number atau string dari form
    } = await req.json();

    // Validasi input dasar: Pastikan semua field yang wajib diisi ada
    if (
      !data.hari ||
      !data.jamMulai ||
      !data.jamSelesai ||
      data.pengajarId === undefined || // Periksa keberadaan, termasuk 0 atau null jika memungkinkan
      !data.kelas ||
      !data.mataPelajaran
    ) {
      return new NextResponse('Semua field (hari, jamMulai, jamSelesai, pengajarId, kelas, mataPelajaran) wajib diisi.', { status: 400 });
    }

    // Validasi tambahan: Pastikan pengajarId adalah angka yang valid
    const pengajarIdNum = Number(data.pengajarId);
    if (isNaN(pengajarIdNum)) {
      return new NextResponse('pengajarId tidak valid. Harus berupa angka.', { status: 400 });
    }

    // Buat jadwal baru di database menggunakan data yang telah divalidasi
    const newJadwal = await prisma.jadwal.create({
      data: {
        hari: data.hari,
        jamMulai: data.jamMulai,
        jamSelesai: data.jamSelesai,
        kelas: data.kelas,
        mataPelajaran: data.mataPelajaran,
        pengajarId: pengajarIdNum, // Gunakan nilai angka yang sudah divalidasi
      },
    });

    // Kembalikan objek jadwal yang baru dibuat dengan status 201 Created
    return NextResponse.json(newJadwal, { status: 201 });
  } catch (error: any) { // Tangkap error dengan tipe 'any' untuk akses properti error
    console.error('Gagal membuat jadwal:', error);

    // Tangani error spesifik Prisma, seperti pelanggaran foreign key constraint (pengajarId tidak ditemukan)
    if (error.code === 'P2003') { // P2003: Foreign key constraint failed
      return new NextResponse('Pengajar dengan ID yang diberikan tidak ditemukan. Pastikan ID pengajar benar.', { status: 404 });
    }

    // Tangani error umum lainnya yang mungkin terjadi di sisi server
    return new NextResponse('Terjadi kesalahan server saat membuat jadwal.', { status: 500 });
  }
}