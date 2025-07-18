import { prisma } from '@/lib/db';
import Link from 'next/link'; // Import Link untuk navigasi kembali
import FormJadwal from './form'; // Asumsi 'form' adalah komponen klien untuk form jadwal
import JadwalList from './JadwalList'; // Asumsi 'JadwalList' adalah komponen klien untuk menampilkan daftar jadwal
import { ArrowLeft } from 'lucide-react'; // Import ikon untuk tombol kembali

export default async function JadwalPage() {
  // Mengambil semua data jadwal dari database
  // Mengurutkan berdasarkan hari secara ascending (naik)
  // Menyertakan data 'pengajar' terkait melalui relasi
  const jadwal = await prisma.jadwal.findMany({
    orderBy: { hari: "asc" },
    include: { pengajar: true },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Kelola Jadwal</h1>

      {/* Link Kembali ke Dashboard Admin */}
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Kembali ke Dashboard Admin
      </Link>

      {/* Bagian Formulir Tambah Jadwal */}
      <div className="mb-10 rounded-xl bg-white p-6 sm:p-8 shadow-xl border border-gray-100">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Tambah Jadwal Baru</h2>
        <FormJadwal />
      </div>

      {/* Bagian Daftar Jadwal */}
      <div className="mt-10 rounded-xl bg-white p-6 sm:p-8 shadow-xl border border-gray-100">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Daftar Jadwal</h2>
        {/* JadwalList akan menangani tampilan daftar atau pesan jika kosong */}
        <JadwalList jadwal={jadwal} />
      </div>
    </div>
  );
}