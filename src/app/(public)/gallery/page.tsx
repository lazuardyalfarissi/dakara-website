import { createServerSupabaseClient } from '@/lib/supabase/server'
import { GalleryItem } from '@/types'

export default async function GalleryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: items } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  const photos = items?.filter((i: GalleryItem) => i.type === 'photo')
  const videos = items?.filter((i: GalleryItem) => i.type === 'video')

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '6rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
        <p style={{ letterSpacing: '0.3em', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>MOMENTS</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: '900', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '4rem' }}>
          GALLERY
        </h1>

        <h2 style={{ fontSize: '1rem', letterSpacing: '0.2em', color: '#666', marginBottom: '1.5rem' }}>PHOTOS</h2>
        {(!photos || photos.length === 0)
          ? <p style={{ color: '#555', marginBottom: '3rem' }}>No photos yet.</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              {photos.map((item: GalleryItem) => (
                <div key={item.id} style={{ aspectRatio: '1', overflow: 'hidden', background: '#1a1a1a', borderRadius: '4px' }}>
                  <img src={item.url} alt={item.title || 'Gallery'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
        }

        <h2 style={{ fontSize: '1rem', letterSpacing: '0.2em', color: '#666', marginBottom: '1.5rem' }}>VIDEOS</h2>
        {(!videos || videos.length === 0)
          ? <p style={{ color: '#555' }}>No videos yet.</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {videos.map((item: GalleryItem) => (
                <div key={item.id} style={{ aspectRatio: '16/9', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  <iframe src={item.url} title={item.title || 'Video'} allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
              ))}
            </div>
        }
      </div>
    </main>
  )
}