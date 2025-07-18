"use client"

export default function HapusSiswaButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (confirm("Yakin ingin menghapus siswa ini?")) {
      const res = await fetch(`/api/admin/siswa/${id}`, { method: "DELETE" })
      if (res.ok) {
        location.reload()
      } else {
        alert("Gagal menghapus siswa")
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline ml-2"
    >
      Hapus
    </button>
  )
}
