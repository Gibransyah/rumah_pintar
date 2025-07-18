"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link untuk navigasi kembali
import toast from "react-hot-toast"; // Import toast untuk notifikasi

// Definisi tipe untuk state form
interface SiswaForm {
  nama: string;
  kelas: string;
  email: string;
  password: string;
}

export default function TambahSiswaPage() {
  const router = useRouter();

  const [form, setForm] = useState<SiswaForm>({
    nama: "",
    kelas: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // State untuk indikator loading
  const [error, setError] = useState<string | null>(null); // State untuk pesan error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setError(null); // Reset error saat input berubah
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Aktifkan loading
    setError(null); // Reset error

    try {
      const res = await fetch("/api/admin/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Siswa berhasil ditambahkan!");
        router.push("/dashboard/admin/siswa"); // Redirect ke daftar siswa
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menambah siswa.");
      }
    } catch (err: any) {
      console.error("Error menambah siswa:", err);
      setError(err.message || "Terjadi kesalahan saat menambah siswa.");
      toast.error(err.message || "Gagal menambah siswa.");
    } finally {
      setLoading(false); // Nonaktifkan loading
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Tambah Siswa Baru</h1>

      {/* Link Kembali */}
      <Link
        href="/dashboard/admin/siswa"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Daftar Siswa
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        {/* Input Nama */}
        <div>
          <label htmlFor="nama" className="mb-1 block text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            placeholder="Contoh: Budi Santoso"
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            value={form.nama}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Input Kelas */}
        <div>
          <label htmlFor="kelas" className="mb-1 block text-sm font-medium text-gray-700">
            Kelas
          </label>
          <input
            type="text"
            id="kelas"
            name="kelas"
            placeholder="Contoh: 10 IPA 1"
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            value={form.kelas}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Input Email */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="siswa@example.com"
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Input Password */}
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Pesan Error */}
        {error && (
          <p className="text-center text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
            {error}
          </p>
        )}

        {/* Tombol Simpan */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading} // Nonaktifkan tombol saat loading
        >
          {loading ? "Menyimpan..." : "Simpan Siswa"}
        </button>
      </form>
    </div>
  );
}