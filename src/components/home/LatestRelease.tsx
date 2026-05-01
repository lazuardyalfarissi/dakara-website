import { Album } from '@/types'

interface Props {
  album: Album | null
}

export default function LatestRelease({ album }: Props) {
  if (!album) {
    return (
      <section style={{ padding: '4rem 2rem', background: '#111', color: '#fff', textAlign: 'center' }}>
        <p style={{ letterSpacing: '0.3em', color: '#666', fontSize: '0.85rem' }}>LATEST RELEASE</p>
        <p style={{ color: '#555', marginTop: '1rem' }}>No releases yet.</p>
      </section>
    )
  }

  return (
    <section style={{ padding: '4rem 2rem', background: '#111', color: '#fff' }}>
      <p style={{ letterSpacing: '0.3em', color: '#666', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem' }}>
        LATEST RELEASE
      </p>
      <div style={{
        maxWidth: '800px', margin: '0 auto',
        display: 'flex', gap: '2rem', alignItems: 'center',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {album.cover_url && (
          <img src={album.cover_url} alt={album.title}
            style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
        )}
        <div>
          <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>{album.title}</h3>
          {album.release_date && (
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              {new Date(album.release_date).getFullYear()}
            </p>
          )}
          {album.description && (
            <p style={{ color: '#aaa', lineHeight: 1.7, marginBottom: '1.5rem' }}>{album.description}</p>
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
    </section>
  )
}