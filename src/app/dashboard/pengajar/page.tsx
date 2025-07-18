"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast"; // Pastikan react-hot-toast terinstal
import { BookOpen, Users, Award, CalendarClock, LogOut } from "lucide-react"; // Import ikon

interface JadwalReminder {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string;
  kelas: string;
}

export default function PengajarDashboard() {
  const [pengingat, setPengingat] = useState<JadwalReminder[]>([]);
  const [loadingReminder, setLoadingReminder] = useState(true);

  // Data placeholder untuk widget dashboard pengajar (bisa di-fetch dari API di masa depan)
  const totalMateri = 35;
  const totalSiswaDiajar = 120;
  const rataRataNilai = 85.2;

  // Efek untuk memuat pengingat jadwal
  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const res = await fetch("/api/pengajar/jadwal/reminder");
        if (!res.ok) {
          console.error("Gagal memuat pengingat jadwal:", res.status);
          throw new Error("Gagal memuat pengingat jadwal.");
        }

        const data: JadwalReminder[] = await res.json();
        setPengingat(data);

        if (data.length > 0) {
          data.forEach((item) => {
            toast(
              `🔔 Jadwal Anda: ${item.mataPelajaran} - ${item.kelas} pukul ${item.jamMulai}`,
              {
                duration: 7000,
                style: {
                  background: "#fef3c7",
                  color: "#92400e",
                },
                icon: "⏰",
              }
            );
          });
        }
      } catch (error) {
        console.error("Error memuat pengingat jadwal:", error);
      } finally {
        setLoadingReminder(false);
      }
    };

    fetchReminder();
  }, []);

  return (
    // Hapus padding global di sini. Biarkan DashboardLayout yang mengatur padding.
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 lg:p-16 space-y-8 sm:space-y-10">
        {/* Header Dashboard */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-2 leading-tight">
            Selamat datang, Pengajar!
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Berikut adalah ringkasan aktivitas mengajar Anda.
          </p>
        </div>

        {/* Notifikasi Pengingat Jadwal */}
        <div className="mb-6 rounded-xl bg-white shadow-md p-6 border border-gray-100">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            <CalendarClock className="inline-block h-6 w-6 mr-2 text-blue-600" />
            Pengingat Jadwal Mengajar
          </h2>
          {loadingReminder ? (
            <p className="text-gray-500 text-sm text-center">Memeriksa jadwal Anda...</p>
          ) : pengingat.length > 0 ? (
            <div className="rounded border-l-4 border-yellow-400 bg-yellow-50 p-4 shadow-sm">
              <h3 className="mb-2 font-semibold text-yellow-800 flex items-center">
                <span className="mr-2">🔔</span> Jadwal yang akan segera dimulai:
              </h3>
              <ul className="list-disc list-inside text-sm text-yellow-900 space-y-1">
                {pengingat.map((item) => (
                  <li key={item.id}>
                    <span className="font-medium">{item.mataPelajaran}</span>{" "}
                    - {item.kelas} ({item.jamMulai} - {item.jamSelesai})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="rounded bg-green-50 p-3 text-sm text-green-700 border border-green-300">
              Tidak ada jadwal mengajar dalam 1 jam ke depan. 🎉
            </p>
          )}
        </div>

        {/* Widget Statistik Pengajar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Widget 1: Total Materi Diupload */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4 transition duration-300 hover:scale-[1.03] hover:shadow-xl">
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Materi Diupload</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalMateri}</p>
            </div>
          </div>

          {/* Widget 2: Total Siswa Diajar */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4 transition duration-300 hover:scale-[1.03] hover:shadow-xl">
            <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Siswa Diajar</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalSiswaDiajar}</p>
            </div>
          </div>

          {/* Widget 3: Rata-rata Nilai Siswa (Anda) */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4 transition duration-300 hover:scale-[1.03] hover:shadow-xl">
            <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rata-rata Nilai Siswa</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{rataRataNilai}</p>
            </div>
          </div>
        </div>

        
        {/* <div className="pt-8 sm:pt-10 text-center">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg bg-red-500 px-8 py-3 sm:py-4 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
          >
            <LogOut className="h-6 w-6 inline-block mr-2" />
            Logout
          </button>
        </div> */}
      </div>
    </div>
  );
}