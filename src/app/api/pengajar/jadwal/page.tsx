"use client";

import { useEffect, useState } from "react";

export default function JadwalPengajarPage() {
  const [jadwal, setJadwal] = useState<any[]>([]);

  useEffect(() => {
    const fetchJadwal = async () => {
      const res = await fetch("/api/pengajar/jadwal");
      const data = await res.json();
      setJadwal(data);
    };

    fetchJadwal();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Jadwal Mengajar Saya</h1>
      {jadwal.length === 0 ? (
        <p>Tidak ada jadwal ditemukan.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Hari</th>
              <th className="px-4 py-2 text-left">Jam</th>
              <th className="px-4 py-2 text-left">Mata Pelajaran</th>
              <th className="px-4 py-2 text-left">Kelas</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.hari}</td>
                <td className="px-4 py-2">
                  {item.jamMulai} - {item.jamSelesai}
                </td>
                <td className="px-4 py-2">{item.mataPelajaran}</td>
                <td className="px-4 py-2">{item.kelas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
