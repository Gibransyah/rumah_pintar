import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// PATCH /api/admin/pengajar/[id] - Memperbarui data pengajar berdasarkan ID
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const pengajarId = Number(params.id);

    // Destrukturisasi data dari body request
    const { nama, email, mataPelajaran } = await req.json();

    // Validasi input: Pastikan semua data yang diperlukan ada dan ID valid
    if (isNaN(pengajarId) || !nama || !email || !mataPelajaran) {
      return new NextResponse('Data tidak valid. Pastikan ID pengajar, nama, email, dan mata pelajaran disediakan.', { status: 400 });
    }

    // Perbarui data pengajar dan juga email user terkait
    const updatedPengajar = await prisma.pengajar.update({
      where: { id: pengajarId },
      data: {
        nama,
        mataPelajaran,
        user: {
          update: { email }, // Memperbarui email user terkait
        },
      },
    });

    // Kembalikan data pengajar yang telah diperbarui dengan status 200 OK
    return NextResponse.json(updatedPengajar, { status: 200 });

  } catch (error: any) {
    console.error('Gagal memperbarui pengajar:', error);

    // Tangani error spesifik Prisma
    if (error.code === 'P2025') {
      // P2025: Record to update not found (misalnya, pengajarId tidak ditemukan)
      return new NextResponse('Pengajar tidak ditemukan.', { status: 404 });
    } else if (error.code === 'P2002') {
      // P2002: Unique constraint failed (misalnya, email yang diperbarui sudah digunakan)
      return new NextResponse('Email sudah digunakan oleh pengajar lain. Harap gunakan email yang berbeda.', { status: 409 });
    }

    // Tangani error umum lainnya
    return new NextResponse('Terjadi kesalahan server saat memperbarui pengajar.', { status: 500 });
  }
}


// DELETE /api/admin/pengajar/[id] - Menghapus pengajar berdasarkan ID
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const pengajarId = Number(params.id);

    // Validasi ID: Pastikan ID yang diberikan adalah angka
    if (isNaN(pengajarId)) {
      return new NextResponse('ID pengajar tidak valid.', { status: 400 });
    }

    // Cari pengajar terlebih dahulu untuk mendapatkan userId-nya.
    // Ini penting agar kita bisa menghapus user terkait setelah pengajar dihapus.
    const pengajar = await prisma.pengajar.findUnique({
      where: { id: pengajarId },
      select: { userId: true }, // Hanya ambil userId
    });

    // Jika pengajar tidak ditemukan, kembalikan respons 404 Not Found
    if (!pengajar) {
      return new NextResponse('Pengajar tidak ditemukan.', { status: 404 });
    }

    // Hapus pengajar dari database
    await prisma.pengajar.delete({ where: { id: pengajarId } });

    // Hapus user terkait dari database menggunakan userId yang sudah didapatkan.
    // Pastikan `pengajar.userId` ada sebelum mencoba menghapus user.
    if (pengajar.userId) {
      await prisma.user.delete({ where: { id: pengajar.userId } });
    }

    // Kembalikan status 204 No Content untuk penghapusan yang berhasil
    // (tidak ada konten yang perlu dikembalikan)
    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error('Gagal menghapus pengajar:', error);

    // Tangani error spesifik Prisma jika record tidak ditemukan (misalnya, sudah dihapus duluan)
    if (error.code === 'P2025') {
      return new NextResponse('Pengajar atau pengguna terkait tidak ditemukan untuk dihapus.', { status: 404 });
    }

    // Tangani error umum lainnya
    return new NextResponse('Terjadi kesalahan server saat menghapus pengajar.', { status: 500 });
  }
}