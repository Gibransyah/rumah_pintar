"use client";

import { useState } from "react";
import Link from "next/link"; // Pastikan Link diimport
import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi

// Definisi tipe untuk state form
interface RegisterForm {
  email: string;
  password: string;
  role: "ADMIN" | "PENGAJAR" | "SISWA"; // Pastikan role sesuai dengan opsi
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    role: "SISWA", // Default role siswa
  });

  const [message, setMessage] = useState<string | null>(null); // State untuk pesan feedback
  const [isSuccess, setIsSuccess] = useState(false); // State untuk indikator sukses/gagal
  const [loading, setLoading] = useState(false); // State untuk loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Reset pesan
    setIsSuccess(false); // Reset status sukses
    setLoading(true); // Aktifkan loading

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json(); // Ambil respons JSON dari API

      if (res.ok) {
        setMessage(data.message || "Pendaftaran berhasil! Silakan login.");
        setIsSuccess(true);
        // Opsional: Langsung arahkan ke halaman login setelah berhasil mendaftar
        // setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(data.message || "Pendaftaran gagal. Silakan coba lagi.");
        setIsSuccess(false);
      }
    } catch (err: any) {
      console.error("Register error:", err);
      setMessage(err.message || "Terjadi kesalahan jaringan atau server.");
      setIsSuccess(false);
    } finally {
      setLoading(false); // Nonaktifkan loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6 transform hover:scale-[1.005] transition duration-300 ease-in-out">
        {/* Logo atau Branding */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-700">RUMAH PINTAR</h1>
          <p className="mt-2 text-lg text-gray-600">Daftar akun baru dan mulai belajar!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="nama@email.com"
              className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading} // Nonaktifkan saat loading
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
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading} // Nonaktifkan saat loading
            />
          </div>

          {/* Pilihan Role */}
          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
              Daftar Sebagai
            </label>
            <select
              id="role"
              className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as "ADMIN" | "PENGAJAR" | "SISWA" })}
              disabled={loading} // Nonaktifkan saat loading
            >
              <option value="SISWA">Siswa</option>
              <option value="PENGAJAR">Pengajar</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Pesan Feedback (Sukses/Error) */}
          {message && (
            <p className={`text-center text-sm font-medium p-2 rounded-md border ${isSuccess ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
              {message}
            </p>
          )}

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading} // Nonaktifkan tombol saat loading
          >
            {loading ? "Mendaftar..." : "Daftar Akun"}
          </button>
        </form>

        {/* Link Kembali ke Login */}
        <p className="mt-8 text-center text-base text-gray-700">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline transition duration-200">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}