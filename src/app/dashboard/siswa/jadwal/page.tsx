"use client";

import { useEffect, useState } from "react";

// Tipe data untuk jadwal siswa
interface Jadwal {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string;
  kelas: string;
  pengajar: {
    user: {
      name: string;
    };
  };
}

export default function JadwalSiswaPage() {
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState<string | null>(null); // Untuk pesan error atau info

  // Efek untuk memuat data jadwal saat komponen pertama kali dirender
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await fetch("/api/siswa/jadwal");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengambil jadwal.");
        }

        setJadwalList(data);
      } catch (err: any) {
        setPesan(err.message || "Terjadi kesalahan saat memuat jadwal.");
      } finally {
        setLoading(false); // Nonaktifkan loading setelah fetch selesai (berhasil/gagal)
      }
    };

    fetchJadwal();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-blue-700">Jadwal Saya</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Memuat jadwal...</p>
      ) : pesan ? (
        <p className="text-center text-lg text-red-600">{pesan}</p>
      ) : jadwalList.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Belum ada jadwal ditemukan.</p>
      ) : (
        <div className="space-y-4">
          {jadwalList.map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-2 text-xl font-semibold text-gray-800">{item.mataPelajaran}</p>
              <p className="text-base text-gray-700">
                <span className="font-medium">Hari:</span> {item.hari},{" "}
                <span className="font-medium">Jam:</span> {item.jamMulai} - {item.jamSelesai}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-medium">Kelas:</span> {item.kelas}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-medium">Pengajar:</span> {item.pengajar.user.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}