import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/siswa/[id] - Mengambil data satu siswa berdasarkan ID
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = Number(params.id);

    if (isNaN(studentId)) {
      return new NextResponse('ID Siswa tidak valid', { status: 400 });
    }

    const siswa = await prisma.siswa.findUnique({
      where: { id: studentId },
      include: { user: true }, // Sertakan data pengguna terkait
    });

    if (!siswa) {
      return new NextResponse('Siswa tidak ditemukan', { status: 404 });
    }

    return NextResponse.json(siswa);
  } catch (error) {
    console.error('Error mengambil data siswa (GET):', error);
    return new NextResponse('Gagal mengambil data siswa', { status: 500 });
  }
}

// PATCH /api/siswa/[id] - Memperbarui data siswa berdasarkan ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = Number(params.id);

    if (isNaN(studentId)) {
      return new NextResponse('ID Siswa tidak valid', { status: 400 });
    }

    const { nama, kelas, email } = await req.json();

    if (!nama && !kelas && !email) {
      return new NextResponse('Tidak ada data yang diberikan untuk pembaruan', { status: 400 });
    }

    const updatedSiswa = await prisma.siswa.update({
      where: { id: studentId },
      data: {
        ...(nama && { nama }),
        ...(kelas && { kelas }),
        ...(email && {
          user: {
            update: {
              email: email,
            },
          },
        }),
      },
    });

    return NextResponse.json(updatedSiswa);
  } catch (error) {
    console.error('Error memperbarui data siswa (PATCH):', error);
    return new NextResponse('Gagal memperbarui data siswa', { status: 500 });
  }
}

// DELETE /api/siswa/[id] - Menghapus siswa berdasarkan ID
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = Number(params.id);

    // Validasi ID siswa: Pastikan ID yang diberikan adalah angka.
    if (isNaN(studentId)) {
      return new NextResponse('ID Siswa tidak valid', { status: 400 });
    }

    // Cari siswa terlebih dahulu untuk mendapatkan userId sebelum penghapusan.
    // Ini penting karena setelah siswa dihapus, userId mungkin tidak lagi dapat diakses.
    const siswa = await prisma.siswa.findUnique({
      where: { id: studentId },
      select: { userId: true } // Hanya ambil userId yang dibutuhkan
    });

    // Jika siswa tidak ditemukan, kembalikan respons 404.
    if (!siswa) {
      return new NextResponse('Siswa tidak ditemukan', { status: 404 });
    }

    // Hapus siswa dari database.
    await prisma.siswa.delete({
      where: { id: studentId },
    });

    // Hapus pengguna terkait dari database menggunakan userId yang telah didapatkan.
    // Pastikan `siswa.userId` ada sebelum mencoba menghapus user.
    if (siswa.userId) {
      await prisma.user.delete({
        where: { id: siswa.userId },
      });
    }

    // Berikan respons keberhasilan jika siswa dan pengguna berhasil dihapus.
    return new NextResponse('Siswa dan pengguna berhasil dihapus', { status: 200 });
  } catch (error: any) { // Tangkap error dengan tipe 'any' untuk akses properti seperti 'code'
    console.error('Error menghapus siswa (DELETE):', error);

    // Tangani error spesifik Prisma jika record tidak ditemukan (misalnya, jika siswa sudah terhapus).
    if (error.code === 'P2025') {
      return new NextResponse('Siswa atau pengguna tidak ditemukan untuk dihapus', { status: 404 });
    }

    // Tangani error umum lainnya.
    return new NextResponse('Gagal menghapus siswa dan pengguna', { status: 500 });
  }
}