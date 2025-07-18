import { prisma } from "@/lib/db"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
      },
    })

    return NextResponse.json({ message: "Registrasi berhasil" }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
