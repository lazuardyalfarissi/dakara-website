import { createAdminClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  // Ambil hitungan dari 6 tabel sekarang (tambah songs)
  const [
    { count: albumCount },
    { count: songCount }, // Tambahan untuk statistik lagu
    { count: showCount },
    { count: galleryCount },
    { count: newsCount },
    { count: memberCount },
  ] = await Promise.all([
    supabase.from('albums').select('*', { count: 'exact', head: true }),
    supabase.from('songs').select('*', { count: 'exact', head: true }), // Query tabel songs
    supabase.from('show_dates').select('*', { count: 'exact', head: true }),
    supabase.from('gallery').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('members').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Members', value: memberCount ?? 0, emoji: '🎸' },
    { label: 'Albums', value: albumCount ?? 0, emoji: '💿' },
    { label: 'Songs / Singles', value: songCount ?? 0, emoji: '🎵' }, // Tampilkan total lagu/single
    { label: 'Show Dates', value: showCount ?? 0, emoji: '🎤' },
    { label: 'Gallery Items', value: galleryCount ?? 0, emoji: '🖼️' },
    { label: 'News Posts', value: newsCount ?? 0, emoji: '📰' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        DASHBOARD
      </h1>
      <p style={{ color: '#555', marginBottom: '3rem' }}>Welcome back, Admin!</p>

      {/* Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: '#1a1a1a',
            border: '1px solid #222',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.emoji}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.25rem' }}>{stat.value}</div>
            <div style={{ color: '#555', fontSize: '0.85rem', letterSpacing: '0.1em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links Updated */}
      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#1a1a1a', border: '1px solid #222', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '1rem', color: '#666' }}>QUICK LINKS</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { href: '/admin/albums', label: '+ Add Album' },
            { href: '/admin/songs', label: '+ Add Songs / Single' }, // Link baru untuk manajemen lagu
            { href: '/admin/shows', label: '+ Add Show' },
            { href: '/admin/gallery', label: '+ Add Gallery' },
            { href: '/admin/news', label: '+ Add News' },
          ].map((link) => (
            <a key={link.href} href={link.href} style={{
              padding: '0.5rem 1.25rem',
              border: '1px solid #333',
              borderRadius: '4px',
              color: '#ccc',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}