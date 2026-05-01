'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GalleryItem } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [type, setType] = useState<'photo' | 'video'>('photo')
  const supabase = createClient()

  async function fetchItems() {
    setFetchLoading(true)
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setFetchLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const photoFile = (form.elements.namedItem('photo') as HTMLInputElement).files?.[0]
    const videoUrl = (form.elements.namedItem('video_url') as HTMLInputElement)?.value

    let url = videoUrl || ''

    if (type === 'photo' && photoFile) {
      const fileName = `${Date.now()}-${photoFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, photoFile)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
        url = publicUrl
      }
    }

    if (!url) { alert('URL atau file wajib diisi!'); setLoading(false); return }

    const { error } = await supabase.from('gallery').insert({ type, title, url })
    if (error) alert('Error: ' + error.message)
    else { alert('Berhasil ditambahkan!'); form.reset(); fetchItems() }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin mau hapus?')) return
    await supabase.from('gallery').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '2rem' }}>GALLERY</h1>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1.5rem' }}>+ TAMBAH ITEM</h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button variant={type === 'photo' ? 'primary' : 'ghost'} size="sm" onClick={() => setType('photo')}>📷 Photo</Button>
          <Button variant={type === 'video' ? 'primary' : 'ghost'} size="sm" onClick={() => setType('video')}>🎬 Video</Button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input name="title" placeholder="Judul (opsional)"
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          {type === 'photo' ? (
            <input name="photo" type="file" accept="image/*" required
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          ) : (
            <input name="video_url" placeholder="YouTube Embed URL (https://www.youtube.com/embed/xxx)" required
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          )}
          <Button type="submit" loading={loading}>TAMBAH</Button>
        </form>
      </Card>

      <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1rem' }}>DAFTAR ITEM</h2>
      {fetchLoading ? (
        <p style={{ color: '#555' }}>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {items.map((item) => (
            <Card key={item.id} padding="sm" style={{ position: 'relative' }}>
              {item.type === 'photo' ? (
                <img src={item.url} alt={item.title || ''} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#111', borderRadius: '4px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🎬</div>
              )}
              <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>{item.title || 'No title'}</p>
              <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)} style={{ width: '100%' }}>Hapus</Button>
            </Card>
          ))}
          {items.length === 0 && <p style={{ color: '#555' }}>Belum ada item.</p>}
        </div>
      )}
    </div>
  )
}