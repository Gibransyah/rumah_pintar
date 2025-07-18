"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link untuk navigasi kembali
import toast from "react-hot-toast"; // Import toast untuk notifikasi

// Definisi tipe untuk state form
interface PengajarForm {
  nama: string;
  email: string;
  password: string;
  mataPelajaran: string;
}

export default function TambahPengajarPage() {
  const router = useRouter();

  // State untuk menyimpan nilai input formulir
  const [form, setForm] = useState<PengajarForm>({
    nama: "",
    email: "",
    password: "",
    mataPelajaran: "",
  });

  // State untuk mengelola status pengiriman (loading)
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State untuk pesan error (jika ada)
  const [error, setError] = useState<string | null>(null);

  // Handler untuk perubahan input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setError(null); // Reset error saat input berubah
  };

  // Handler untuk submit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Mencegah refresh halaman default

    setIsSubmitting(true); // Set status submit menjadi true
    setError(null); // Hapus error sebelumnya

    try {
      const res = await fetch("/api/admin/pengajar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        // Jika respons berhasil (status 200 OK), tampilkan notifikasi sukses dan navigasi
        toast.success("Pengajar berhasil ditambahkan!");
        router.push("/dashboard/admin/pengajar"); // Arahkan ke daftar pengajar
      } else {
        // Jika respons gagal, coba ambil pesan error dari body respons
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menambahkan pengajar. Silakan coba lagi.");
      }
    } catch (err: any) {
      // Tangani error yang terjadi selama fetch atau parsing respons
      console.error("Error saat menambahkan pengajar:", err);
      setError(err.message); // Set pesan error untuk ditampilkan kepada pengguna
      toast.error(err.message || "Gagal menambahkan pengajar."); // Tampilkan toast error
    } finally {
      setIsSubmitting(false); // Set status submit kembali menjadi false setelah selesai
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Tambah Pengajar Baru</h1>

      {/* Link Kembali */}
      <Link
        href="/dashboard/admin/pengajar"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Daftar Pengajar
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        {/* Input Nama */}
        <div>
          <label htmlFor="nama" className="mb-1 block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            type="text"
            id="nama"
            name="nama"
            placeholder="Contoh: Budi Santoso"
            value={form.nama}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isSubmitting} // Nonaktifkan input saat submit
          />
        </div>

        {/* Input Email */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email" // Gunakan tipe email untuk validasi dasar browser
            id="email"
            name="email"
            placeholder="pengajar@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Input Password */}
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            required
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        {/* Pesan Error */}
        {error && (
          <p className="text-center text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
            Error: {error}
          </p>
        )}

        {/* Tombol Simpan */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting} // Nonaktifkan tombol saat submit
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Pengajar'}
        </button>
      </form>
    </div>
  );
}