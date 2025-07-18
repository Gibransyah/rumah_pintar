import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENGAJAR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const siswaList = await prisma.siswa.findMany({
      select: {
        id: true,
        nama: true,
        kelas: true,
      },
    });

    return NextResponse.json(siswaList);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data siswa." }, { status: 500 });
  }
}