"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Pastikan react-hot-toast terinstal
import { Edit, Trash2 } from "lucide-react"; // Import ikon Edit dan Trash2

interface JadwalItem {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string;
  kelas: string;
  pengajar?: { // Pengajar bisa opsional jika relasinya tidak selalu ada atau nama bisa null
    nama: string;
  };
}

export default function JadwalList({ jadwal }: { jadwal: JadwalItem[] }) {
  const router = useRouter();

  // Fungsi untuk menangani penghapusan jadwal
  const handleDelete = async (id: number) => {
    // Konfirmasi pengguna sebelum menghapus
    if (!confirm("Yakin ingin menghapus jadwal ini?")) {
      return; // Batalkan jika pengguna tidak yakin
    }

    try {
      const res = await fetch(`/api/jadwal/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        // Jika respons tidak OK, coba ambil pesan error dari body respons
        const errorData = await res.json().catch(() => ({ message: "Gagal menghapus jadwal." }));
        toast.error(errorData.message || "Gagal menghapus jadwal.");
        return;
      }

      toast.success("Jadwal berhasil dihapus.");
      // Refresh halaman atau data setelah penghapusan berhasil
      router.refresh(); // Ini akan memicu refetch data di JadwalPage (Server Component)
    } catch (error: any) { // Tangkap error yang mungkin terjadi selama fetch
      console.error("Error saat menghapus jadwal:", error);
      toast.error(error.message || "Terjadi kesalahan saat menghapus jadwal.");
    }
  };

  return (
    // Kondisi: Menampilkan pesan jika tidak ada jadwal
    // Hapus div yang tidak perlu di sini
    <> {/* Menggunakan React Fragment untuk membungkus kondisi */}
      {jadwal.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow-md text-center border border-gray-100">
          <p className="text-lg text-gray-600">Belum ada jadwal yang tersedia.</p>
          <p className="text-sm text-gray-500 mt-2">Gunakan formulir di atas untuk menambahkan jadwal baru.</p>
        </div>
      ) : (
        // Tabel Daftar Jadwal
        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 rounded-tl-lg">Hari</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Jam</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Mata Pelajaran</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Pengajar</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Kelas</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jadwal.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-gray-700">{item.hari}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.jamMulai} - {item.jamSelesai}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.mataPelajaran}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.pengajar?.nama || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.kelas}</td>
                  <td className="px-4 py-3 text-sm space-x-2 flex items-center">
                    <button
                      onClick={() => {
                        localStorage.setItem("editJadwal", JSON.stringify(item));
                        location.reload();
                      }}
                      className="inline-flex items-center text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-150"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center text-red-600 hover:underline hover:text-red-800 transition-colors duration-150"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}