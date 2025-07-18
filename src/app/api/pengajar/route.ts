import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const pengajar = await prisma.pengajar.findMany({
    select: {
      id: true,
      nama: true,
      mataPelajaran: true,
    },
  });

  return NextResponse.json(pengajar);
}
