/**
 * lib/spotify.ts
 * Spotify Web API — Client Credentials Flow
 */

const BASE_URL = 'https://api.spotify.com/v1'

/* ── Token cache ── */
let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken
  }

  const clientId     = process.env.SPOTIFY_CLIENT_ID!
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!
  const basic        = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Spotify token error ${res.status}: ${err}`)
  }

  const data     = await res.json()
  cachedToken    = data.access_token
  tokenExpiresAt = Date.now() + data.expires_in * 1000
  console.log('[Spotify] Token refreshed, expires in', data.expires_in, 's')
  return cachedToken!
}

async function spotifyFetch<T>(path: string): Promise<T> {
  const token = await getAccessToken()
  const url   = path.startsWith('http') ? path : `${BASE_URL}${path}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    // next: { revalidate: 3600 }, // <-- GW MATIIN DULU BIAR CACHE BERSIH
    cache: 'no-store',             // <-- PAKE NO-STORE BUAT DEBUGGING
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Spotify API ${res.status} on ${path}: ${err}`)
  }

  return res.json() as Promise<T>
}

/* ════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════ */
export interface SpotifyImage {
  url: string
  width: number
  height: number
}

export interface SpotifyAlbum {
  id: string
  name: string
  album_type: 'album' | 'single' | 'compilation'
  release_date: string
  total_tracks: number
  images: SpotifyImage[]
  external_urls: { spotify: string }
  artists: { id: string; name: string }[]
}

export interface SpotifyTrack {
  id: string
  name: string
  track_number: number
  duration_ms: number
  preview_url: string | null
  external_urls: { spotify: string }
  artists: { id: string; name: string }[]
}

export interface SpotifyAlbumDetail extends SpotifyAlbum {
  tracks: {
    items: SpotifyTrack[]
    total: number
  }
  label: string
  copyrights: { text: string; type: string }[]
}

/* ════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════ */

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const min      = Math.floor(totalSec / 60)
  const sec      = totalSec % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export function getBestImage(images: SpotifyImage[], minWidth = 300): string {
  const sorted = [...images].sort((a, b) => b.width - a.width)
  return (sorted.find(img => img.width >= minWidth) ?? sorted[0])?.url ?? ''
}

/* ════════════════════════════════════════════════════
   API CALLS
════════════════════════════════════════════════════ */

export async function getArtistAlbums(
  artistId: string,
  include_groups = 'album,single',
  limit = 50,
): Promise<SpotifyAlbum[]> {
  const params = new URLSearchParams({
    include_groups,
    limit: String(limit),
    offset: '0',
    market: 'ID', // <-- UDAH GW TAMBAHIN MARKET ID
  })

  const data = await spotifyFetch<{
    items: SpotifyAlbum[]
    total: number
    next: string | null
  }>(`/artists/${artistId}/albums?${params}`)

  console.log(`[Spotify] Artist ${artistId} — total: ${data.total}, fetched: ${data.items.length}`)

  let albums = data.items

  // Pagination
  let nextUrl = data.next
  while (nextUrl) {
    const page = await spotifyFetch<{ items: SpotifyAlbum[]; next: string | null }>(nextUrl)
    albums     = [...albums, ...page.items]
    nextUrl    = page.next
  }

  return albums
}

export async function getAlbums(albumIds: string[]): Promise<SpotifyAlbumDetail[]> {
  const chunks: string[][] = []
  for (let i = 0; i < albumIds.length; i += 20) {
    chunks.push(albumIds.slice(i, i + 20))
  }

  const results = await Promise.all(
    chunks.map(chunk =>
      spotifyFetch<{ albums: SpotifyAlbumDetail[] }>(
        `/albums?ids=${chunk.join(',')}`
      ).then(d => d.albums)
    )
  )

  return results.flat().filter(Boolean)
}

export async function getArtistDiscography(artistId: string): Promise<SpotifyAlbumDetail[]> {
  const albums = await getArtistAlbums(artistId, 'album,single')

  if (albums.length === 0) {
    console.log('[Spotify] No albums found for artist:', artistId)
    return []
  }

  console.log('[Spotify] Fetching detail for', albums.length, 'albums...')

  const detailed = await getAlbums(albums.map(a => a.id))

  console.log('[Spotify] Detail fetched:', detailed.length, 'albums')

  return detailed.sort(
    (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  )
}