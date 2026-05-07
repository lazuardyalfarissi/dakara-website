import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  getArtistDiscography,
  getBestImage,
  formatDuration,
  SpotifyAlbumDetail,
} from '@/lib/spotify'
import { Album } from '@/types'

/* ════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════ */
interface MergedAlbum {
  spotify_id:   string
  title:        string
  album_type:   'album' | 'single' | 'compilation'
  release_date: string
  cover_url:    string
  spotify_url:  string
  youtube_url?: string | null
  description?: string | null
  hidden?:      boolean
  sort_order?:  number | null
  tracks: {
    id:           string
    title:        string
    track_number: number
    duration:     string
    preview_url:  string | null
    spotify_url:  string
  }[]
}

/* ════════════════════════════════════════════════════
   DATA LAYER
════════════════════════════════════════════════════ */
async function getDiscography(): Promise<MergedAlbum[]> {
  // PENTING: Tambah .trim() biar aman dari spasi nyelip di .env
  const artistId = process.env.SPOTIFY_ARTIST_ID!.trim()

  const [spotifyResult, supabaseResult] = await Promise.allSettled([
    getArtistDiscography(artistId),
    (async () => {
      const supabase = await createServerSupabaseClient()
      const { data } = await supabase
        .from('albums')
        .select('*, songs(*)')
        .order('sort_order', { ascending: true, nullsFirst: false })
      return data ?? []
    })(),
  ])

  // --- LOGGING ERROR BIAR KETAHUAN PENYAKITNYA DI MANA ---
  if (spotifyResult.status === 'rejected') {
    console.error('❌ [ERROR SPOTIFY]:', spotifyResult.reason)
  }
  if (supabaseResult.status === 'rejected') {
    console.error('❌ [ERROR SUPABASE]:', supabaseResult.reason)
  }

  const spotify: SpotifyAlbumDetail[] =
    spotifyResult.status === 'fulfilled' ? spotifyResult.value : []

  const supabaseAlbums: (Album & { songs?: any[] })[] =
    supabaseResult.status === 'fulfilled' ? supabaseResult.value : []

  console.log('[Discography] Spotify albums:', spotify.length)
  console.log('[Discography] Supabase albums:', supabaseAlbums.length)

  // Map Supabase by spotify_id untuk lookup O(1)
  const supabaseMap = new Map(
    supabaseAlbums
      .filter(a => a.spotify_id)
      .map(a => [a.spotify_id, a])
  )

  // Merge Spotify + override dari Supabase
  const merged: MergedAlbum[] = spotify.map(sp => {
    const override = supabaseMap.get(sp.id)
    return {
      spotify_id:   sp.id,
      title:        sp.name,
      album_type:   sp.album_type,
      release_date: sp.release_date,
      cover_url:    getBestImage(sp.images, 400),
      spotify_url:  sp.external_urls.spotify,
      youtube_url:  override?.youtube_url ?? null,
      description:  override?.description ?? null,
      hidden:       override?.hidden ?? false,
      sort_order:   override?.sort_order ?? null,
      tracks:       sp.tracks.items.map(t => ({
        id:           t.id,
        title:        t.name,
        track_number: t.track_number,
        duration:     formatDuration(t.duration_ms),
        preview_url:  t.preview_url,
        spotify_url:  t.external_urls.spotify,
      })),
    }
  })

  // Tambah album manual Supabase (tanpa spotify_id)
  for (const a of supabaseAlbums) {
    if (!a.spotify_id) {
      merged.push({
        spotify_id:   a.id,
        title:        a.title,
        album_type:   'album',
        release_date: a.release_date ?? '',
        cover_url:    a.cover_url ?? '',
        spotify_url:  a.spotify_url ?? '',
        youtube_url:  a.youtube_url ?? null,
        description:  a.description ?? null,
        hidden:       false,
        sort_order:   null,
        tracks:       (a.songs ?? []).map((s: any, i: number) => ({
          id:           s.id,
          title:        s.title,
          track_number: i + 1,
          duration:     s.duration ?? '',
          preview_url:  null,
          spotify_url:  '',
        })),
      })
    }
  }

  return merged
    .filter(a => !a.hidden)
    .sort((a, b) => {
      if (a.sort_order != null && b.sort_order != null) return a.sort_order - b.sort_order
      if (a.sort_order != null) return -1
      if (b.sort_order != null) return 1
      return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    })
}

/* ════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════ */
export const revalidate = 3600

export default async function DiscographyPage() {
  const albums     = await getDiscography()
  const fullAlbums = albums.filter(a => a.album_type === 'album')
  const singles    = albums.filter(a => a.album_type === 'single' || a.album_type === 'compilation')

  return (
    <main>
      <div className="disc-navbar-bar" aria-hidden="true" />

      <section className="disc-section">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

          .disc-navbar-bar {
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 68px;
            background: rgba(5,5,5,0.97);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            z-index: 999;
            pointer-events: none;
          }

          .disc-section {
            min-height: 100vh;
            background: #0a0a0a;
            color: #fff;
            font-family: 'Space Mono', monospace;
            padding-top: 68px;
          }

          .disc-content {
            max-width: 1100px;
            margin: 0 auto;
            padding: 3rem 3rem 5rem;
          }

          .disc-top-label {
            font-size: clamp(10px, 1.1vw, 14px);
            letter-spacing: 0.4em;
            color: #555;
            text-transform: uppercase;
            text-align: center;
            margin: 0 0 0.6rem;
          }

          .disc-main-title {
            font-family: 'Space Mono', monospace;
            font-size: clamp(3rem, 9vw, 6.5rem);
            font-weight: 700;
            letter-spacing: 0.06em;
            text-align: center;
            margin: 0 0 4rem;
            line-height: 1;
            color: #fff;
          }

          .disc-section-label {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 3.5rem 0 2rem;
          }

          .disc-section-label-text {
            font-size: clamp(11px, 1.2vw, 15px);
            font-weight: 700;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #444;
            white-space: nowrap;
          }

          .disc-section-label-line {
            flex: 1;
            height: 1px;
            background: #1e1e1e;
          }

          .disc-section-label-count {
            font-size: clamp(11px, 1.1vw, 14px);
            letter-spacing: 0.1em;
            color: #333;
            white-space: nowrap;
          }

          .disc-album {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 2.5rem;
            align-items: flex-start;
            padding: 2.5rem 0;
            border-bottom: 1px solid #161616;
          }

          .disc-album:last-child { border-bottom: none; }

          .disc-cover-wrap {
            width: 220px;
            height: 220px;
            background: #141414;
            overflow: hidden;
            position: relative;
            flex-shrink: 0;
          }

          .disc-cover-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.4s ease;
          }

          .disc-cover-wrap:hover img { transform: scale(1.04); }

          .disc-cover-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: #333;
          }

          .disc-info { flex: 1; }

          .disc-album-type {
            font-size: 10px;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: #444;
            margin: 0 0 0.5rem;
          }

          .disc-album-title {
            font-family: 'Space Mono', monospace;
            font-size: clamp(18px, 2.5vw, 32px);
            font-weight: 700;
            letter-spacing: 0.03em;
            color: #fff;
            margin: 0 0 0.35rem;
            line-height: 1.2;
          }

          .disc-album-year {
            font-size: clamp(12px, 1.1vw, 15px);
            color: #444;
            letter-spacing: 0.1em;
            margin: 0 0 1rem;
          }

          .disc-album-desc {
            font-size: clamp(12px, 1.1vw, 14px);
            color: #777;
            line-height: 1.8;
            margin: 0 0 1.5rem;
            font-style: italic;
          }

          .disc-tracklist {
            margin-bottom: 1.5rem;
            border-top: 1px solid #1a1a1a;
          }

          .disc-track {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.55rem 0;
            border-bottom: 1px solid #141414;
            transition: background 0.15s;
          }

          .disc-track:hover { background: #111; }

          .disc-track-num {
            font-size: 11px;
            color: #333;
            width: 1.5rem;
            text-align: right;
            flex-shrink: 0;
            letter-spacing: 0.05em;
          }

          .disc-track-title {
            flex: 1;
            font-size: clamp(12px, 1.1vw, 14px);
            color: #bbb;
            letter-spacing: 0.03em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .disc-track-duration {
            font-size: 11px;
            color: #333;
            flex-shrink: 0;
            letter-spacing: 0.05em;
          }

          .disc-track-preview {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            border: 1px solid #2a2a2a;
            border-radius: 50%;
            background: transparent;
            color: #555;
            cursor: pointer;
            flex-shrink: 0;
            font-size: 10px;
            transition: border-color 0.2s, color 0.2s;
            text-decoration: none;
          }

          .disc-track-preview:hover { border-color: #1DB954; color: #1DB954; }

          .disc-links {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
            align-items: center;
          }

          .disc-link {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-family: 'Space Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            border: 1.5px solid #222;
            border-radius: 999px;
            padding: 0.5rem 1.2rem;
            text-decoration: none;
            color: #aaa;
            transition: border-color 0.2s, color 0.2s;
            white-space: nowrap;
          }

          .disc-link:hover         { border-color: #fff; color: #fff; }
          .disc-link.spotify:hover { border-color: #1DB954; color: #1DB954; }
          .disc-link.youtube:hover { border-color: #FF0000; color: #FF0000; }

          .disc-empty {
            text-align: center;
            padding: 5rem 0;
            color: #333;
            font-size: 13px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }

          /* ── MOBILE ≤ 640px ── */
          @media (max-width: 640px) {
            .disc-content { padding: 2rem 1rem 3rem; }

            .disc-album {
              grid-template-columns: 1fr;
              gap: 1rem;
              padding: 1.75rem 0;
            }

            .disc-cover-wrap {
              width: 100%;
              height: 0;
              padding-bottom: 100%;
            }

            .disc-cover-wrap img,
            .disc-cover-placeholder {
              position: absolute;
              top: 0; left: 0;
              width: 100%; height: 100%;
            }

            .disc-album-title { font-size: 20px; }
            .disc-track-title { font-size: 12px; }

            .disc-link {
              font-size: 10px;
              padding: 0.45rem 1rem;
            }
          }

          @media (min-width: 641px) and (max-width: 960px) {
            .disc-content { padding: 2rem 2rem 4rem; }
            .disc-album { grid-template-columns: 180px 1fr; gap: 2rem; }
            .disc-cover-wrap { width: 180px; height: 180px; }
          }

          @media (min-width: 1400px) {
            .disc-content { padding: 4rem 5rem 6rem; }
            .disc-album { grid-template-columns: 260px 1fr; }
            .disc-cover-wrap { width: 260px; height: 260px; }
          }
        `}} />

        <div className="disc-content">
          <p className="disc-top-label">Our Music</p>
          <h1 className="disc-main-title">DISCOGRAPHY</h1>

          {albums.length === 0 && (
            <div className="disc-empty">
              <p>No releases yet. Stay tuned!</p>
            </div>
          )}

          {fullAlbums.length > 0 && (
            <>
              <div className="disc-section-label">
                <span className="disc-section-label-text">Albums</span>
                <div className="disc-section-label-line" />
                <span className="disc-section-label-count">{fullAlbums.length}</span>
              </div>
              {fullAlbums.map(album => <AlbumCard key={album.spotify_id} album={album} />)}
            </>
          )}

          {singles.length > 0 && (
            <>
              <div className="disc-section-label" style={{ marginTop: '4rem' }}>
                <span className="disc-section-label-text">Singles & EPs</span>
                <div className="disc-section-label-line" />
                <span className="disc-section-label-count">{singles.length}</span>
              </div>
              {singles.map(album => <AlbumCard key={album.spotify_id} album={album} />)}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

/* ════════════════════════════════════════════════════
   ALBUM CARD
════════════════════════════════════════════════════ */
function AlbumCard({ album }: { album: MergedAlbum }) {
  const year = album.release_date
    ? new Date(album.release_date).getFullYear()
    : null

  const typeLabel =
    album.album_type === 'single'      ? 'Single' :
    album.album_type === 'compilation' ? 'Compilation' :
    'Album'

  return (
    <div className="disc-album">
      <div className="disc-cover-wrap">
        {album.cover_url
          ? <img src={album.cover_url} alt={album.title} loading="lazy" />
          : <div className="disc-cover-placeholder">♫</div>
        }
      </div>

      <div className="disc-info">
        <p className="disc-album-type">{typeLabel}</p>
        <h2 className="disc-album-title">{album.title}</h2>
        {year && <p className="disc-album-year">{year}</p>}
        {album.description && <p className="disc-album-desc">{album.description}</p>}

        {album.tracks.length > 0 && (
          <div className="disc-tracklist">
            {album.tracks.map(track => (
              <div key={track.id} className="disc-track">
                <span className="disc-track-num">{track.track_number}</span>
                <span className="disc-track-title">{track.title}</span>
                {track.preview_url && (
                  <a
                    href={track.preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="disc-track-preview"
                    title="Play preview"
                    aria-label={`Preview ${track.title}`}
                  >
                    ▶
                  </a>
                )}
                <span className="disc-track-duration">{track.duration}</span>
              </div>
            ))}
          </div>
        )}

        <div className="disc-links">
          {album.spotify_url && (
            <a href={album.spotify_url} target="_blank" rel="noopener noreferrer" className="disc-link spotify">
              ♫ Spotify
            </a>
          )}
          {album.youtube_url && (
            <a href={album.youtube_url} target="_blank" rel="noopener noreferrer" className="disc-link youtube">
              ▶ YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  )
}