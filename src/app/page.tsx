export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="px-6 py-16 lg:flex lg:items-center lg:justify-between lg:px-20">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Cari Bimbel Mudah, <br /> Tanpa Ribet
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Daftar sekarang untuk mengakses materi terbaik dari pengajar
            berpengalaman di seluruh Indonesia.
          </p>
          <div className="mt-6">
            <a
              href="/login"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
            >
              Login
            </a>
            <a
              href="/register"
              className="ml-4 inline-block rounded-lg border border-blue-600 px-6 py-3 text-blue-600 hover:bg-blue-50 transition"
            >
              Register
            </a>
          </div>
        </div>

        <div className="mt-10 lg:mt-0 lg:w-1/2">
          {/* <img
            src="/illustration-hero.svg"
            alt="Landing Illustration"
            className="w-full"
          /> */}
        </div>
      </section>

      {/* Keunggulan */}
      <section className="bg-gray-50 py-12 px-6 lg:px-20">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Mengapa Pilih Kami?
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">Akses Mudah</h3>
            <p className="mt-2 text-gray-600">
              Bisa diakses kapan saja dan di mana saja.
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">Pengajar Profesional</h3>
            <p className="mt-2 text-gray-600">
              Materi diajarkan oleh tutor berpengalaman dan bersertifikat.
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">Progress Terpantau</h3>
            <p className="mt-2 text-gray-600">
              Nilai dan tugas siswa tersimpan dan bisa dilihat kapan pun.
            </p>
          </div>
        </div>
      </section>

      {/* Langkah Mudah */}
      <section className="py-16 px-6 lg:px-20">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
          3 Langkah Mudah Mulai Belajar
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold">Hubungi Admin</h3>
            <p className="text-gray-600">Kami siap bantu kamu mulai belajar.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold">Isi Formulir</h3>
            <p className="text-gray-600">Pendaftaran simpel, langsung aktif.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold">Mulai Belajar</h3>
            <p className="text-gray-600">Akses materi dan tugas dari dashboard.</p>
          </div>
        </div>
      </section>

      {/* Kursus Terbaik */}
      <section className="bg-gray-50 py-16 px-6 lg:px-20">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
          Pilih Kursus Terbaikmu
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img src="/Matematika.jpeg" alt="Matematika" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">Matematika</h3>
              <p className="text-sm text-gray-600">Dasar hingga lanjutan.</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <img src="/Bahasa Indonesia.jpg" alt="Bahasa Indonesia" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">Bahasa Indonesia</h3>
              <p className="text-sm text-gray-600">Literasi dan pemahaman.</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <img src="/IPA.jpeg" alt="IPA" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">IPA</h3>
              <p className="text-sm text-gray-600">Eksperimen dan penalaran ilmiah.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}