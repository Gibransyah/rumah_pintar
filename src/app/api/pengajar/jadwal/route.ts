import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PENGAJAR") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const pengajar = await prisma.pengajar.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!pengajar) {
      return NextResponse.json(
        { message: "Data pengajar tidak ditemukan" },
        { status: 404 }
      );
    }

    const jadwal = await prisma.jadwal.findMany({
      where: {
        pengajarId: pengajar.id,
      },
      orderBy: [
        { hari: "asc" },
        { jamMulai: "asc" },
      ],
    });

    return NextResponse.json(jadwal);
  } catch (error) {
    console.error("[GET_JADWAL_PENGAJAR]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil jadwal." },
      { status: 500 }
    );
  }
}
