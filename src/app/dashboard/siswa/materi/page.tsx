"use client";

import { useEffect, useState } from "react";

interface Materi {
  id: number;
  judul: string;
  deskripsi: string;
  fileUrl: string;
  pengajar: {
    nama: string;
  };
  createdAt: string;
}

export default function MateriSiswaPage() {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await fetch("/api/siswa/materi");
        if (!res.ok) throw new Error("Gagal memuat data materi.");
        const data = await res.json();
        setMateriList(data);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
    fetchMateri();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Materi Pembelajaran</h1>

      {loading && <p>Memuat materi...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && materiList.length === 0 && <p>Tidak ada materi tersedia.</p>}

      <div className="space-y-4">
        {materiList.map((m) => (
          <div key={m.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-xl font-semibold text-gray-800">{m.judul}</h2>
            <p className="text-sm text-gray-600 mb-1">Oleh: {m.pengajar.nama}</p>
            <p className="text-gray-700 mb-2">{m.deskripsi}</p>
            <a
              href={m.fileUrl}
              target="_blank"
              className="text-blue-600 hover:underline"
              rel="noopener noreferrer"
            >
              📄 Lihat / Download Materi
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
