import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// POST: Rute API untuk menginput nilai oleh pengajar
export async function POST(req: Request) {
  // Ambil sesi pengguna dari NextAuth
  const session = await getServerSession(authOptions);

  // Periksa apakah pengguna sudah login dan memiliki peran "PENGAJAR"
  if (!session || session.user.role !== "PENGAJAR") {
    // Jika tidak diotorisasi, kembalikan respons 401 Unauthorized
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Konversi userId sesi ke tipe angka, karena di Prisma mungkin int
  const pengajarUserId = parseInt(session.user.id);

  try {
    // Ambil body request dalam format JSON
    const body = await req.json();
    const { siswaId, mataPelajaran, nilai } = body;

    // Validasi input: Pastikan semua field yang wajib diisi ada dan nilai bertipe number
    if (!siswaId || !mataPelajaran || typeof nilai !== "number") {
      // Jika data tidak lengkap atau format salah, kembalikan respons 400 Bad Request
      return NextResponse.json({ message: "Data tidak lengkap atau format salah." }, { status: 400 });
    }

    // Cari data pengajar berdasarkan userId yang sedang login
    const pengajar = await prisma.pengajar.findUnique({
      where: { userId: pengajarUserId },
    });

    // Jika data pengajar tidak ditemukan, kembalikan respons 404 Not Found
    if (!pengajar) {
      return NextResponse.json({ message: "Data pengajar tidak ditemukan." }, { status: 404 });
    }

    // Simpan nilai baru ke database
    const saved = await prisma.nilai.create({
      data: {
        siswaId,
        pengajarId: pengajar.id, // Gunakan ID pengajar yang ditemukan
        mataPelajaran,
        nilai,
      },
    });

    // Kembalikan objek nilai yang baru disimpan sebagai respons sukses
    return NextResponse.json(saved, { status: 201 }); // Menggunakan 201 Created untuk resource baru
  } catch (err: any) { // Tangkap error yang mungkin terjadi selama proses
    console.error("POST /api/pengajar/nilai error:", err);

    // Tangani error spesifik Prisma jika siswaId tidak ditemukan (foreign key constraint)
    if (err.code === 'P2003') { // P2003: Foreign key constraint failed
      return NextResponse.json({ message: "Siswa dengan ID yang diberikan tidak ditemukan." }, { status: 404 });
    }

    // Kembalikan respons 500 Internal Server Error untuk error lainnya
    return NextResponse.json({ message: "Gagal menyimpan nilai." }, { status: 500 });
  }
}

// GET: Rute API untuk mengambil nilai milik pengajar yang sedang login
export async function GET() {
  // Ambil sesi pengguna dari NextAuth
  const session = await getServerSession(authOptions);

  // Periksa apakah pengguna sudah login dan memiliki peran "PENGAJAR"
  if (!session || session.user.role !== "PENGAJAR") {
    // Jika tidak diotorisasi, kembalikan respons 401 Unauthorized
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Konversi userId sesi ke tipe angka
  const pengajarUserId = parseInt(session.user.id);

  try {
    // Ambil daftar nilai yang terkait dengan pengajar yang sedang login
    // Sertakan data siswa terkait (nama dan kelas)
    // Urutkan berdasarkan ID secara descending (terbaru di atas)
    const nilaiList = await prisma.nilai.findMany({
      where: {
        pengajar: {
          userId: pengajarUserId,
        },
      },
      include: {
        siswa: {
          select: {
            nama: true,
            kelas: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    // Kembalikan daftar nilai sebagai respons sukses
    return NextResponse.json(nilaiList);
  } catch (error) { // Tangkap error yang mungkin terjadi selama proses
    console.error("GET /api/pengajar/nilai error:", error);

    // Kembalikan respons 500 Internal Server Error
    return NextResponse.json({ message: "Gagal mengambil data nilai." }, { status: 500 });
  }
}