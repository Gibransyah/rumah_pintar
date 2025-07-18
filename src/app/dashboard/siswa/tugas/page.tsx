"use client";

import { useEffect, useState } from "react";

interface TugasSiswa {
  id: number;
  fileUrl: string;
  uploadedAt: string;
}

export default function TugasPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [riwayat, setRiwayat] = useState<TugasSiswa[]>([]);

  // Fetch daftar tugas
  const fetchRiwayat = async () => {
    try {
      const res = await fetch("/api/siswa/tugas");
      if (!res.ok) throw new Error("Gagal memuat riwayat tugas");

      const data = await res.json();
      setRiwayat(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setIsLoading(true);

    if (!file) {
      setMessage("Silakan pilih file terlebih dahulu.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("jawaban", file);

    try {
      const res = await fetch("/api/siswa/tugas", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload gagal");

      setMessage("Jawaban berhasil diupload.");
      setFile(null);
      fetchRiwayat(); // Refresh daftar setelah upload
    } catch (err: any) {
      setMessage(err.message || "Terjadi kesalahan saat mengupload.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Upload Jawaban Tugas</h1>

      <form onSubmit={handleUpload} className="space-y-4 rounded-lg bg-white p-6 shadow-md">
        <div>
          <label htmlFor="file-upload" className="mb-2 block text-sm font-medium text-gray-700">
            Pilih File Jawaban
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
            required
            disabled={isLoading}
          />
          {file && <p className="mt-2 text-sm text-gray-500">File terpilih: {file.name}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Mengupload..." : "Upload Jawaban"}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center text-sm ${message.includes("berhasil") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {/* Riwayat tugas */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Riwayat Upload Tugas</h2>
        {riwayat.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada tugas yang diupload.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
            {riwayat.map((item) => (
              <li key={item.id}>
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {item.fileUrl.split("/").pop()}
                </a>{" "}
                <span className="text-gray-500">({new Date(item.uploadedAt).toLocaleString()})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
