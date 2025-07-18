import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Verifikasi sesi dan peran pengguna. Hanya PENGAJAR yang diizinkan.
  if (!session || session.user.role !== "PENGAJAR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ambil userId pengajar dari sesi dan konversi ke integer.
  const pengajarUserId = parseInt(session.user.id);

  try {
    // Ambil semua nilai yang terkait dengan pengajar yang sedang login.
    // Sertakan data siswa (ID, nama, kelas) untuk rekap.
    const nilaiList = await prisma.nilai.findMany({
      where: {
        pengajar: { userId: pengajarUserId },
      },
      include: {
        siswa: {
          select: {
            id: true,
            nama: true,
            kelas: true,
          },
        },
      },
    });

    // Kelompokkan nilai per siswa dan hitung rata-ratanya.
    const rekap: Record<
      number,
      {
        nama: string;
        kelas: string;
        nilai: { mataPelajaran: string; nilai: number }[];
        rataRata: number;
      }
    > = {};

    for (const n of nilaiList) {
      if (!rekap[n.siswa.id]) {
        // Inisialisasi entri siswa jika belum ada
        rekap[n.siswa.id] = {
          nama: n.siswa.nama,
          kelas: n.siswa.kelas,
          nilai: [],
          rataRata: 0, // Akan dihitung nanti
        };
      }

      // Tambahkan detail nilai mata pelajaran ke array nilai siswa
      rekap[n.siswa.id].nilai.push({
        mataPelajaran: n.mataPelajaran,
        nilai: n.nilai,
      });
    }

    // Hitung rata-rata nilai untuk setiap siswa
    Object.values(rekap).forEach((siswa) => {
      const total = siswa.nilai.reduce((sum, n) => sum + n.nilai, 0);
      siswa.rataRata = parseFloat((total / siswa.nilai.length).toFixed(2)); // Bulatkan ke 2 desimal
    });

    // Kembalikan data rekap sebagai array objek
    return NextResponse.json(Object.values(rekap));
  } catch (err) {
    console.error("GET /rekap-nilai error:", err);
    // Tangani error jika terjadi kegagalan pengambilan atau pemrosesan data
    return NextResponse.json({ message: "Gagal mengambil data rekap." }, { status: 500 });
  }
}