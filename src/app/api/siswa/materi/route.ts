import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SISWA") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const materi = await prisma.materi.findMany({
      include: {
        pengajar: {
          select: { nama: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(materi);
  } catch (error) {
    console.error("Gagal mengambil materi:", error);
    return NextResponse.json({ message: "Gagal mengambil data materi." }, { status: 500 });
  }
}
