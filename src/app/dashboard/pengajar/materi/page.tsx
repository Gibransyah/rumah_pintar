"use client";
import { useEffect, useState } from "react";

// Definisi tipe untuk data Materi
interface Materi {
  id: number;
  judul: string;
  deskripsi: string;
  fileUrl: string;
}

export default function MateriPage() {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  // Fungsi untuk mengambil daftar materi dari API
  const fetchMateri = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pengajar/materi");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal memuat materi.");
      }

      const data: Materi[] = await res.json();
      setMateriList(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat materi.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menangani submit form penambahan materi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null); // Reset error sebelum submit

    if (!judul || !deskripsi || !fileUrl) {
      setError("Semua field wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/pengajar/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, deskripsi, fileUrl }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal mengupload materi.");
      }

      // Reset form setelah berhasil
      setJudul("");
      setDeskripsi("");
      setFileUrl("");
      fetchMateri(); // Muat ulang daftar materi
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan materi.");
    }
  };

  // Fungsi untuk menghapus materi berdasarkan ID
  const handleDelete = async (id: number) => {
    const konfirmasi = confirm("Yakin ingin menghapus materi ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`/api/pengajar/materi/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menghapus materi.");
      }

      setMateriList((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus.");
    }
  };

  useEffect(() => {
    fetchMateri();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Materi Saya</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-5 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-3 text-xl font-semibold text-gray-700">Upload Materi Baru</h2>
        <div>
          <label htmlFor="judul" className="mb-1 block text-sm font-medium text-gray-700">Judul</label>
          <input
            type="text"
            id="judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="deskripsi" className="mb-1 block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="fileUrl" className="mb-1 block text-sm font-medium text-gray-700">URL File Materi</label>
          <input
            type="text"
            id="fileUrl"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://contoh.com/materi.pdf"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Upload Materi
        </button>
      </form>

      {error && (
        <p className="mb-4 text-center text-base font-medium text-red-600">Error: {error}</p>
      )}

      {loading ? (
        <p className="text-center text-lg text-gray-600">Memuat materi...</p>
      ) : materiList.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Tidak ada materi ditemukan.</p>
      ) : (
        <ul className="space-y-4">
          {materiList.map((materi) => (
            <li key={materi.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">{materi.judul}</h2>
              <p className="mb-3 text-gray-700">{materi.deskripsi}</p>
              <a
                href={materi.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4 inline-block text-blue-600 underline hover:text-blue-800"
              >
                Lihat Materi
              </a>
              <button
                onClick={() => handleDelete(materi.id)}
                className="inline-block rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
