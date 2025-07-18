import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import formidable from 'formidable'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import bcrypt from 'bcrypt'
import * as xlsx from 'xlsx'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  const data = await req.formData()
  const file = data.get('file') as File
  const buffer = Buffer.from(await file.arrayBuffer())

  const workbook = xlsx.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(sheet)

  for (const row of rows as any[]) {
    const { nama, email, password, kelas } = row

    // Validasi dasar
    if (!nama || !email || !password || !kelas) continue

    // Simpan user & siswa
    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: 'SISWA',
        siswa: {
          create: {
            nama,
            kelas,
          },
        },
      },
    })
  }

  return NextResponse.json({ message: 'Upload berhasil' })
}