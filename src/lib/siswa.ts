import { prisma } from "@/lib/db"

export const getAllSiswa = async () => {
  return await prisma.siswa.findMany({
    include: {
      user: true,
    },
  })
}
