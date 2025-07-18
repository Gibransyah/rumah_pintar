import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// POST /api/admin/pengajar - Menambahkan pengajar baru
export async function POST(req: Request) {
  try {
    const { nama, email, password, mataPelajaran } = await req.json();

    // Validasi input dasar: Pastikan semua data yang diperlukan ada.
    if (!nama || !email || !password || !mataPelajaran) {
      return new NextResponse('Nama, email, password, dan mata pelajaran wajib diisi.', { status: 400 });
    }

    // Periksa apakah email sudah terdaftar di database.
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return new NextResponse('Email sudah terdaftar. Harap gunakan email lain.', { status: 409 }); // Konflik
    }

    // Hash password sebelum menyimpannya ke database untuk keamanan.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat pengguna (user) baru dengan peran 'PENGAJAR'
    // dan secara otomatis buat record pengajar terkait melalui relasi.
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'PENGAJAR', // Tetapkan peran sebagai 'PENGAJAR'
        pengajar: {
          create: {
            nama,
            mataPelajaran,
          },
        },
      },
      include: {
        pengajar: true, // Sertakan data pengajar yang baru dibuat dalam respons
      },
    });

    // Jangan kirim password yang di-hash kembali ke client untuk alasan keamanan.
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created

  } catch (error: any) { // Tangkap error dengan tipe 'any' untuk akses properti seperti 'code'
    console.error('Error saat menambahkan pengajar (POST):', error);

    // Tangani error spesifik Prisma, seperti duplikasi unik (jika email sudah ada)
    if (error.code === 'P2002') { // P2002 adalah kode error untuk Unique constraint failed
      return new NextResponse('Email sudah digunakan, harap gunakan email lain.', { status: 409 });
    }

    // Tangani error umum lainnya.
    return new NextResponse('Terjadi kesalahan server saat menambahkan pengajar.', { status: 500 });
  }
}

// GET /api/admin/pengajar - Mengambil semua data pengajar
export async function GET() {
  try {
    // Ambil semua data pengajar dari database, termasuk data user terkait.
    const pengajar = await prisma.pengajar.findMany({
      include: { user: true },
    });

    return NextResponse.json(pengajar, { status: 200 }); // 200 OK
  } catch (error) {
    console.error('Error saat mengambil data pengajar (GET):', error);
    return new NextResponse('Gagal mengambil data pengajar.', { status: 500 });
  }
}