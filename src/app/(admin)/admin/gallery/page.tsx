'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const fetchItems = useCallback(async () => {
    setFetchLoading(true)
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setFetchLoading(false)
  }, [supabase])

  useEffect(() => { fetchItems() }, [fetchItems])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('title') as string
    const photoFile = formData.get('photo') as File | null
    const videoUrl = formData.get('video_url') as string

    let finalUrl = ''
    let thumbnailUrl = null

    try {
      if (type === 'photo') {
        if (!photoFile || photoFile.size === 0) throw new Error('File foto wajib dipilih!')
        
        // Buat nama file unik
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        // 1. Upload ke Storage Bucket 'gallery'
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, photoFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // 2. Ambil Public URL
        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath)
        finalUrl = publicUrl
      } else {
        if (!videoUrl) throw new Error('Link video wajib diisi!')
        finalUrl = videoUrl
        
        // Logika sederhana ambil thumbnail YouTube jika link-nya valid
        if (videoUrl.includes('youtube.com/embed/')) {
          const videoId = videoUrl.split('embed/')[1]?.split('?')[0]
          thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`
        }
      }

      // 3. Simpan ke Tabel Gallery
      const { error: insertError } = await supabase.from('gallery').insert([{
        type,
        title: title || null,
        url: finalUrl,
        thumbnail_url: thumbnailUrl
      }])

      if (insertError) throw insertError

      alert('Item Galeri Berhasil Ditambahkan! ⚡')
      form.reset()
      fetchItems()
    } catch (err: any) {
      alert('Gagal: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, url: string) {
    if (!confirm('Hapus item ini dari galeri?')) return
    
    try {
      // Jika tipe foto, hapus juga file fisiknya di storage
      if (url.includes('storage/v1/object/public/gallery/')) {
        const fileName = url.split('/').pop()
        if (fileName) {
          await supabase.storage.from('gallery').remove([fileName])
        }
      }

      await supabase.from('gallery').delete().eq('id', id)
      fetchItems()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '0.15em', marginBottom: '2.5rem' }}>GALLERY CMS</h1>

      <Card style={{ marginBottom: '3rem', background: '#080808' }}>
        <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: '#e8200c', marginBottom: '1.5rem' }}>+ UPLOAD BARU</h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button variant={type === 'photo' ? 'primary' : 'ghost'} onClick={() => setType('photo')}>📷 PHOTO</Button>
          <Button variant={type === 'video' ? 'primary' : 'ghost'} onClick={() => setType('video')}>🎬 VIDEO</Button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input name="title" placeholder="Judul Foto / Video (Opsional)" 
            style={inputStyle} />
          
          {type === 'photo' ? (
            <div style={{ border: '2px dashed #222', padding: '2rem', textAlign: 'center', borderRadius: '8px' }}>
               <input name="photo" type="file" accept="image/*" required style={{ color: '#666' }} />
               <p style={{ fontSize: '0.7rem', color: '#444', marginTop: '1rem' }}>Format: JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          ) : (
            <input name="video_url" placeholder="YouTube Embed URL (misal: https://www.youtube.com/embed/xyz)" required 
              style={inputStyle} />
          )}
          
          <Button type="submit" loading={loading} style={{ height: '3.5rem' }}>PUBLIKASIKAN KE GALERI</Button>
        </form>
      </Card>

      <h2 style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: '#444', marginBottom: '1.5rem' }}>KOLEKSI SAAT INI</h2>
      
      {fetchLoading ? (
        <p style={{ color: '#222' }}>Sinkronisasi...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <Card key={item.id} padding="sm" style={{ background: '#0a0a0a', border: '1px solid #111' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', marginBottom: '1rem' }}>
                <img 
                  src={item.type === 'video' ? (item.thumbnail_url || '') : item.url} 
                  alt={item.title || ''} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                {item.type === 'video' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                    <span style={{ fontSize: '2rem' }}>🎬</span>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title || 'Untitled'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#444', marginBottom: '1rem', textTransform: 'uppercase' }}>{item.type}</p>
              <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, item.url)} style={{ width: '100%' }}>HAPUS</Button>
            </Card>
          ))}
        </div>
      )}
      {!fetchLoading && items.length === 0 && <p style={{ color: '#222', textAlign: 'center' }}>Galeri masih kosong bro.</p>}
    </div>
  )
}

const inputStyle = {
  padding: '0.85rem',
  background: '#111',
  border: '1px solid #222',
  borderRadius: '4px',
  color: '#fff',
  outline: 'none',
  width: '100%'
}