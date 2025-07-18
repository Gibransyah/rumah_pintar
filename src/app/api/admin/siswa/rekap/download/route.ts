import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server'; // Menggunakan NextResponse untuk API Routes Next.js
import { write, utils } from 'xlsx'; // Import fungsi yang dibutuhkan dari xlsx

export async function GET() {
  try {
    // 1. Ambil data siswa dari database
    // Sertakan data user terkait karena email siswa ada di model User.
    const siswa = await prisma.siswa.findMany({
      include: { user: true },
    });

    // 2. Format data agar sesuai untuk Excel
    // Buat array objek, di mana setiap objek adalah baris di Excel.
    // Pastikan nama kolom sesuai dengan yang diinginkan di header Excel.
    const data = siswa.map((s) => ({
      ID: s.id,
      Nama: s.nama,
      Email: s.user.email, // Ambil email dari relasi user
      Kelas: s.kelas,
    }));

    // 3. Buat worksheet (lembar kerja) Excel dari data JSON
    const ws = utils.json_to_sheet(data);

    // 4. Buat workbook (buku kerja) Excel baru
    const wb = utils.book_new();

    // 5. Tambahkan worksheet ke workbook dengan nama sheet 'Siswa'
    utils.book_append_sheet(wb, ws, 'Siswa');

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
        'Content-Disposition': 'attachment; filename="siswa-rekap.xlsx"',
        // Tambahan header untuk mencegah caching (optional, tapi disarankan untuk file dinamis)
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Gagal membuat rekap siswa:', error);
    // Tangani error jika terjadi masalah
    return new Response('Terjadi kesalahan server.', { status: 500 });
  }
}