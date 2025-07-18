import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  // Periksa otorisasi: pastikan pengguna login dan berperan sebagai PENGAJAR
  if (!session || session.user.role !== "PENGAJAR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ambil userId pengajar dari sesi dan konversi ke integer
  const pengajarUserId = parseInt(session.user.id);

  // Ambil ID nilai dari parameter URL dan konversi ke integer
  const nilaiId = parseInt(params.id);

  // Validasi ID nilai: pastikan ID adalah angka yang valid
  if (isNaN(nilaiId)) {
    return NextResponse.json({ message: "ID nilai tidak valid." }, { status: 400 });
  }

  try {
    // Cari data pengajar berdasarkan userId
    const pengajar = await prisma.pengajar.findUnique({
      where: { userId: pengajarUserId },
    });

    // Jika pengajar tidak ditemukan, kembalikan respons 404
    if (!pengajar) {
      return NextResponse.json({ message: "Pengajar tidak ditemukan." }, { status: 404 });
    }

    // Cari data nilai dan sertakan relasi pengajar
    const nilaiRecord = await prisma.nilai.findUnique({
      where: { id: nilaiId },
      include: { pengajar: true }, // Penting untuk memverifikasi kepemilikan
    });

    // Periksa apakah nilaiRecord ada dan apakah pengajarId dari nilaiRecord
    // cocok dengan pengajarUserId yang sedang login
    if (!nilaiRecord || nilaiRecord.pengajar.userId !== pengajarUserId) {
      return NextResponse.json({ message: "Data nilai tidak ditemukan atau tidak diizinkan." }, { status: 403 }); // 403 Forbidden
    }

    // Ambil data dari body request
    const body = await req.json();
    const { mataPelajaran, nilai } = body;

    // Validasi data yang akan diupdate: pastikan mata pelajaran dan nilai disediakan
    if (!mataPelajaran || typeof nilai !== "number") {
      return NextResponse.json({ message: "Data tidak lengkap atau format salah." }, { status: 400 });
    }

    // Lakukan update data nilai di database
    const updated = await prisma.nilai.update({
      where: { id: nilaiId },
      data: {
        mataPelajaran,
        nilai,
      },
    });

    // Kembalikan data nilai yang sudah diupdate dengan status 200 OK
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/pengajar/nilai/[id] error:", error);

    // Tangani error spesifik Prisma jika record tidak ditemukan (misal: ID tidak ada)
    // Walaupun sudah ada pengecekan di atas, ini bisa jadi fallback
    if (error.code === 'P2025') { // P2025: Record to update not found
        return NextResponse.json({ message: "Nilai tidak ditemukan untuk diupdate." }, { status: 404 });
    }

    // Kembalikan respons 500 Internal Server Error untuk error lainnya
    return NextResponse.json({ message: "Gagal mengupdate nilai." }, { status: 500 });
  }
}