import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENGAJAR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { judul, deskripsi, fileUrl } = await req.json();

  if (!judul || !deskripsi || !fileUrl) {
    return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 });
  }

  // cari ID pengajar berdasarkan userId login
  const pengajar = await prisma.pengajar.findUnique({
    where: { userId: parseInt(session.user.id) },
  });

  if (!pengajar) {
    return NextResponse.json({ message: "Data pengajar tidak ditemukan" }, { status: 404 });
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
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENGAJAR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const pengajar = await prisma.pengajar.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: {
      materi: true,
    },
  });

  if (!pengajar) {
    return NextResponse.json({ message: "Data pengajar tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(pengajar.materi);
}