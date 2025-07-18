import { getAllSiswa } from "@/lib/siswa";
import Link from "next/link";
import HapusSiswaButton from "@/components/HapusSiswaButton"; // Pastikan path ini benar
import { Plus, Upload, Edit, Trash2 } from "lucide-react"; // Import ikon

export default async function DataSiswaPage() {
  const siswa = await getAllSiswa();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Data Siswa</h1>

      {/* Bagian Tombol Aksi */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard/admin/siswa/tambah"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          + Tambah Siswa Baru
        </Link>
        <Link
          href="/dashboard/admin/siswa/upload"
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-white shadow-md transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Siswa (Excel)
        </Link>
      </div>

      {/* Kondisi: Belum ada data siswa */}
      {siswa.length === 0 ? (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">Belum ada data siswa yang tersedia.</p>
          <p className="text-sm text-gray-500 mt-2">Gunakan tombol "Tambah Siswa Baru" atau "Upload Siswa" untuk memulai.</p>
        </div>
      ) : (
        /* Tabel Data Siswa */
        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 rounded-tl-lg">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Kelas</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {siswa.map((s) => (
                <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-gray-700">{s.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.kelas}</td>
                  <td className="space-x-2 px-4 py-3 text-sm flex items-center">
                    <Link
                      href={`/dashboard/admin/siswa/edit/${s.id}`}
                      className="inline-flex items-center text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-150"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Link>
                    {/* Mengasumsikan HapusSiswaButton dapat menerima prop kelas untuk styling atau diubah */}
                    <HapusSiswaButton id={s.id} />
                    {/* Alternatif: Jika HapusSiswaButton tidak dapat diubah, Anda bisa langsung membuat tombol di sini:
                    <button
                        onClick={() => alert(`Hapus siswa dengan ID: ${s.id}`)} // Ganti dengan logika hapus Anda
                        className="inline-flex items-center text-red-600 hover:underline hover:text-red-800 transition-colors duration-150"
                    >
                        <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </button>
                    */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}