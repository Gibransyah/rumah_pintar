import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// DELETE /api/jadwal/[id] - Menghapus jadwal berdasarkan ID
export async function DELETE(
  _req: Request, // Parameter request tidak digunakan langsung, jadi diawali dengan underscore
  { params }: { params: { id: string } }
) {
  try {
    const jadwalId = Number(params.id); // Ubah nama variabel agar lebih jelas

    // Validasi ID: Pastikan ID yang diberikan adalah angka
    if (isNaN(jadwalId)) {
      return new NextResponse('ID jadwal tidak valid.', { status: 400 });
    }

    // Hapus jadwal dari database
    await prisma.jadwal.delete({
      where: { id: jadwalId },
    });

    // Kembalikan respons sukses 204 No Content (tidak ada konten yang dikembalikan setelah penghapusan)
    return new NextResponse(null, { status: 204 });
  } catch (error: any) { // Tangkap error dengan tipe 'any' untuk akses properti seperti 'code'
    console.error('Gagal menghapus jadwal:', error);

    // Tangani error spesifik Prisma jika record tidak ditemukan untuk dihapus
    if (error.code === 'P2025') { // P2025: Record to delete does not exist
      return new NextResponse('Jadwal tidak ditemukan untuk dihapus.', { status: 404 });
    }

    // Tangani error umum lainnya
    return new NextResponse('Terjadi kesalahan server saat menghapus jadwal.', { status: 500 });
  }
}

// PATCH /api/jadwal/[id] - Memperbarui jadwal berdasarkan ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jadwalId = Number(params.id); // Ubah nama variabel agar lebih jelas
    const data = await req.json();

    // Validasi ID: Pastikan ID yang diberikan adalah angka
    if (isNaN(jadwalId)) {
      return new NextResponse('ID jadwal tidak valid.', { status: 400 });
    }

    // Validasi data yang akan diperbarui (opsional, tapi disarankan)
    // Pastikan hanya field yang diizinkan untuk diupdate yang ada di 'data'
    // Contoh: jika pengajarId diupdate, pastikan itu angka
    if (data.pengajarId !== undefined) {
      const pengajarIdNum = Number(data.pengajarId);
      if (isNaN(pengajarIdNum)) {
        return new NextResponse('pengajarId dalam data pembaruan tidak valid. Harus berupa angka.', { status: 400 });
      }
      data.pengajarId = pengajarIdNum; // Pastikan menggunakan versi angka
    }

    // Perbarui jadwal di database
    const updatedJadwal = await prisma.jadwal.update({
      where: { id: jadwalId },
      data: data, // Data yang diterima dari request body
    });

    // Kembalikan objek jadwal yang telah diperbarui dengan status 200 OK
    return NextResponse.json(updatedJadwal, { status: 200 });
  } catch (error: any) { // Tangkap error dengan tipe 'any' untuk akses properti seperti 'code'
    console.error('Gagal memperbarui jadwal:', error);

    // Tangani error spesifik Prisma
    if (error.code === 'P2025') { // P2025: Record to update not found
      return new NextResponse('Jadwal tidak ditemukan untuk diperbarui.', { status: 404 });
    } else if (error.code === 'P2003') { // P2003: Foreign key constraint failed (misal: pengajarId tidak ada)
      return new NextResponse('Pengajar dengan ID yang diberikan tidak ditemukan. Pastikan ID pengajar benar.', { status: 404 });
    }

    // Tangani error umum lainnya
    return new NextResponse('Terjadi kesalahan server saat memperbarui jadwal.', { status: 500 });
  }
}