import { prisma } from "@/lib/db"; // Mengambil instance Prisma Client
import Link from "next/link"; // Untuk navigasi
import { Users, BookOpen, BarChart, Download, GraduationCap } from "lucide-react"; // Ikon yang relevan

// Fungsi helper untuk mendapatkan warna latar belakang berdasarkan indeks
const getWidgetBgColor = (index: number) => {
  const colors = [
    "bg-blue-50 border-blue-100 text-blue-700",
    "bg-green-50 border-green-100 text-green-700",
    "bg-purple-50 border-purple-100 text-purple-700",
    "bg-yellow-50 border-yellow-100 text-yellow-700",
    "bg-indigo-50 border-indigo-100 text-indigo-700",
  ];
  return colors[index % colors.length];
};

export default async function RekapPengajarPage() {
  // --- Data Fetching (Server-side) ---
  const totalPengajar = await prisma.pengajar.count(); // Menghitung total pengajar

  // Menghitung jumlah pengajar per mata pelajaran
  const pengajarPerMataPelajaran = await prisma.pengajar.groupBy({
    by: ["mataPelajaran"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc", // Urutkan dari mata pelajaran dengan pengajar terbanyak
      },
    },
  });

  const totalMataPelajaranDiajarkan = pengajarPerMataPelajaran.length; // Jumlah mata pelajaran unik

  // --- Render Komponen ---
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Rekap Data Pengajar</h1>

      {/* Link Kembali */}
      <Link
        href="/dashboard/admin/pengajar"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Daftar Pengajar
      </Link>

      {/* Tombol Aksi: Download Rekap */}
      <div className="mb-8 flex justify-end">
        <Link // Menggunakan Link karena ini akan mengarah ke API route GET file
          href="/api/admin/pengajar/rekap/download" // Asumsikan ada API route untuk download rekap
          className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 text-white font-semibold shadow-md transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Rekap Excel
        </Link>
      </div>

      {/* Bagian Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Widget: Total Pengajar */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4">
          <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pengajar Terdaftar</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totalPengajar}</p>
          </div>
        </div>

        {/* Widget: Jumlah Mata Pelajaran Diajarkan */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4">
          <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Jumlah Mata Pelajaran</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totalMataPelajaranDiajarkan}</p>
          </div>
        </div>

        {/* Widget: Rata-rata Pengajar per Mapel (Placeholder) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4">
          <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600">
            <BarChart className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Rata-rata Pengajar/Mapel</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {totalMataPelajaranDiajarkan > 0
                ? (totalPengajar / totalMataPelajaranDiajarkan).toFixed(1)
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Bagian Detail Rekap Per Mata Pelajaran / Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Kartu: Pengajar per Mata Pelajaran */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pengajar per Mata Pelajaran</h2>
          {pengajarPerMataPelajaran.length === 0 ? (
            <p className="text-gray-600 text-center">Tidak ada data mata pelajaran.</p>
          ) : (
            <ul className="space-y-3">
              {pengajarPerMataPelajaran.map((mapelData, index) => (
                <li
                  key={mapelData.mataPelajaran}
                  className={`${getWidgetBgColor(
                    index
                  )} p-4 rounded-lg shadow-sm flex justify-between items-center`}
                >
                  <span className="font-semibold text-lg">{mapelData.mataPelajaran}</span>
                  <span className="text-2xl font-bold">{mapelData._count.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Kartu: Placeholder untuk Grafik (misal: Distribusi Pengajar) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-center items-center text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Grafik Distribusi Pengajar
          </h2>
          <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
            {/* Placeholder untuk chart, butuh library chart (misal: Recharts, Chart.js) */}
            <p>Area Grafik (Client Component)</p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Anda dapat menambahkan visualisasi data di sini (misalnya, jumlah pengajar
            berdasarkan mata pelajaran atau tren pendaftaran pengajar). Ini memerlukan
            komponen klien.
          </p>
        </div>
      </div>
    </div>
  );
}