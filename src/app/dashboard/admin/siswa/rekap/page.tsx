import { prisma } from "@/lib/db"; // Mengambil instance Prisma Client
import Link from "next/link"; // Untuk navigasi
import { Users, BookOpen, BarChart, Download } from "lucide-react"; // Ikon yang relevan

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

export default async function RekapSiswaPage() {
  // --- Data Fetching (Server-side) ---
  const totalSiswa = await prisma.siswa.count(); // Menghitung total siswa

  // Menghitung jumlah siswa per kelas
  const siswaPerKelas = await prisma.siswa.groupBy({
    by: ["kelas"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc", // Urutkan dari kelas dengan siswa terbanyak
      },
    },
  });

  const totalKelasAktif = siswaPerKelas.length; // Jumlah kelas yang memiliki siswa

  // --- Render Komponen ---
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Rekap Data Siswa</h1>

      {/* Link Kembali */}
      <Link
        href="/dashboard/admin/siswa"
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
        Kembali ke Daftar Siswa
      </Link>

      {/* Tombol Aksi: Download Rekap */}
      <div className="mb-8 flex justify-end">
        <Link // Menggunakan Link karena ini akan mengarah ke API route GET file
          href="/api/admin/siswa/rekap/download" // Asumsikan ada API route untuk download rekap
          className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 text-white font-semibold shadow-md transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Rekap Excel
        </Link>
      </div>

      {/* Bagian Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Widget: Total Siswa */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4">
          <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Siswa Terdaftar</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totalSiswa}</p>
          </div>
        </div>

        {/* Widget: Total Kelas Aktif */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4">
          <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Jumlah Kelas Aktif</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totalKelasAktif}</p>
          </div>
        </div>

        {/* Widget: Rata-rata Nilai (Placeholder) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4">
          <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600">
            <BarChart className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Rata-rata Nilai Global</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">--,--</p>{" "}
            {/* Perlu fetch nilai & kalkulasi */}
          </div>
        </div>
      </div>

      {/* Bagian Detail Rekap Per Kelas / Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Kartu: Siswa per Kelas */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Siswa per Kelas</h2>
          {siswaPerKelas.length === 0 ? (
            <p className="text-gray-600 text-center">Tidak ada data kelas.</p>
          ) : (
            <ul className="space-y-3">
              {siswaPerKelas.map((kelasData, index) => (
                <li
                  key={kelasData.kelas}
                  className={`${getWidgetBgColor(
                    index
                  )} p-4 rounded-lg shadow-sm flex justify-between items-center`}
                >
                  <span className="font-semibold text-lg">{kelasData.kelas}</span>
                  <span className="text-2xl font-bold">{kelasData._count.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Kartu: Placeholder untuk Grafik (misal: Distribusi Gender atau Tren Pendaftaran) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-center items-center text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Grafik Distribusi Siswa
          </h2>
          <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
            {/* Placeholder untuk chart, butuh library chart (misal: Recharts, Chart.js) */}
            <p>Area Grafik (Client Component)</p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Anda dapat menambahkan visualisasi data di sini (misalnya, jumlah siswa
            berdasarkan jenis kelamin atau tren pendaftaran). Ini memerlukan
            komponen klien.
          </p>
        </div>
      </div>
    </div>
  );
}