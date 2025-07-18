"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link untuk navigasi
import toast from "react-hot-toast"; // Import toast untuk notifikasi
import { Edit } from "lucide-react"; // Import ikon Edit

// Tipe data untuk Siswa
interface Siswa {
  id: number;
  nama: string;
  kelas: string;
}

// Tipe data untuk Nilai yang diterima dari API
interface Nilai {
  id: number;
  siswa: {
    nama: string;
    kelas: string;
  };
  mataPelajaran: string;
  nilai: number;
}

export default function InputNilaiPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [nilaiList, setNilaiList] = useState<Nilai[]>([]);
  const [selectedSiswaId, setSelectedSiswaId] = useState("");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [nilai, setNilai] = useState(""); // Nilai sebagai string karena input type="number"
  const [loading, setLoading] = useState(false); // Untuk submit form
  const [loadingData, setLoadingData] = useState(true); // Untuk loading awal data
  const [pesan, setPesan] = useState<string | null>(null);

  // Efek untuk mengambil daftar siswa dan nilai saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true); // Aktifkan loading data
      setPesan(null); // Reset pesan

      try {
        const [siswaRes, nilaiRes] = await Promise.all([
          fetch("/api/pengajar/siswa"), // Endpoint untuk daftar siswa
          fetch("/api/pengajar/nilai"), // Endpoint untuk daftar nilai milik pengajar
        ]);

        if (!siswaRes.ok || !nilaiRes.ok) {
          const siswaError = await siswaRes.json().catch(() => ({ message: "Siswa fetch failed." }));
          const nilaiError = await nilaiRes.json().catch(() => ({ message: "Nilai fetch failed." }));
          throw new Error(siswaError.message || nilaiError.message || "Gagal mengambil data.");
        }

        const siswaData: Siswa[] = await siswaRes.json();
        const nilaiData: Nilai[] = await nilaiRes.json();

        setSiswaList(siswaData);
        setNilaiList(nilaiData);
      } catch (err: any) {
        console.error("Gagal memuat data:", err);
        setPesan(err.message || "Gagal memuat data.");
        toast.error(err.message || "Gagal memuat data awal.");
      } finally {
        setLoadingData(false); // Nonaktifkan loading data
      }
    };
    fetchData();
  }, []);

  // Handler saat form input nilai disubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form dasar
    if (!selectedSiswaId || !mataPelajaran || !nilai) {
      setPesan("Semua field wajib diisi.");
      toast.error("Semua field wajib diisi.");
      return;
    }

    setLoading(true); // Aktifkan loading submit
    setPesan(null); // Reset pesan

    try {
      const res = await fetch("/api/pengajar/nilai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siswaId: parseInt(selectedSiswaId), // Konversi siswaId ke integer
          mataPelajaran,
          nilai: parseFloat(nilai), // Konversi nilai ke float
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal menyimpan nilai.");
      }

      setPesan("Nilai berhasil disimpan.");
      toast.success("Nilai berhasil disimpan!");
      // Reset form setelah berhasil
      setSelectedSiswaId("");
      setMataPelajaran("");
      setNilai("");

      // Refresh daftar nilai yang ditampilkan setelah penambahan
      const updatedNilaiRes = await fetch("/api/pengajar/nilai");
      const updatedNilai: Nilai[] = await updatedNilaiRes.json();
      setNilaiList(updatedNilai);
    } catch (err: any) {
      setPesan(err.message || "Terjadi kesalahan saat menyimpan nilai.");
      toast.error(err.message || "Terjadi kesalahan saat menyimpan nilai.");
    } finally {
      setLoading(false); // Nonaktifkan loading submit
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Input Nilai Siswa</h1>

      {/* Formulir Input Nilai */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-5 rounded-lg bg-white p-6 shadow-md border border-gray-100">
        <h2 className="mb-3 text-2xl font-semibold text-gray-700">Form Input Nilai</h2>
        {/* Pilih Siswa */}
        <div>
          <label htmlFor="siswa" className="mb-1 block text-sm font-medium text-gray-700">Pilih Siswa</label>
          <select
            id="siswa"
            value={selectedSiswaId}
            onChange={(e) => setSelectedSiswaId(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={loading || loadingData} // Nonaktifkan saat loading submit atau loading data awal
          >
            <option value="">-- Pilih Siswa --</option>
            {loadingData ? (
              <option disabled>Memuat daftar siswa...</option>
            ) : siswaList.length === 0 ? (
              <option disabled>Tidak ada siswa ditemukan.</option>
            ) : (
              siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} - {s.kelas}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Mata Pelajaran */}
        <div>
          <label htmlFor="mapel" className="mb-1 block text-sm font-medium text-gray-700">Mata Pelajaran</label>
          <input
            type="text"
            id="mapel"
            value={mataPelajaran}
            onChange={(e) => setMataPelajaran(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            placeholder="Contoh: Matematika"
            required
            disabled={loading} // Nonaktifkan saat loading submit
          />
        </div>

        {/* Nilai */}
        <div>
          <label htmlFor="nilai" className="mb-1 block text-sm font-medium text-gray-700">Nilai</label>
          <input
            type="number"
            id="nilai"
            value={nilai}
            onChange={(e) => setNilai(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            step="0.01" // Memungkinkan nilai desimal
            min="0" // Nilai minimum
            max="100" // Nilai maksimum
            required
            disabled={loading} // Nonaktifkan saat loading submit
          />
          {/* Tombol Edit Nilai */}
          <div className="mt-4 text-right">
            <Link
              href="/dashboard/pengajar/nilai/edit"
              className="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-white font-medium transition duration-300 ease-in-out hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              <Edit className="h-4 w-4 mr-2" /> Edit Nilai
            </Link>
          </div>
        </div>

        {/* Area Pesan Feedback (Sukses/Error) */}
        {pesan && (
          <p className={`mt-2 text-center text-sm font-medium p-2 rounded-md border ${pesan.includes("berhasil") ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"}`}>
            {pesan}
          </p>
        )}

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading} // Nonaktifkan tombol saat loading submit
          className="w-full rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Nilai"}
        </button>
      </form>

      {/* Daftar Nilai yang Sudah Dimasukkan */}
      <div className="rounded-md bg-white p-4 shadow-md border border-gray-100">
        <h2 className="mb-3 text-2xl font-semibold text-gray-700">Daftar Nilai Saya</h2>
        {loadingData && nilaiList.length === 0 ? ( // Menampilkan loading awal data
          <p className="text-sm text-gray-600 text-center">Memuat daftar nilai...</p>
        ) : nilaiList.length === 0 ? (
          <p className="text-sm text-gray-600 text-center">Belum ada nilai yang dimasukkan.</p>
        ) : (
          <ul className="divide-y divide-gray-200 text-sm">
            {nilaiList.map((n) => (
              <li key={n.id} className="flex flex-wrap justify-between py-2">
                <div>
                  <span className="font-medium text-gray-800">{n.siswa.nama}</span>{" "}
                  <span className="text-gray-600">({n.siswa.kelas})</span>
                </div>
                <div>
                  <span className="text-gray-700">{n.mataPelajaran}: </span>
                  <span className="font-semibold text-blue-700">{n.nilai}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}