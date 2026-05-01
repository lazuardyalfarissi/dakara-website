import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Proteksi tambahan untuk memastikan credentials tidak undefined
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: '1', email: credentials.email, name: 'Admin Dakara' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    // Pastikan session bertahan cukup lama di produksi
    maxAge: 30 * 24 * 60 * 60, 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Pastikan session.user ada sebelum mengisi ID untuk menghindari error TS
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  // Penting: NextAuth butuh secret untuk enkripsi JWT di produksi
  secret: process.env.NEXTAUTH_SECRET,
  // Tambahkan cookies configuration jika Vercel masih bermasalah dengan HTTPS
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true // Wajib true karena Vercel menggunakan HTTPS
      }
    }
  }
}