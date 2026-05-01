'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Album } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const supabase = createClient()

  async function fetchAlbums() {
    setFetchLoading(true)
    const { data } = await supabase
      .from('albums')
      .select('*, songs(*)')
      .order('release_date', { ascending: false })
    setAlbums(data || [])
    setFetchLoading(false)
  }

  useEffect(() => { fetchAlbums() }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value
    const release_date = (form.elements.namedItem('release_date') as HTMLInputElement).value
    const spotify_url = (form.elements.namedItem('spotify_url') as HTMLInputElement).value
    const youtube_url = (form.elements.namedItem('youtube_url') as HTMLInputElement).value
    const coverFile = (form.elements.namedItem('cover') as HTMLInputElement).files?.[0]

    let cover_url = null
    if (coverFile) {
      const fileName = `${Date.now()}-${coverFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('albums')
        .upload(fileName, coverFile)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('albums').getPublicUrl(fileName)
        cover_url = publicUrl
      }
    }

    const { error } = await supabase.from('albums').insert({
      title, description, release_date, spotify_url, youtube_url, cover_url
    })

    if (error) alert('Error: ' + error.message)
    else { alert('Album berhasil ditambahkan!'); form.reset(); fetchAlbums() }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin mau hapus album ini?')) return
    await supabase.from('albums').delete().eq('id', id)
    fetchAlbums()
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '2rem' }}>ALBUMS</h1>

      {/* Form Tambah Album */}
      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1.5rem' }}>+ TAMBAH ALBUM</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input name="title" placeholder="Judul Album *" required
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <textarea name="description" placeholder="Deskripsi" rows={3}
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff', resize: 'vertical' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="release_date" type="date" placeholder="Tanggal Rilis"
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
            <input name="cover" type="file" accept="image/*"
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          </div>
          <input name="spotify_url" placeholder="Spotify URL"
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <input name="youtube_url" placeholder="YouTube URL"
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <Button type="submit" loading={loading}>TAMBAH ALBUM</Button>
        </form>
      </Card>

      {/* List Album */}
      <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1rem' }}>DAFTAR ALBUM</h2>
      {fetchLoading ? (
        <p style={{ color: '#555' }}>Loading...</p>
      ) : albums.length === 0 ? (
        <p style={{ color: '#555' }}>Belum ada album.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {albums.map((album) => (
            <Card key={album.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {album.cover_url && (
                <img src={album.cover_url} alt={album.title}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold' }}>{album.title}</p>
                <p style={{ color: '#555', fontSize: '0.85rem' }}>
                  {album.release_date ? new Date(album.release_date).getFullYear() : 'No date'} •{' '}
                  {album.songs?.length || 0} songs
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={() => handleDelete(album.id)}>Hapus</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}