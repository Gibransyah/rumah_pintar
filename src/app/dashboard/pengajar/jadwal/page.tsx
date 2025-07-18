"use client";

import { useEffect, useState } from "react";

interface JadwalItem {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string;
  kelas: string;
}

export default function JadwalPengajarPage() {
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await fetch("/api/pengajar/jadwal");

        if (!res.ok) {
          const text = await res.text();
          let message = "Gagal memuat jadwal.";

          try {
            const json = JSON.parse(text);
            message = json.message || message;
          } catch {
            message = text;
          }

          throw new Error(message);
        }

        const data: JadwalItem[] = await res.json();
        setJadwal(data);
      } catch (err: any) {
        console.error("Failed to load schedule:", err);
        setError(err.message || "Terjadi kesalahan saat memuat jadwal.");
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Jadwal Mengajar Saya</h1>

      {loading ? (
        <p className="text-lg text-gray-700 text-center">Memuat data jadwal...</p>
      ) : error ? (
        <p className="text-lg text-red-600 text-center">Error: {error}</p>
      ) : jadwal.length === 0 ? (
        <p className="text-lg text-gray-600 text-center">
          Tidak ada jadwal mengajar ditemukan untuk Anda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Hari
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Jam
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Mata Pelajaran
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Kelas
                </th>
              </tr>
            </thead>
            <tbody>
              {jadwal.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{item.hari}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.jamMulai} - {item.jamSelesai}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.mataPelajaran}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.kelas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
