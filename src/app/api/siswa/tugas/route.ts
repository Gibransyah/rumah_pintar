import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile } from "fs/promises"; // Untuk menulis file secara asinkron
import path from "path"; // Untuk mengelola path file
import { randomUUID } from "crypto"; // Untuk membuat nama file unik
import { mkdirSync, existsSync } from "fs"; // Untuk membuat direktori jika belum ada

// Lokasi penyimpanan file yang akan diupload di direktori public/uploads
const uploadDir = path.join(process.cwd(), "public", "uploads");

// POST: Rute API untuk mengupload jawaban tugas oleh siswa
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Periksa otorisasi: pastikan pengguna login dan berperan sebagai "SISWA"
  if (!session || session.user.role !== "SISWA") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ambil data form dari request
  const formData = await req.formData();
  // Ambil file 'jawaban' dari formData
  const file: File | null = formData.get("jawaban") as unknown as File;

  // Validasi file: pastikan file ada dan tidak kosong
  if (!file || file.size === 0) {
    return NextResponse.json({ message: "File tidak ditemukan atau kosong." }, { status: 400 });
  }

  // Konversi userId siswa dari sesi ke integer
  const siswaId = parseInt(session.user.id);

  try {
    // Cari data siswa di database berdasarkan userId
    const siswa = await prisma.siswa.findUnique({
      where: { userId: siswaId },
    });

    // Jika siswa tidak ditemukan, kembalikan respons 404
    if (!siswa) {
      return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });
    }

    // Ekstrak ekstensi file dari nama file asli
    const ext = file.name.split(".").pop();
    // Buat nama file unik untuk menghindari konflik nama
    const fileName = `tugas-${siswa.nama.replace(/\s+/g, '-')}-${randomUUID()}.${ext}`; // Ganti spasi di nama siswa

    // Konversi file menjadi Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Pastikan direktori upload ada, jika tidak, buatlah secara rekursif
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Tentukan path lengkap untuk menyimpan file
    const filePath = path.join(uploadDir, fileName);
    // Tulis file ke sistem file
    await writeFile(filePath, fileBuffer);

    // Buat URL publik untuk file yang diupload
    const publicUrl = `/uploads/${fileName}`;

    // Simpan informasi tugas siswa ke database
    await prisma.tugasSiswa.create({
      data: {
        fileUrl: publicUrl,
        siswaId: siswa.id, // Gunakan ID siswa dari database
      },
    });

    // Kembalikan respons sukses dengan URL file
    return NextResponse.json({ message: "Upload berhasil", fileUrl: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    // Tangani error jika terjadi masalah saat upload atau penyimpanan ke DB
    return NextResponse.json({ message: "Gagal upload file." }, { status: 500 });
  }
}

// GET: Rute API untuk mengambil daftar tugas siswa yang sudah diupload
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Periksa otorisasi: pastikan pengguna login dan berperan sebagai "SISWA"
  if (!session || session.user.role !== "SISWA") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Konversi userId siswa dari sesi ke integer
  const siswaId = parseInt(session.user.id);

  try {
    // Cari data siswa di database berdasarkan userId
    const siswa = await prisma.siswa.findUnique({
      where: { userId: siswaId },
    });

    // Jika siswa tidak ditemukan, kembalikan array kosong (tidak ada tugas)
    if (!siswa) {
      return NextResponse.json([], { status: 200 });
    }

    // Ambil semua tugas siswa yang terkait dengan siswa ini
    // Urutkan berdasarkan waktu upload terbaru
    const data = await prisma.tugasSiswa.findMany({
      where: { siswaId: siswa.id },
      orderBy: { uploadedAt: "desc" },
    });

    // Kembalikan daftar tugas siswa
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET tugas error:", error);
    // Tangani error jika terjadi masalah saat mengambil data
    return NextResponse.json([], { status: 500 }); // Kembalikan array kosong atau pesan error
  }
}