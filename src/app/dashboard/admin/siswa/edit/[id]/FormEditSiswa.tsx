"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function FormEditSiswa({ siswa }: { siswa: any }) {
  const router = useRouter()
  const [form, setForm] = useState({
    nama: siswa.nama,
    kelas: siswa.kelas,
    email: siswa.user.email,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`/api/admin/siswa/${siswa.id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      router.push("/dashboard/admin/siswa")
    } else {
      alert("Gagal mengedit siswa")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        value={form.nama}
        onChange={(e) => setForm({ ...form, nama: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        value={form.kelas}
        onChange={(e) => setForm({ ...form, kelas: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Simpan Perubahan
      </button>
    </form>
  )
}
