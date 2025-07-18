import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })

  const url = req.nextUrl
  const path = url.pathname

  // ⛔ Belum login → redirect ke /login
  if (!token && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ✅ Login → Cek role dan arahkan
  if (token) {
    const role = token.role

    if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/dashboard/pengajar") && role !== "PENGAJAR") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/dashboard/siswa") && role !== "SISWA") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
