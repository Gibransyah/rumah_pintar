"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Pastikan react-hot-toast sudah terinstal

// Tipe data untuk nilai siswa
interface Nilai {
  id: number;
  siswa: {
    nama: string;
    kelas: string;
  };
  mataPelajaran: string;
  nilai: number;
}

export default function EditNilaiPage() {
  const [dataNilai, setDataNilai] = useState<Nilai[]>([]);
  const [editId, setEditId] = useState<number | null>(null); // ID nilai yang sedang diedit
  const [mataPelajaranEdit, setMataPelajaranEdit] = useState(""); // State untuk input mata pelajaran saat edit
  const [nilaiEdit, setNilaiEdit] = useState(""); // State untuk input nilai saat edit
  const [loading, setLoading] = useState(false); // State untuk indikator loading
  const [pesan, setPesan] = useState<string | null>(null); // State untuk pesan feedback

  const router = useRouter();

  // Efek untuk memuat data nilai saat komponen pertama kali dirender
  useEffect(() => {
    const fetchNilai = async () => {
      try {
        const res = await fetch("/api/pengajar/nilai");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal memuat data nilai.");
        }
        const data: Nilai[] = await res.json();
        setDataNilai(data);
      } catch (err: any) {
        setPesan(err.message || "Gagal memuat data nilai.");
      } finally {
        setLoading(false); // Nonaktifkan loading setelah fetch selesai
      }
    };

    fetchNilai();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

  // Fungsi untuk memulai mode edit
  const mulaiEdit = (item: Nilai) => {
    setEditId(item.id);
    setMataPelajaranEdit(item.mataPelajaran);
    setNilaiEdit(String(item.nilai)); // Konversi nilai ke string untuk input
    setPesan(null); // Reset pesan saat memulai edit
  };

  // Fungsi untuk menyimpan perubahan nilai
  const simpanEdit = async (id: number) => {
    if (!mataPelajaranEdit || !nilaiEdit) {
      toast.error("Mata pelajaran dan nilai wajib diisi.");
      return;
    }

    const nilaiAngka = parseFloat(nilaiEdit);
    if (isNaN(nilaiAngka)) {
      toast.error("Nilai harus berupa angka.");
      return;
    }

    setLoading(true); // Aktifkan loading saat menyimpan
    try {
      const res = await fetch(`/api/pengajar/nilai/${id}`, {
        method: "PUT", // Menggunakan PUT untuk update keseluruhan resource
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mataPelajaran: mataPelajaranEdit,
          nilai: nilaiAngka,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal memperbarui nilai.");
      }

      toast.success("Nilai berhasil diperbarui.");

      // Perbarui nilai pada list lokal agar UI merefleksikan perubahan
      setDataNilai((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, mataPelajaran: mataPelajaranEdit, nilai: nilaiAngka }
            : item
        )
      );

      setEditId(null); // Keluar dari mode edit
      setPesan(null); // Hapus pesan sukses
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat memperbarui nilai.");
    } finally {
      setLoading(false); // Nonaktifkan loading
    }
  };

  // Fungsi untuk membatalkan mode edit
  const batalkanEdit = () => {
    setEditId(null);
    setMataPelajaranEdit("");
    setNilaiEdit("");
    setPesan(null); // Reset pesan saat membatalkan
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Edit Nilai Siswa</h1>

      {pesan && (
        <p className={`mb-4 text-center text-sm font-medium ${pesan.includes("Gagal") ? "text-red-600" : "text-blue-600"}`}>
          {pesan}
        </p>
      )}

      {loading && dataNilai.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Memuat data nilai...</p>
      ) : dataNilai.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Tidak ada nilai ditemukan.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Siswa</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Kelas</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Mata Pelajaran</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Nilai</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataNilai.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{item.siswa.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.siswa.kelas}</td>
                  {editId === item.id ? (
                    <>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={mataPelajaranEdit}
                          onChange={(e) => setMataPelajaranEdit(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          disabled={loading}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="number"
                          value={nilaiEdit}
                          onChange={(e) => setNilaiEdit(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          step="0.01"
                          min="0"
                          max="100"
                          disabled={loading}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.mataPelajaran}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.nilai}</td>
                    </>
                  )}
                  <td className="space-x-2 px-4 py-3 text-sm">
                    {editId === item.id ? (
                      <>
                        <button
                          onClick={() => simpanEdit(item.id)}
                          className="rounded-md bg-green-600 px-3 py-1 text-white transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                          disabled={loading}
                        >
                          Simpan
                        </button>
                        <button
                          onClick={batalkanEdit}
                          className="rounded-md bg-gray-500 px-3 py-1 text-white transition duration-300 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-50"
                          disabled={loading}
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => mulaiEdit(item)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-white transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                        disabled={loading}
                      >
                        Edit
                      </button>
                    )}
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