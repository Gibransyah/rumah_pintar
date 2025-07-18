import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SISWA") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { userId },
    });

    if (!siswa) {
      return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });
    }

    const nilai = await prisma.nilai.findMany({
      where: { siswaId: siswa.id },
      include: {
        pengajar: {
          select: { nama: true },
        },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(nilai);
  } catch (error) {
    console.error("Error fetch nilai siswa:", error);
    return NextResponse.json({ message: "Gagal mengambil data nilai." }, { status: 500 });
  }
}
