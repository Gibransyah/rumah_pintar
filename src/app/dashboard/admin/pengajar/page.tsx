'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Import react-hot-toast untuk notifikasi
import { Plus, Upload, Download, Edit, Trash2, RefreshCcw } from 'lucide-react'; // Import ikon dari Lucide

// Mendefinisikan tipe untuk objek Pengajar agar lebih aman
interface Pengajar {
  id: number;
  nama: string;
  mataPelajaran: string;
  user: {
    email: string;
  };
}

export default function DaftarPengajarPage() {
  const [pengajar, setPengajar] = useState<Pengajar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Efek untuk memuat data pengajar saat komponen pertama kali dirender
  useEffect(() => {
    fetchPengajar();
  }, []); // Array dependensi kosong berarti hanya dijalankan sekali

  // Fungsi untuk mengambil data pengajar dari API
  async function fetchPengajar() {
    setLoading(true); // Aktifkan status loading
    setError(null); // Hapus error sebelumnya

    try {
      const res = await fetch('/api/admin/pengajar');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal memuat data pengajar.');
      }

      const data: Pengajar[] = await res.json();
      setPengajar(data);
    } catch (err: any) {
      console.error('Error fetching pengajar:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
      toast.error(err.message || 'Gagal memuat daftar pengajar.'); // Tampilkan toast error
    } finally {
      setLoading(false); // Nonaktifkan status loading setelah selesai (berhasil/gagal)
    }
  }

  // Fungsi untuk menangani penghapusan pengajar
  async function handleDelete(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus pengajar ini? Tindakan ini tidak dapat dibatalkan.')) {
      return; // Batalkan jika pengguna tidak yakin
    }

    try {
      const res = await fetch(`/api/admin/pengajar/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Pengajar berhasil dihapus!');
        fetchPengajar(); // Muat ulang daftar pengajar setelah penghapusan berhasil
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus pengajar.');
      }
    } catch (err: any) {
      console.error('Error deleting pengajar:', err);
      toast.error(`Gagal menghapus pengajar: ${err.message}`); // Tampilkan toast error spesifik
    }
  }

  // Kondisi render: Menampilkan pesan loading
  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Memuat data pengajar...</p>
      </div>
    );
  }

  // Kondisi render: Menampilkan pesan error dan tombol coba lagi
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center bg-red-50 rounded-lg shadow-md p-6">
        <p className="text-lg text-red-600 font-medium mb-4">Error: {error}</p>
        <button
          onClick={fetchPengajar}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <RefreshCcw className="h-5 w-5 mr-2" /> Coba Lagi
        </button>
      </div>
    );
  }

  // Render utama komponen
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Daftar Pengajar</h1>

      {/* Bagian tombol aksi */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard/admin/pengajar/tambah"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          + Tambah Pengajar Baru
        </Link>

        <Link
          href="/dashboard/admin/pengajar/upload"
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-white shadow-md transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Pengajar (Excel)
        </Link>

        {/* Tombol Rekap Data Pengajar */}
        <Link 
          href="/api/admin/pengajar/rekap" // Asumsi ini adalah API route yang menghasilkan file Excel
          className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-white shadow-md transition duration-300 ease-in-out hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          <Download className="h-5 w-5 mr-2" />
          Rekap Data Pengajar
        </Link>
      </div>

      {/* Kondisi: Menampilkan pesan jika tidak ada data */}
      {pengajar.length === 0 ? (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">Belum ada data pengajar yang tersedia.</p>
          <p className="text-sm text-gray-500 mt-2">Gunakan tombol "Tambah Pengajar Baru" atau "Upload Pengajar" untuk memulai.</p>
        </div>
      ) : (
        /* Tabel daftar pengajar */
        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 rounded-tl-lg">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Mata Pelajaran</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengajar.map((p) => (
                <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-gray-700">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.mataPelajaran}</td>
                  <td className="space-x-2 px-4 py-3 text-sm flex items-center">
                    <Link
                      href={`/dashboard/admin/pengajar/edit/${p.id}`}
                      className="inline-flex items-center text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-150"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
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
    </div>
  );
}