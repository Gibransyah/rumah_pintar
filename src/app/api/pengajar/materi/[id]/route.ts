import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENGAJAR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const materiId = parseInt(params.id);
  if (isNaN(materiId)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  try {
    const materi = await prisma.materi.findFirst({
      where: {
        id: materiId,
        pengajar: {
          userId: parseInt(session.user.id),
        },
      },
    });

    if (!materi) {
      return new NextResponse("Materi not found", { status: 404 });
    }

    await prisma.materi.delete({
      where: {
        id: materiId,
      },
    });

    return NextResponse.json({ message: "Materi deleted successfully." });
  } catch (error) {
    console.error("Failed to delete materi:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
