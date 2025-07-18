import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const { nama, kelas, email, password } = await req.json()

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "SISWA",
      },
    })

    await prisma.siswa.create({
      data: {
        nama,
        kelas,
        userId: user.id,
      },
    })

    return NextResponse.json({ message: "Berhasil menambah siswa" })
  } catch (error) {
    console.error("Gagal tambah siswa:", error)
    return NextResponse.json({ message: "Gagal menambah siswa" }, { status: 500 })
  }
}
