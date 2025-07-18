import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { write, utils } from 'xlsx'; // Import fungsi yang dibutuhkan dari xlsx

export async function GET() {
  try {
    // 1. Ambil data pengajar dari database
    // Sertakan data user terkait karena email pengajar ada di model User.
    const pengajar = await prisma.pengajar.findMany({
      include: { user: true },
    });

    // 2. Format data agar sesuai untuk Excel
    // Buat array objek, di mana setiap objek adalah baris di Excel.
    // Pastikan nama kolom sesuai dengan yang diinginkan di header Excel.
    const dataForExcel = pengajar.map((p) => ({
      ID: p.id,
      Nama: p.nama,
      Email: p.user.email, // Ambil email dari relasi user
      'Mata Pelajaran': p.mataPelajaran,
    }));

    // 3. Buat worksheet (lembar kerja) Excel dari data JSON
    const ws = utils.json_to_sheet(dataForExcel);

    // 4. Buat workbook (buku kerja) Excel baru
    const wb = utils.book_new();

    // 5. Tambahkan worksheet ke workbook dengan nama sheet 'Pengajar'
    utils.book_append_sheet(wb, ws, 'Pengajar');

    // 6. Tulis workbook ke buffer dalam format XLSX
    // 'buffer' berarti output akan berupa Buffer Node.js
    // 'xlsx' adalah tipe file Excel modern
    const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' });

    // 7. Kirim buffer sebagai respons file yang dapat diunduh
    return new Response(buffer, {
      status: 200, // Status HTTP 200 OK
      headers: {
        // Tentukan tipe konten sebagai file Excel
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // Tentukan agar browser mengunduh file dengan nama tertentu
        'Content-Disposition': 'attachment; filename="pengajar-rekap.xlsx"',
        // Tambahan header untuk mencegah caching (optional, tapi disarankan untuk file dinamis)
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Gagal membuat rekap pengajar:', error);
    // Kembalikan respons error jika terjadi masalah
    return new Response('Terjadi kesalahan server saat membuat rekap pengajar.', { status: 500 });
  }
}