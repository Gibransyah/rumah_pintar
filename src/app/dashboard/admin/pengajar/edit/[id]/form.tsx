'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditForm({ pengajar }: { pengajar: any }) {
  const [nama, setNama] = useState(pengajar.nama)
  const [email, setEmail] = useState(pengajar.user.email)
  const [mataPelajaran, setMataPelajaran] = useState(pengajar.mataPelajaran)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch(`/api/admin/pengajar/${pengajar.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ nama, email, mataPelajaran }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      router.push('/dashboard/admin/pengajar')
    } else {
      alert('Gagal mengedit pengajar')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Nama</label>
        <input value={nama} onChange={(e) => setNama(e.target.value)} className="border p-2 w-full" required />
      </div>
      <div>
        <label className="block">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" required />
      </div>
      <div>
        <label className="block">Mata Pelajaran</label>
        <input value={mataPelajaran} onChange={(e) => setMataPelajaran(e.target.value)} className="border p-2 w-full" required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan Perubahan</button>
    </form>
  )
}
