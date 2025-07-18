// DashboardLayout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { Menu, X } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
}

const menuItems: Record<string, MenuItem[]> = {
  ADMIN: [
    { label: "Beranda", href: "/dashboard/admin" },
    { label: "Kelola Siswa", href: "/dashboard/admin/siswa" },
    { label: "Tambah Siswa", href: "/dashboard/admin/siswa/tambah" },
    { label: "Upload Siswa", href: "/dashboard/admin/siswa/upload" },
    { label: "Rekap Siswa", href: "/dashboard/admin/siswa/rekap" },
    { label: "Kelola Pengajar", href: "/dashboard/admin/pengajar" },
    { label: "Tambah Pengajar", href: "/dashboard/admin/pengajar/tambah" },
    { label: "Upload Pengajar", href: "/dashboard/admin/pengajar/upload" },
    { label: "Rekap Pengajar", href: "/dashboard/admin/pengajar/rekap" },
    { label: "Jadwal", href: "/dashboard/admin/jadwal" },
  ],
  PENGAJAR: [
    { label: "Beranda", href: "/dashboard/pengajar" },
    { label: "Materi", href: "/dashboard/pengajar/materi" },
    { label: "Nilai", href: "/dashboard/pengajar/nilai" },
    { label: "Rekap Nilai", href: "/dashboard/pengajar/rekap-nilai" },
    { label: "Jadwal", href: "/dashboard/pengajar/jadwal" },
  ],
  SISWA: [
    { label: "Beranda", href: "/dashboard/siswa" },
    { label: "Materi", href: "/dashboard/siswa/materi" },
    { label: "Tugas", href: "/dashboard/siswa/tugas" },
    { label: "Nilai", href: "/dashboard/siswa/nilai" },
    { label: "Jadwal", href: "/dashboard/siswa/jadwal" },
  ],
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setLoadingSession(false);
      });
  }, []);

  const role = session?.user?.role;
  if (loadingSession) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!session || !role) return <div className="p-4">Unauthorized</div>;

  const items = menuItems[role] || [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 lg:static lg:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <h1 className="text-2xl font-bold text-blue-400 mb-4">RUMAH PINTAR</h1>
        <p className="text-sm text-gray-400 mb-6">Role: {role}</p>
        <nav className="space-y-2">
          {items.map(item => (
            <Link key={item.href} href={item.href} className="block py-2 px-4 rounded hover:bg-gray-700">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 pt-4 border-t border-gray-700">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 lg:px-6">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded bg-gray-800 text-white lg:hidden"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="max-w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}

