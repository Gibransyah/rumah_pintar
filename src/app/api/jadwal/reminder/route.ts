import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Fungsi untuk mendapatkan nama hari dalam format string sesuai DB
function getTodayHari(): string {
  const hariIndonesia = [
    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
  ];
  const today = new Date();
  return hariIndonesia[today.getDay()];
}

// Fungsi untuk konversi HH:mm ke menit total
function waktuKeMenit(waktu: string): number {
  const [jam, menit] = waktu.split(":").map(Number);
  return jam * 60 + menit;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  // Periksa otorisasi: pastikan pengguna login dan berperan sebagai PENGAJAR
  if (!session || session.user.role !== "PENGAJAR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ambil userId pengajar dari sesi dan konversi ke integer
  const pengajarUserId = parseInt(session.user.id);

  try {
    // Cari data pengajar berdasarkan userId
    const pengajar = await prisma.pengajar.findUnique({
      where: { userId: pengajarUserId },
    });

    // Jika pengajar tidak ditemukan, kembalikan respons 404
    if (!pengajar) {
      return NextResponse.json({ message: "Pengajar tidak ditemukan." }, { status: 404 });
    }

    // Dapatkan nama hari ini dalam Bahasa Indonesia
    const hariIni = getTodayHari();
    // Dapatkan waktu sekarang dalam menit dari tengah malam
    const sekarang = new Date();
    const menitSekarang = sekarang.getHours() * 60 + sekarang.getMinutes();

    // Ambil jadwal pengajar untuk hari ini, diurutkan berdasarkan jam mulai
    const jadwalHariIni = await prisma.jadwal.findMany({
      where: {
        pengajarId: pengajar.id,
        hari: hariIni,
      },
      orderBy: { jamMulai: "asc" },
    });

    // Filter jadwal yang akan segera dimulai (dalam 1 jam ke depan)
    const akanSegeraMulai = jadwalHariIni.filter(j => {
      const menitMulai = waktuKeMenit(j.jamMulai);
      return menitMulai >= menitSekarang && menitMulai <= menitSekarang + 60; // Dalam 1 jam ke depan
    });

    // Kembalikan daftar jadwal yang akan segera dimulai
    return NextResponse.json(akanSegeraMulai);
  } catch (error) {
    console.error("Error reminder jadwal:", error);
    // Tangani error jika terjadi masalah saat mengambil data
    return NextResponse.json({ message: "Gagal mengambil data pengingat jadwal." }, { status: 500 });
  }
}