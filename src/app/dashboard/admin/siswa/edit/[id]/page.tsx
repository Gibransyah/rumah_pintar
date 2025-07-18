'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SiswaForm {
  nama: string;
  kelas: string;
  email: string;
}

export default function EditSiswaPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<SiswaForm>({
    nama: '',
    kelas: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSiswaData = async () => {
      try {
        const res = await fetch(`/api/admin/siswa/${params.id}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch student data: ${res.statusText}`);
        }

        const data = await res.json();
        setFormData({
          nama: data.nama,
          kelas: data.kelas,
          email: data.user.email,
        });
      } catch (err: any) {
        console.error('Error fetching student data:', err);
        setError(err.message || 'Failed to load student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiswaData();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    try {
      const res = await fetch(`/api/admin/siswa/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update student.');
      }

      alert('Student updated successfully!');
      router.push('/dashboard/admin/siswa');
    } catch (err: any) {
      console.error('Error updating student:', err);
      setError(err.message || 'Failed to update student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading student data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Edit Siswa</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nama"
          placeholder="Nama"
          value={formData.nama}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />

        <input
          type="text"
          name="kelas"
          placeholder="Kelas"
          value={formData.kelas}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}