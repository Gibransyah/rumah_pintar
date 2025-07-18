"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link untuk navigasi kembali
import toast from "react-hot-toast"; // Import toast untuk notifikasi

export default function UploadSiswaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // State untuk indikator loading
  const [message, setMessage] = useState<string | null>(null); // State untuk pesan feedback
  const [isError, setIsError] = useState(false); // State untuk indikator error/sukses

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(null); // Reset pesan
    setIsError(false); // Reset status error
    setIsLoading(true); // Aktifkan loading

    if (!file) {
      setMessage("Silakan pilih file terlebih dahulu.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    // Validasi tipe file
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "xlsx" && fileExtension !== "xls") {
      setMessage("Tipe file tidak didukung. Harap unggah file Excel (.xlsx atau .xls).");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Nama field harus 'file' sesuai API

    try {
      const res = await fetch("/api/admin/siswa/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json(); // Ambil respons JSON dari API

      if (res.ok) {
        setMessage(data.message || "Upload berhasil!");
        setIsError(false);
        setFile(null); // Reset file input
        toast.success(data.message || "Upload berhasil!");
      } else {
        setMessage(data.message || "Upload gagal. Terjadi kesalahan.");
        setIsError(true);
        toast.error(data.message || "Upload gagal.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setMessage(err.message || "Terjadi kesalahan jaringan atau server.");
      setIsError(true);
      toast.error(err.message || "Upload gagal.");
    } finally {
      setIsLoading(false); // Nonaktifkan loading
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Upload Data Siswa</h1>

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

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <p className="text-gray-600 mb-4">
          Unggah file Excel (.xlsx atau .xls) yang berisi daftar siswa baru.
          Pastikan format kolom sesuai: **Nama, Kelas, Email, Password**.
        </p>
        
        {/* Input File */}
        <div>
          <label htmlFor="file-upload" className="mb-2 block text-sm font-medium text-gray-700">
            Pilih File Excel
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls" // Hanya menerima file Excel
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
            required
            disabled={isLoading} // Nonaktifkan input saat loading
          />
          {file && <p className="mt-2 text-sm text-gray-500">File terpilih: {file.name}</p>}
        </div>

        {/* Area Pesan Feedback */}
        {message && (
          <p className={`mt-4 text-center text-sm font-medium p-2 rounded-md border ${isError ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-600 bg-green-50 border-green-200'}`}>
            {message}
          </p>
        )}

        {/* Tombol Upload */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading} // Nonaktifkan tombol saat loading
        >
          {isLoading ? "Mengupload..." : "Upload Data Siswa"}
        </button>
      </form>
    </div>
  );
}