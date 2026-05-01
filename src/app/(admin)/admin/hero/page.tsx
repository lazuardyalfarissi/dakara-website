'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function AdminHeroPage() {
  // --- STATE MANAGEMENT ---
  const [banners, setBanners] = useState<any[]>([])
  const [currentLogo, setCurrentLogo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [logoLoading, setLogoLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  
  const supabase = createClient()

  // --- FETCH DATA (BANNER & LOGO) ---
  const fetchData = useCallback(async () => {
    setFetching(true)
    try {
      // Ambil Banner Slider
      const { data: bannerData, error: bannerError } = await supabase
        .from('hero_settings')
        .select('*')
        .order('order_index', { ascending: true })

      if (bannerError) throw bannerError
      setBanners(bannerData || [])

      // Ambil Logo Utama
      const { data: logoData, error: logoError } = await supabase
        .from('logo_settings')
        .select('logo_url')
        .eq('id', 1)
        .maybeSingle()

      if (logoError) throw logoError
      if (logoData?.logo_url) setCurrentLogo(logoData.logo_url)
      
    } catch (error: any) {
      console.error('Error fetching data:', error.message)
    } finally {
      setFetching(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- HANDLER UPLOAD LOGO UTAMA ---
  async function handleLogoUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLogoLoading(true)

    const form = e.currentTarget
    const fileInput = form.elements.namedItem('logo-image') as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file) {
      alert('Pilih file logo PNG dulu bro!')
      setLogoLoading(false)
      return
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `main-logo-${Date.now()}.${fileExt}`
      
      const { error: upError } = await supabase.storage.from('hero').upload(fileName, file)
      if (upError) throw upError

      const { data: urlData } = supabase.storage.from('hero').getPublicUrl(fileName)
      
      const { error: dbError } = await supabase
        .from('logo_settings')
        .upsert({ 
          id: 1, 
          logo_url: urlData.publicUrl, 
          updated_at: new Date().toISOString() 
        })

      if (dbError) throw dbError

      setCurrentLogo(urlData.publicUrl)
      alert('Logo DAKARA berhasil diperbarui! 🔥')
      form.reset()
    } catch (error: any) {
      alert('Gagal update logo: ' + error.message)
    } finally {
      setLogoLoading(false)
    }
  }

  // --- HANDLER UPLOAD BANNER BARU ---
  async function handleBannerUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setUploadProgress('Mempersiapkan file...')

    const form = e.currentTarget
    const fileInput = form.elements.namedItem('hero-image') as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file) {
      alert('Pilih file gambar dulu bro!')
      setLoading(false)
      return
    }

    try {
      setUploadProgress('Mengunggah ke storage...')
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('hero').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('hero').getPublicUrl(fileName)
      
      setUploadProgress('Menyimpan konfigurasi...')
      const nextOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order_index)) + 1 : 0
      
      const { error: dbError } = await supabase
        .from('hero_settings')
        .insert([{ 
          background_url: urlData.publicUrl, 
          order_index: nextOrder,
          created_at: new Date().toISOString() 
        }])

      if (dbError) throw dbError

      alert('Banner baru berhasil ditambahkan! 📸')
      form.reset()
      fetchData()
    } catch (error: any) {
      alert('Gagal upload: ' + error.message)
    } finally {
      setLoading(false)
      setUploadProgress(null)
    }
  }

  // --- HANDLER HAPUS BANNER ---
  async function handleDeleteBanner(id: number, url: string) {
    if (!window.confirm('Yakin mau hapus slide ini?')) return

    try {
      setLoading(true)
      const fileName = url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('hero').remove([fileName])
      }

      const { error } = await supabase.from('hero_settings').delete().eq('id', id)
      if (error) throw error
      
      fetchData()
    } catch (error: any) {
      alert('Gagal menghapus: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1100px', paddingBottom: '6rem', color: '#fff' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '0.15em', margin: 0, color: '#fff' }}>
          HERO MASTER CMS
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '1rem' }}>
          Pusat kendali visual utama: Logo Band & Banner Slider Halaman Depan.
        </p>
      </header>

      {/* --- SECTION 1: LOGO SETTINGS --- */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#888', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>
          STAGE 01: LOGO MANAGEMENT
        </h2>
        <Card style={{ border: '1px solid #222', background: '#080808' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
            <div style={{ 
              width: '200px', height: '200px', background: '#000', 
              border: '2px solid #111', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}>
              {currentLogo ? (
                <img src={currentLogo} alt="Logo Active" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#333' }}>NO LOGO ACTIVE</span>
              )}
            </div>

            <form onSubmit={handleLogoUpload} style={{ flex: 1, minWidth: '300px' }}>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                Gunakan file PNG transparan (White/Silver recommended) agar kontras dengan background gelap.
              </p>
              <input 
                type="file" name="logo-image" accept="image/png" required
                style={{ display: 'block', width: '100%', padding: '1rem', background: '#0f0f0f', border: '1px solid #222', marginBottom: '1rem', color: '#888' }} 
              />
              <Button type="submit" loading={logoLoading} style={{ width: '100%' }}>
                UPDATE LOGO UTAMA
              </Button>
            </form>
          </div>
        </Card>
      </section>

      {/* --- SECTION 2: SLIDER SETTINGS --- */}
      <section>
        <h2 style={{ fontSize: '1.2rem', color: '#888', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>
          STAGE 02: BANNER SLIDER
        </h2>
        
        {/* Form Upload Banner */}
        <Card style={{ marginBottom: '3rem', border: '1px dashed #333', background: '#050505' }}>
          <form onSubmit={handleBannerUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '2.5rem', border: '2px dashed #1a1a1a', borderRadius: '8px', textAlign: 'center' }}>
              <input type="file" name="hero-image" accept="image/*" required style={{ color: '#666', cursor: 'pointer' }} />
              <p style={{ fontSize: '0.75rem', color: '#444', marginTop: '1rem' }}>
                Format: JPG/WEBP | Rekomendasi: 1920x1080 (Landscape)
              </p>
            </div>
            <Button type="submit" loading={loading} style={{ height: '4rem', fontSize: '1rem', fontWeight: 'bold' }}>
              {uploadProgress || 'ADD NEW SLIDE TO FRONT-END'}
            </Button>
          </form>
        </Card>

        {/* Display Banners */}
        {fetching ? (
          <p style={{ color: '#444' }}>Sinkronisasi data slider...</p>
        ) : banners.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center', background: '#0a0a0a', border: '1px solid #111', borderRadius: '15px' }}>
            <p style={{ color: '#333', letterSpacing: '0.1em' }}>TIDAK ADA BANNER AKTIF. WEBSITE AKAN TAMPAK KOSONG.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {banners.map((slide, index) => (
              <Card key={slide.id} style={{ padding: '0', overflow: 'hidden', background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 10, background: 'rgba(255,255,255,0.9)', color: '#000', padding: '5px 15px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' }}>
                  SLIDE {index + 1}
                </div>
                <div style={{ width: '100%', height: '200px', backgroundImage: `url(${slide.background_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.65rem', color: '#333', marginBottom: '1.2rem', fontFamily: 'monospace' }}>
                    ID: {slide.id} | {slide.background_url.substring(0, 40)}...
                  </p>
                  <Button variant="danger" style={{ width: '100%' }} onClick={() => handleDeleteBanner(slide.id, slide.background_url)}>
                    REMOVE FROM SLIDER
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <footer style={{ marginTop: '6rem', textAlign: 'center', borderTop: '1px solid #111', paddingTop: '3rem' }}>
        <p style={{ color: '#222', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          DAKARA INTERNAL CMS v2.0 // POWERED BY SUPABASE & NEXT.JS 14
        </p>
      </footer>
    </div>
  )
}