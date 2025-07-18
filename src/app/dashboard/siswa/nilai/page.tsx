"use client";

import { useEffect, useState } from "react";

interface Nilai {
  id: number;
  mataPelajaran: string;
  nilai: number;
  pengajar: {
    nama: string;
  };
}

export default function NilaiSiswaPage() {
  const [data, setData] = useState<Nilai[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState<string | null>(null);

  useEffect(() => {
    const fetchNilai = async () => {
      try {
        const res = await fetch("/api/siswa/nilai");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Gagal mengambil data nilai.");
        }
        const nilaiData = await res.json();
        setData(nilaiData);
      } catch (err: any) {
        setPesan(err.message || "Gagal memuat nilai.");
      } finally {
        setLoading(false);
      }
    };

    fetchNilai();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Nilai Saya</h1>

      {loading && <p>Memuat nilai...</p>}
      {pesan && <p className="text-red-500">{pesan}</p>}
      {!loading && data.length === 0 && <p>Belum ada nilai.</p>}

      <div className="space-y-4">
        {data.map((n) => (
          <div key={n.id} className="border p-4 rounded bg-white shadow">
            <h2 className="text-xl font-semibold text-gray-800">{n.mataPelajaran}</h2>
            <p className="text-sm text-gray-600">Pengajar: {n.pengajar.nama}</p>
            <p className="text-lg font-bold text-blue-600">Nilai: {n.nilai}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
