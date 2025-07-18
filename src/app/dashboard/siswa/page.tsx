"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, ClipboardList, Award } from "lucide-react"; // Import ikon

export default function SiswaDashboard() {
  // Data placeholder untuk widget dashboard siswa (bisa di-fetch dari API di masa depan)
  const [totalMateriTersedia, setTotalMateriTersedia] = useState(50);
  const [jadwalHariIni, setJadwalHariIni] = useState(2); // Jumlah kelas hari ini
  const [tugasBelumSelesai, setTugasBelumSelesai] = useState(3);
  const [rataRataNilai, setRataRataNilai] = useState(88.5);

  // Anda bisa menambahkan useEffect di sini untuk fetch data dinamis jika diperlukan
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Contoh fetch data dari API
  //     // const res = await fetch('/api/siswa/dashboard-stats');
  //     // const data = await res.json();
  //     // setTotalMateriTersedia(data.totalMateri);
  //     // setJadwalHariIni(data.jadwalHariIni);
  //     // setTugasBelumSelesai(data.tugasBelumSelesai);
  //     // setRataRataNilai(data.rataRataNilai);
  //   };
  //   // fetchData();
  // }, []);

  return (
    // Div terluar ini hanya mengatur tinggi minimum dan latar belakang.
    // Padding dan pemusatan lebar akan diatur pada div anak (kartu putih).
    <div className="min-h-screen bg-blue-50">
      {/* Kartu utama dashboard: Mengatur lebar maksimum, pemusatan, padding, sudut, dan bayangan */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 lg:p-16 space-y-8 sm:space-y-10">
        {/* Header Dashboard */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-2 leading-tight">
            Selamat datang, Siswa!
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ini adalah ringkasan aktivitas belajar Anda di RUMAH PINTAR.
          </p>
        </div>

        {/* Widget Statistik Siswa */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Widget 1: Total Materi Tersedia */}
          <Link href="/dashboard/siswa/materi" className="block">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center transition duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <BookOpen className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-gray-500">Materi Tersedia</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalMateriTersedia}</p>
            </div>
          </Link>

          {/* Widget 2: Jadwal Hari Ini */}
          <Link href="/dashboard/siswa/jadwal" className="block">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center transition duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Calendar className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-gray-500">Jadwal Hari Ini</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{jadwalHariIni}</p>
            </div>
          </Link>

          {/* Widget 3: Tugas Belum Selesai */}
          <Link href="/dashboard/siswa/tugas" className="block">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center transition duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <ClipboardList className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-gray-500">Tugas Belum Selesai</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{tugasBelumSelesai}</p>
            </div>
          </Link>

          {/* Widget 4: Rata-rata Nilai */}
          <Link href="/dashboard/siswa/nilai" className="block">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center transition duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Award className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-gray-500">Rata-rata Nilai</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{rataRataNilai}</p>
            </div>
          </Link>
        </div>

        {/* Bagian Aksi Cepat / Link Penting */}
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Akses Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/siswa/materi"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <BookOpen className="h-5 w-5 mr-2" /> Lihat Semua Materi
            </Link>
            <Link
              href="/dashboard/siswa/tugas"
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <ClipboardList className="h-5 w-5 mr-2" /> Kumpulkan Tugas
            </Link>
            <Link
              href="/dashboard/siswa/jadwal"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <Calendar className="h-5 w-5 mr-2" /> Lihat Jadwal Lengkap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
