import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditForm from './form'; // Asumsi 'form' adalah komponen client untuk form edit

interface EditPengajarPageProps {
  params: {
    id: string; // ID pengajar dari URL
  };
}

export default async function EditPengajarPage({ params }: EditPengajarPageProps) {
  // Ambil ID pengajar dari params dan ubah ke number.
  const pengajarId = Number(params.id);

  // Validasi ID. Jika bukan angka, langsung anggap tidak ditemukan.
  // Meskipun `notFound()` di bawah akan menangani ini jika prisma tidak menemukan,
  // validasi eksplisit di awal bisa lebih jelas.
  if (isNaN(pengajarId)) {
    notFound();
  }

  // Cari data pengajar berdasarkan ID, termasuk data user terkait.
  // Ini adalah operasi server-side.
  const pengajar = await prisma.pengajar.findUnique({
    where: { id: pengajarId },
    include: { user: true },
  });

  // Jika pengajar tidak ditemukan di database, tampilkan halaman 404 Next.js.
  if (!pengajar) {
    notFound();
  }

  // Render komponen. Data pengajar yang ditemukan akan diteruskan ke komponen EditForm.
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Edit Data Pengajar</h1>
      <p className="mb-4 text-gray-600">Perbarui informasi pengajar di bawah ini.</p>
      <EditForm pengajar={pengajar} />
    </div>
  );
}