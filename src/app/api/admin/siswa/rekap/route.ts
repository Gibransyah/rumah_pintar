// src/app/api/admin/siswa/rekap/route.ts

import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { write, utils } from 'xlsx'
import { writeFile } from 'fs/promises'

export async function GET() {
  try {
    const siswa = await prisma.siswa.findMany({
      include: { user: true },
    })

    const data = siswa.map((s) => ({
      ID: s.id,
      Nama: s.nama,
      Email: s.user.email,
      Kelas: s.kelas,
    }))

    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Siswa')

    const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' })

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="siswa-rekap.xlsx"',
      },
    })
  } catch (error) {
    console.error('Gagal membuat rekap siswa:', error)
    return new Response('Terjadi kesalahan server.', { status: 500 })
  }
}
