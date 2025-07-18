import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // 1. Validasi Keberadaan File
    if (!file) {
      return new NextResponse('Tidak ada file yang diunggah.', { status: 400 });
    }

    // 2. Validasi Tipe File (Opsional tapi disarankan)
    // Anda bisa menambahkan validasi di sini untuk memastikan file adalah Excel (misal: .xlsx, .xls)
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return new NextResponse('Tipe file tidak didukung. Harap unggah file Excel (.xlsx atau .xls).', { status: 400 });
    }

    // 3. Baca Buffer File
    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Proses File Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const results = {
      successCount: 0,
      failedCount: 0,
      errors: [] as { row: any; message: string }[],
    };

    // 5. Iterasi dan Proses Setiap Baris Data
    for (const row of data as any[]) {
      const { nama, email, password, mataPelajaran } = row;

      try {
        // Validasi data baris
        if (!nama || !email || !password || !mataPelajaran) {
          throw new Error('Data tidak lengkap (nama, email, password, atau mataPelajaran hilang).');
        }

        // Pastikan password adalah string sebelum di-hash
        const passwordString = String(password);
        if (passwordString.trim() === '') {
          throw new Error('Password tidak boleh kosong.');
        }

        // Periksa apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
          where: { email: email },
        });

        if (existingUser) {
          throw new Error('Email sudah terdaftar.');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(passwordString, 10);

        // Buat user dan pengajar
        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'PENGAJAR',
            pengajar: {
              create: {
                nama,
                mataPelajaran,
              },
            },
          },
        });
        results.successCount++;
      } catch (rowError: any) {
        results.failedCount++;
        results.errors.push({
          row: row,
          message: rowError.message || 'Kesalahan tidak diketahui saat memproses baris.',
        });
        console.error(`Error memproses baris: ${JSON.stringify(row)} - ${rowError.message}`);
      }
    }

    // 6. Kembalikan Respons Hasil Proses
    if (results.failedCount > 0) {
      return NextResponse.json(
        {
          message: `Pengunggahan selesai dengan ${results.successCount} berhasil dan ${results.failedCount} gagal.`,
          details: results,
        },
        { status: 207 } // 207 Multi-Status (beberapa berhasil, beberapa gagal)
      );
    } else {
      return NextResponse.json(
        { message: 'Semua pengajar berhasil diunggah.', details: results },
        { status: 200 }
      );
    }
  } catch (mainError: any) {
    console.error('Gagal mengunggah pengajar secara keseluruhan:', mainError);
    // Tangani error yang terjadi sebelum atau saat iterasi
    return new NextResponse(mainError.message || 'Terjadi kesalahan server saat mengunggah file.', { status: 500 });
  }
}