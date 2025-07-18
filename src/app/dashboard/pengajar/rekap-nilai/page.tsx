"use client";

import { useEffect, useState } from "react";
import ExcelJS from "exceljs"; // Import ExcelJS for creating Excel files
import { saveAs } from "file-saver"; // Import saveAs for downloading files

// Define the structure for your Rekap data
interface Rekap {
  nama: string;
  kelas: string;
  nilai: {
    mataPelajaran: string;
    nilai: number;
  }[];
  rataRata: number;
}

export default function RekapNilaiPage() {
  const [rekapList, setRekapList] = useState<Rekap[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState<string | null>(null); // For messages (e.g., error, info)

  // Effect hook to fetch recap data when the component mounts
  useEffect(() => {
    const fetchRekap = async () => {
      try {
        const res = await fetch("/api/pengajar/rekap-nilai");

        if (!res.ok) {
          // If the response is not successful, try to get error data from the body
          const errData = await res.json();
          throw new Error(errData.message || "Gagal memuat data rekap.");
        }

        const data: Rekap[] = await res.json();
        setRekapList(data);
      } catch (err: any) {
        console.error("Error fetching rekap:", err);
        setPesan(err.message || "Gagal memuat data rekap.");
      } finally {
        setLoading(false); // Always set loading to false after the fetch operation
      }
    };

    fetchRekap(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on component mount

  // Function to export the rekap data to an Excel file
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Rekap Nilai"); // Add a worksheet named "Rekap Nilai"

    // Define columns for the Excel sheet
    sheet.columns = [
      { header: "Nama Siswa", key: "nama", width: 25 },
      { header: "Kelas", key: "kelas", width: 15 },
      { header: "Mata Pelajaran", key: "mapel", width: 25 },
      { header: "Nilai", key: "nilai", width: 10 },
      { header: "Rata-rata", key: "rata", width: 15 },
    ];

    // Add rows to the Excel sheet
    rekapList.forEach((rekap) => {
      // For each student, add their individual subject scores
      rekap.nilai.forEach((n, i) => {
        sheet.addRow({
          // Only add student's name, class, and overall average on the first row for them
          nama: i === 0 ? rekap.nama : "",
          kelas: i === 0 ? rekap.kelas : "",
          mapel: n.mataPelajaran,
          nilai: n.nilai,
          rata: i === 0 ? rekap.rataRata : "",
        });
      });
      // Add an empty row for separation between students (optional, but good for readability)
      sheet.addRow({});
    });

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    // Create a Blob from the buffer with the correct MIME type
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // Save the Blob as an Excel file
    saveAs(blob, "rekap-nilai.xlsx");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Rekap Nilai Siswa</h1>

      {/* Button to download the Excel report */}
      <button
        onClick={exportToExcel}
        className="mb-6 rounded-md bg-green-600 px-6 py-3 text-white shadow-md transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Download Rekap Excel
      </button>

      {/* Display messages (e.g., errors or info) */}
      {pesan && (
        <p className="mb-4 text-center text-base font-medium text-red-600">{pesan}</p>
      )}

      {/* Conditional rendering based on loading state and data availability */}
      {loading ? (
        <p className="text-center text-lg text-gray-600">Memuat data...</p>
      ) : rekapList.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Belum ada data nilai yang direkap.</p>
      ) : (
        <div className="space-y-6">
          {rekapList.map((rekap, index) => (
            <div
              key={index} // Using index as key is okay here if items don't change order or get added/removed frequently
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-md"
            >
              <h2 className="mb-3 text-2xl font-semibold text-gray-800">
                {rekap.nama} ({rekap.kelas})
              </h2>
              <h3 className="mb-2 text-lg font-medium text-gray-700">Detail Nilai:</h3>
              <ul className="mb-3 list-disc space-y-1 pl-6 text-gray-700">
                {rekap.nilai.map((n, idx) => (
                  <li key={idx}>
                    {n.mataPelajaran}: <span className="font-semibold text-blue-700">{n.nilai}</span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-gray-200 pt-3 text-lg font-bold text-blue-800">
                Rata-rata Nilai: <span className="text-xl">{rekap.rataRata}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}