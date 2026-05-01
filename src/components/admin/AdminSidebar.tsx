'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const menuItems = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/hero', label: '⚡ Hero Banner' }, // Menu Baru
  { href: '/admin/members', label: '🎸 Members' }, // Tambah Menu Members
  { href: '/admin/albums', label: '💿 Albums' },
  { href: '/admin/songs', label: '🎵 Songs / Singles' }, // Tambah Menu Songs
  { href: '/admin/shows', label: '🎤 Show Dates' },
  { href: '/admin/gallery', label: '🖼️ Gallery' },
  { href: '/admin/news', label: '📰 News' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#111',
      borderRight: '1px solid #222',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 0',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#fff', fontWeight: '900', fontSize: '1.3rem', letterSpacing: '0.2em' }}>
          DAKARA
        </h1>
        <p style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '0.1em' }}>ADMIN PANEL</p>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }}> {/* Tambah overflowY biar kalau menu banyak bisa di-scroll */}
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'block',
              padding: '0.75rem 1.5rem',
              color: isActive ? '#fff' : '#666',
              textDecoration: 'none',
              fontSize: '0.9rem',
              background: isActive ? '#1a1a1a' : 'transparent',
              borderLeft: isActive ? '2px solid #fff' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 1.5rem', marginTop: '1rem' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            border: '1px solid #333',
            color: '#666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ff4444';
            e.currentTarget.style.color = '#ff4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#333';
            e.currentTarget.style.color = '#666';
          }}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  )
}