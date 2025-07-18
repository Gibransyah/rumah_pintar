import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Periksa otorisasi: pastikan pengguna sudah login dan berperan sebagai "SISWA"
  if (!session || session.user.role !== "SISWA") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ambil userId siswa dari sesi dan konversi ke integer
  const userId = parseInt(session.user.id);

  try {
    // Cari data siswa di database berdasarkan userId yang login
    const siswa = await prisma.siswa.findUnique({
      where: { userId },
    });

    // Jika data siswa tidak ditemukan, kembalikan respons 404 Not Found
    if (!siswa) {
      return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
    }

    // Ambil jadwal berdasarkan kelas siswa
    // Urutkan berdasarkan hari dan jam mulai
    // Sertakan data pengajar dan user terkait untuk detail jadwal
    const jadwal = await prisma.jadwal.findMany({
      where: { kelas: siswa.kelas },
      orderBy: [
        { hari: "asc" }, // Urutkan berdasarkan hari secara ascending
        { jamMulai: "asc" } // Lalu urutkan berdasarkan jam mulai secara ascending
      ],
      include: {
        pengajar: { // Sertakan data pengajar
          include: { user: true }, // Sertakan data user pengajar (untuk email/info lainnya)
        },
      },
    });

    // Kembalikan daftar jadwal yang ditemukan
    return NextResponse.json(jadwal);
  } catch (error) {
    console.error("Gagal mengambil jadwal:", error);
    // Tangani error yang terjadi selama proses pengambilan data
    return NextResponse.json({ message: "Terjadi kesalahan." }, { status: 500 });
  }
}