export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
      <p className="text-gray-700">Kamu tidak punya izin untuk mengakses halaman ini.</p>
    </div>
  )
}
