"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Pastikan react-hot-toast sudah terinstal

// Definisi tipe untuk data Pengajar yang dibutuhkan
interface Pengajar {
  id: number;
  nama: string;
  mataPelajaran: string;
}

// Definisi tipe untuk data formulir Jadwal
interface JadwalForm {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string;
  pengajarId: string; // Tetap string untuk input <select>
  kelas: string;
}

export default function FormJadwal() {
  const router = useRouter();

  // State untuk data formulir, dengan nilai awal untuk mode tambah
  const [form, setForm] = useState<JadwalForm>({
    id: 0,
    hari: "",
    jamMulai: "",
    jamSelesai: "",
    mataPelajaran: "",
    pengajarId: "",
    kelas: "",
  });

  // State untuk mengidentifikasi apakah form sedang dalam mode edit
  const [isEditMode, setIsEditMode] = useState(false);
  // State untuk daftar pengajar yang akan diisi di dropdown
  const [pengajarList, setPengajarList] = useState<Pengajar[]>([]);
  // State untuk status loading saat submit atau fetch data
  const [isLoading, setIsLoading] = useState(false);
  // State untuk pesan error
  const [error, setError] = useState<string | null>(null);

  // Efek untuk mengambil daftar pengajar dari API
  useEffect(() => {
    const fetchPengajarList = async () => {
      try {
        const res = await fetch("/api/admin/pengajar"); // Sesuaikan dengan path API pengajar Anda
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal memuat daftar pengajar.");
        }
        const data: Pengajar[] = await res.json();
        setPengajarList(data);
      } catch (err: any) {
        console.error("Error fetching pengajar list:", err);
        toast.error(err.message || "Gagal memuat daftar pengajar.");
      }
    };
    fetchPengajarList();
  }, []);

  // Efek untuk memeriksa apakah ada data jadwal yang disimpan di localStorage untuk mode edit
  useEffect(() => {
    const stored = localStorage.getItem("editJadwal");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Memastikan parsed.pengajarId diubah menjadi string karena input <select> mengharapkan string
        setForm({
          id: parsed.id,
          hari: parsed.hari,
          jamMulai: parsed.jamMulai,
          jamSelesai: parsed.jamSelesai,
          mataPelajaran: parsed.mataPelajaran,
          pengajarId: String(parsed.pengajarId),
          kelas: parsed.kelas,
        });
        setIsEditMode(true);
        localStorage.removeItem("editJadwal"); // Hapus dari localStorage setelah digunakan
      } catch (e) {
        console.error("Gagal parse data editJadwal dari localStorage:", e);
        // Pertimbangkan untuk menampilkan toast error jika parse gagal
        toast.error("Gagal memuat data edit jadwal dari penyimpanan lokal.");
      }
    }
  }, []); // Hanya berjalan sekali saat komponen mount

  // Handler untuk perubahan input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setError(null); // Reset error saat ada perubahan form
  };

  // Handler untuk submit form (Tambah atau Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman

    setIsLoading(true); // Aktifkan loading
    setError(null); // Hapus error sebelumnya

    try {
      // Pastikan pengajarId dikonversi ke number untuk payload API
      const payload = {
        hari: form.hari,
        jamMulai: form.jamMulai,
        jamSelesai: form.jamSelesai,
        mataPelajaran: form.mataPelajaran,
        pengajarId: parseInt(form.pengajarId), // Konversi ke number
        kelas: form.kelas,
      };

      const url = isEditMode ? `/api/jadwal/${form.id}` : "/api/jadwal";
      const method = isEditMode ? "PATCH" : "POST"; // Menggunakan PATCH untuk update

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Gagal ${isEditMode ? "memperbarui" : "menambah"} jadwal.`);
      }

      toast.success(`Jadwal berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`);

      // Reset form setelah berhasil
      setForm({
        id: 0,
        hari: "",
        jamMulai: "",
        jamSelesai: "",
        mataPelajaran: "",
        pengajarId: "",
        kelas: "",
      });
      setIsEditMode(false); // Kembali ke mode tambah setelah update
      router.refresh(); // Refresh data di halaman induk (JadwalPage)
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || `Terjadi kesalahan saat ${isEditMode ? "memperbarui" : "menambah"} jadwal.`);
      toast.error(err.message || `Terjadi kesalahan saat menyimpan jadwal.`);
    } finally {
      setIsLoading(false); // Nonaktifkan loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Input Hari */}
        <div>
          <label htmlFor="hari" className="mb-1 block text-sm font-medium text-gray-700">Hari</label>
          <input
            type="text"
            id="hari"
            name="hari"
            placeholder="Contoh: Senin"
            value={form.hari}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Input Kelas */}
        <div>
          <label htmlFor="kelas" className="mb-1 block text-sm font-medium text-gray-700">Kelas</label>
          <input
            type="text"
            id="kelas"
            name="kelas"
            placeholder="Contoh: 10 IPA 1"
            value={form.kelas}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Input Jam Mulai */}
        <div>
          <label htmlFor="jamMulai" className="mb-1 block text-sm font-medium text-gray-700">Jam Mulai</label>
          <input
            type="time" // Menggunakan type="time" untuk input jam
            id="jamMulai"
            name="jamMulai"
            value={form.jamMulai}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Input Jam Selesai */}
        <div>
          <label htmlFor="jamSelesai" className="mb-1 block text-sm font-medium text-gray-700">Jam Selesai</label>
          <input
            type="time" // Menggunakan type="time" untuk input jam
            id="jamSelesai"
            name="jamSelesai"
            value={form.jamSelesai}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Input Mata Pelajaran */}
        <div>
          <label htmlFor="mataPelajaran" className="mb-1 block text-sm font-medium text-gray-700">Mata Pelajaran</label>
          <input
            type="text"
            id="mataPelajaran"
            name="mataPelajaran"
            placeholder="Contoh: Matematika"
            value={form.mataPelajaran}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Dropdown Pengajar */}
        <div>
          <label htmlFor="pengajarId" className="mb-1 block text-sm font-medium text-gray-700">Pengajar</label>
          <select
            id="pengajarId"
            name="pengajarId"
            value={form.pengajarId}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          >
            <option value="">Pilih Pengajar</option>
            {pengajarList.length === 0 && isLoading ? ( // Tampilkan loading state untuk pengajarList
              <option disabled>Memuat pengajar...</option>
            ) : pengajarList.length === 0 ? (
              <option disabled>Tidak ada pengajar tersedia.</option>
            ) : (
              pengajarList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} ({p.mataPelajaran})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Pesan Error */}
      {error && (
        <p className="text-center text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
          Error: {error}
        </p>
      )}

      {/* Tombol Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading} // Nonaktifkan tombol saat loading
      >
        {isLoading ? (isEditMode ? "Memperbarui..." : "Menambah...") : (isEditMode ? "Update Jadwal" : "Tambah Jadwal")}
      </button>
    </form>
  );
}