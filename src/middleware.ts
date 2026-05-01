import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Izinkan akses ke login dan API auth
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // 2. Ambil token dengan konfigurasi secureCookie yang sesuai environment
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // Penting: Harus true di produksi (Vercel) agar bisa baca __Secure- cookie
    secureCookie: process.env.NODE_ENV === "production",
  })

  // 3. Jika tidak ada token saat akses /admin, redirect ke login
  if (!token) {
    const loginUrl = new URL('/admin/login', req.url)
    // Simpan halaman asal agar bisa kembali setelah login
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Hanya jalankan middleware untuk route /admin
  matcher: ['/admin/:path*'],
}