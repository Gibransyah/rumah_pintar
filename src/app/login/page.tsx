"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Pastikan Link diimport

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Memungkinkan null untuk error
  const [loading, setLoading] = useState(false); // State untuk loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset pesan error
    setLoading(true); // Aktifkan loading

    try {
      const result = await signIn("credentials", {
        redirect: false, // Jangan redirect otomatis
        email,
        password,
      });

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else {
        // Fetch session untuk mendapatkan role pengguna dan redirect berdasarkan role
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        // Redirect berdasarkan role
        if (role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (role === "PENGAJAR") {
          router.push("/dashboard/pengajar");
        } else if (role === "SISWA") {
          router.push("/dashboard/siswa");
        } else {
          // Fallback jika role tidak terdefinisi atau tidak sesuai
          router.push("/");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan jaringan atau server. Mohon coba beberapa saat lagi.");
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
          <p className="mt-2 text-lg text-gray-600">Masuk dan mulai belajar lebih mudah</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="nama@email.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200 ease-in-out disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="••••••••"
              required
              disabled={loading} // Nonaktifkan saat loading
            />
          </div>

          {/* Opsi Lupa Password dan Ingat Saya */}
          <div className="flex items-center justify-between text-sm">
            <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium transition duration-200">
              Lupa password?
            </Link>
            <label className="flex items-center space-x-2 text-gray-700">
              <input type="checkbox" className="form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500" />
              <span>Ingat saya</span>
            </label>
          </div>

          {/* Pesan Error */}
          {error && (
            <p className="text-center text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-200">{error}</p>
          )}

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading} // Nonaktifkan tombol saat loading
          >
            {loading ? "Memuat..." : "Login"}
          </button>
        </form>

        {/* Link Daftar */}
        <p className="mt-8 text-center text-base text-gray-700">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline transition duration-200">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}