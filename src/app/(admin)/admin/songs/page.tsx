'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Album, Song } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const supabase = createClient()

  async function fetchData() {
    setFetchLoading(true)
    const [songsRes, albumsRes] = await Promise.all([
      supabase.from('songs').select('*, albums(title, cover_url)').order('created_at', { ascending: false }),
      supabase.from('albums').select('id, title, cover_url').order('title')
    ])
    setSongs(songsRes.data || [])
    setAlbums(albumsRes.data || [])
    setFetchLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleEditClick = (song: any) => {
    setEditingId(song.id)
    const form = document.getElementById('song-form') as HTMLFormElement
    if (form) {
      (form.elements.namedItem('title') as HTMLInputElement).value = song.title || '';
      (form.elements.namedItem('album_id') as HTMLSelectElement).value = song.album_id || '';
      (form.elements.namedItem('duration') as HTMLInputElement).value = song.duration || '';
      (form.elements.namedItem('spotify_url') as HTMLInputElement).value = song.spotify_url || '';
      (form.elements.namedItem('youtube_url') as HTMLInputElement).value = song.youtube_url || '';
      (form.elements.namedItem('track_number') as HTMLInputElement).value = String(song.track_number || '');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const album_id = (form.elements.namedItem('album_id') as HTMLSelectElement).value || null
    const duration = (form.elements.namedItem('duration') as HTMLInputElement).value
    const spotify_url = (form.elements.namedItem('spotify_url') as HTMLInputElement).value
    const youtube_url = (form.elements.namedItem('youtube_url') as HTMLInputElement).value
    const track_number = parseInt((form.elements.namedItem('track_number') as HTMLInputElement).value) || null
    const coverFile = (form.elements.namedItem('cover') as HTMLInputElement).files?.[0]

    let cover_url = null
    if (coverFile) {
      const fileName = `${Date.now()}-${coverFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('songs')
        .upload(fileName, coverFile)
      
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('songs').getPublicUrl(fileName)
        cover_url = urlData.publicUrl
      }
    }

    const payload: any = { title, album_id, duration, spotify_url, youtube_url, track_number }
    if (cover_url) payload.cover_url = cover_url

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('songs').update(payload).eq('id', editingId)
      error = err
    } else {
      const { error: err } = await supabase.from('songs').insert(payload)
      error = err
    }

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert(editingId ? 'Lagu diperbarui!' : 'Lagu ditambahkan!')
      form.reset()
      setEditingId(null)
      fetchData()
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '2rem' }}>SONGS & SINGLES</h1>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1.5rem' }}>
          {editingId ? 'EDIT TRACK' : '+ TAMBAH TRACK BARU'}
        </h2>
        <form id="song-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <input name="title" placeholder="Judul Lagu *" required
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
            <select name="album_id" 
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}>
              <option value="">Single (Tanpa Album)</option>
              {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="duration" placeholder="Durasi (ex: 3:45)"
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
            <input name="cover" type="file" accept="image/*"
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <input name="track_number" type="number" placeholder="Track #"
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
             <input name="spotify_url" placeholder="Spotify URL"
               style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          </div>

          <input name="youtube_url" placeholder="YouTube URL"
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button type="submit" loading={loading} style={{ flex: 1 }}>
              {editingId ? 'SIMPAN PERUBAHAN' : 'TAMBAH LAGU'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={() => { setEditingId(null); (document.getElementById('song-form') as HTMLFormElement).reset() }}>BATAL</Button>
            )}
          </div>
        </form>
      </Card>

      <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1rem' }}>DAFTAR TRACK</h2>
      {fetchLoading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {songs.map((song) => {
            // Logika: Gunakan cover lagu, kalau tidak ada pakai cover album, kalau tidak ada dua-duanya kosong.
            const displayCover = song.cover_url || song.albums?.cover_url;
            
            return (
              <Card key={song.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {displayCover && (
                  <img src={displayCover} alt={song.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold' }}>{song.title} <span style={{ color: '#444', fontSize: '0.8rem' }}>({song.duration})</span></p>
                  <p style={{ color: '#666', fontSize: '0.8rem' }}>
                    {song.albums?.title ? `Album: ${song.albums.title}` : 'Status: Single'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button size="sm" onClick={() => handleEditClick(song)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => { if(confirm('Hapus?')) supabase.from('songs').delete().eq('id', song.id).then(() => fetchData()) }}>Hapus</Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}