"use client";

import { useEffect, useState } from "react";
import { Users, CalendarDays, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [pengajar] = useState(45);
  const [kelasHariIni] = useState(28);
  const [kehadiran] = useState(92);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl bg-blue-600 text-white p-6">
          <h2 className="text-lg font-medium mb-2">Selamat Datang!</h2>
          <p>Sistem Manajemen Bimbel</p>
        </div>
        <div className="rounded-xl bg-green-500 text-white p-6">
          <h2 className="text-lg font-medium mb-2">{kelasHariIni}</h2>
          <p>Kelas Hari Ini</p>
        </div>
        <div className="rounded-xl bg-purple-500 text-white p-6">
          <h2 className="text-lg font-medium mb-2">{kehadiran}%</h2>
          <p>Tingkat Kehadiran</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl bg-white shadow p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Pengajar</p>
            <Users className="text-blue-600 w-5 h-5" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-800">{pengajar}</p>
          <p className="text-sm text-gray-500">+3 pengajar aktif</p>
        </div>
        <div className="rounded-xl bg-white shadow p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Kelas Hari Ini</p>
            <CalendarDays className="text-green-500 w-5 h-5" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-800">{kelasHariIni}</p>
          <p className="text-sm text-gray-500">15 kelas selesai</p>
        </div>
        <div className="rounded-xl bg-white shadow p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Tingkat Kehadiran</p>
            <TrendingUp className="text-purple-600 w-5 h-5" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-800">{kehadiran}%</p>
          <p className="text-sm text-gray-500">+5% dari bulan lalu</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Jadwal Hari Ini</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 p-4 rounded-xl">
            <h3 className="font-medium text-gray-800">Matematika <span className="ml-2 inline-block bg-black text-white text-xs px-2 py-1 rounded-full">Berlangsung</span></h3>
            <p className="text-sm text-gray-600">08:00 - 10:00 • Dr. Ahmad • XII IPA</p>
            <p className="text-sm text-gray-600">Ruangan: R101</p>
          </div>
        </div>
      </div>
    </div>
  );
}
