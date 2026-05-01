import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Lewati halaman login dan API auth agar tidak looping
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // 2. Ambil token. 
  // Di Vercel (HTTPS), nama cookienya sering berubah jadi __Secure-next-auth.session-token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // Tambahkan ini agar middleware lebih teliti mencari cookie di HTTPS
    secureCookie: process.env.NODE_ENV === "production",
  })

  // 3. Jika tidak ada token dan mencoba akses /admin, tendang ke login
  if (!token) {
    const loginUrl = new URL('/admin/login', req.url)
    // Tambahkan callbackUrl agar setelah login bisa balik lagi ke halaman yang dituju
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}