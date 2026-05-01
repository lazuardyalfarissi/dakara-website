import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Album } from '@/types'
import Link from 'next/link'

export default async function DiscographyPage() {
  const supabase = await createServerSupabaseClient()
  const { data: albums } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .order('release_date', { ascending: false })

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '6rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <p style={{ letterSpacing: '0.3em', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>OUR MUSIC</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: '900', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '4rem' }}>
          DISCOGRAPHY
        </h1>

        {(!albums || albums.length === 0) && (
          <p style={{ color: '#555', textAlign: 'center' }}>No releases yet. Stay tuned!</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {albums?.map((album: Album) => (
            <div key={album.id} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: '200px', height: '200px', background: '#1a1a1a', flexShrink: 0, overflow: 'hidden' }}>
                {album.cover_url
                  ? <img src={album.cover_url} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎵</div>
                }
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem' }}>{album.title}</h2>
                {album.release_date && (
                  <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {new Date(album.release_date).getFullYear()}
                  </p>
                )}
                {album.description && (
                  <p style={{ color: '#aaa', lineHeight: 1.7, marginBottom: '1.5rem' }}>{album.description}</p>
                )}
                {album.songs && album.songs.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    {album.songs.map((song, i) => (
                      <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #1a1a1a', color: '#ccc', fontSize: '0.9rem' }}>
                        <span>{i + 1}. {song.title}</span>
                        <span style={{ color: '#555' }}>{song.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {album.spotify_url && (
                    <a href={album.spotify_url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '0.5rem 1.5rem', background: '#1DB954', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.85rem' }}>
                      Spotify
                    </a>
                  )}
                  {album.youtube_url && (
                    <a href={album.youtube_url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '0.5rem 1.5rem', background: '#FF0000', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.85rem' }}>
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}