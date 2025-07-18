import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const { nama, kelas, email } = await req.json()

  const siswa = await prisma.siswa.update({
    where: { id },
    data: { nama, kelas },
  })

  await prisma.user.update({
    where: { id: siswa.userId },
    data: { email },
  })

  return NextResponse.json({ message: "Siswa diupdate" })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)

  const siswa = await prisma.siswa.findUnique({ where: { id } })
  if (!siswa) return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 })

  await prisma.user.delete({ where: { id: siswa.userId } })
  return NextResponse.json({ message: "Siswa dihapus" })
}
