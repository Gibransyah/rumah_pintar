import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENGAJAR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { judul, deskripsi, fileUrl } = await req.json();

    const pengajar = await prisma.pengajar.findUnique({
      where: {
        userId: parseInt(session.user.id),
      },
    });

    if (!pengajar) {
      return NextResponse.json({ message: "Data pengajar tidak ditemukan." }, { status: 404 });
    }

    const materi = await prisma.materi.create({
      data: {
        judul,
        deskripsi,
        fileUrl,
        pengajarId: pengajar.id,
      },
    });

    return NextResponse.json(materi);
  } catch (error) {
    console.error("Upload materi error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan." }, { status: 500 });
  }
}
