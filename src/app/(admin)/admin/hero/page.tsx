'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// ─── Constants ────────────────────────────────────────────────
const HERO_RATIO = 16 / 9   // target aspect ratio banner hero
const HERO_W     = 1920      // output width (px)
const HERO_H     = 1080      // output height (px)

// ─── Types ───────────────────────────────────────────────────
interface CropBox { x: number; y: number; w: number; h: number }

// ─── Crop Modal Component ─────────────────────────────────────
function CropModal({
  file,
  onConfirm,
  onCancel,
}: {
  file: File
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const previewRef    = useRef<HTMLCanvasElement>(null)
  const imgRef        = useRef<HTMLImageElement | null>(null)

  // crop box in DISPLAY coordinates
  const [crop, setCrop]     = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 })
  const [imgRect, setImgRect] = useState({ x: 0, y: 0, w: 0, h: 0, natW: 0, natH: 0 })
  const dragging  = useRef<{ startX: number; startY: number; initCrop: CropBox } | null>(null)
  const resizing  = useRef<string | null>(null)   // handle: 'nw','ne','sw','se'
  const [ready, setReady]   = useState(false)

  // ── Load image & init crop ──────────────────────────────────
  useEffect(() => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      layoutImage(img)
      setReady(true)
    }
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  function layoutImage(img: HTMLImageElement) {
    const container = containerRef.current
    if (!container) return
    const cw = container.clientWidth
    const ch = container.clientHeight

    // fit image inside container preserving aspect
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth  * scale
    const dh = img.naturalHeight * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    const rect = { x: dx, y: dy, w: dw, h: dh, natW: img.naturalWidth, natH: img.naturalHeight }
    setImgRect(rect)

    // init crop = max 16:9 centered inside image display area
    const cropH = dh
    const cropW = cropH * HERO_RATIO
    const cx = dx + (dw - Math.min(cropW, dw)) / 2
    const cw2 = Math.min(cropW, dw)
    const ch2 = cw2 / HERO_RATIO
    setCrop({ x: cx, y: dy + (dh - ch2) / 2, w: cw2, h: ch2 })
  }

  // ── Draw image + crop overlay on canvas ────────────────────
  useEffect(() => {
    if (!ready || !canvasRef.current || !imgRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    canvas.width  = containerRef.current!.clientWidth
    canvas.height = containerRef.current!.clientHeight

    // draw image
    ctx.drawImage(imgRef.current, imgRect.x, imgRect.y, imgRect.w, imgRect.h)

    // darken outside crop
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(crop.x, crop.y, crop.w, crop.h)

    // re-draw image inside crop (sharp)
    ctx.save()
    ctx.beginPath()
    ctx.rect(crop.x, crop.y, crop.w, crop.h)
    ctx.clip()
    ctx.drawImage(imgRef.current, imgRect.x, imgRect.y, imgRect.w, imgRect.h)
    ctx.restore()

    // crop border
    ctx.strokeStyle = '#e8200c'
    ctx.lineWidth   = 2
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h)

    // rule-of-thirds grid
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth   = 1
    for (let i = 1; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(crop.x + (crop.w / 3) * i, crop.y)
      ctx.lineTo(crop.x + (crop.w / 3) * i, crop.y + crop.h)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(crop.x, crop.y + (crop.h / 3) * i)
      ctx.lineTo(crop.x + crop.w, crop.y + (crop.h / 3) * i)
      ctx.stroke()
    }

    // corner handles
    const hs = 10
    ctx.fillStyle = '#e8200c'
    const corners = [
      [crop.x,           crop.y          ],
      [crop.x + crop.w,  crop.y          ],
      [crop.x,           crop.y + crop.h ],
      [crop.x + crop.w,  crop.y + crop.h ],
    ]
    corners.forEach(([cx, cy]) => ctx.fillRect(cx - hs/2, cy - hs/2, hs, hs))

    // update live preview
    updatePreview()
  }, [crop, imgRect, ready])

  function updatePreview() {
    if (!previewRef.current || !imgRef.current || !ready) return
    const pctx = previewRef.current.getContext('2d')!
    previewRef.current.width  = 320
    previewRef.current.height = 180

    // convert display crop → natural coords
    const scaleX = imgRect.natW / imgRect.w
    const scaleY = imgRect.natH / imgRect.h
    const sx = (crop.x - imgRect.x) * scaleX
    const sy = (crop.y - imgRect.y) * scaleY
    const sw = crop.w * scaleX
    const sh = crop.h * scaleY

    pctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, 320, 180)
  }

  // ── Mouse/touch event helpers ───────────────────────────────
  function getHandleAt(mx: number, my: number): string | null {
    const hs = 14
    const corners: [string, number, number][] = [
      ['nw', crop.x,           crop.y          ],
      ['ne', crop.x + crop.w,  crop.y          ],
      ['sw', crop.x,           crop.y + crop.h ],
      ['se', crop.x + crop.w,  crop.y + crop.h ],
    ]
    for (const [id, cx, cy] of corners) {
      if (Math.abs(mx - cx) <= hs && Math.abs(my - cy) <= hs) return id
    }
    return null
  }

  function clampCrop(c: CropBox): CropBox {
    const minW = 80
    let { x, y, w, h } = c
    w = Math.max(minW, w)
    h = w / HERO_RATIO
    x = Math.max(imgRect.x, Math.min(x, imgRect.x + imgRect.w - w))
    y = Math.max(imgRect.y, Math.min(y, imgRect.y + imgRect.h - h))
    if (x + w > imgRect.x + imgRect.w) w = imgRect.x + imgRect.w - x
    h = w / HERO_RATIO
    if (y + h > imgRect.y + imgRect.h) h = imgRect.y + imgRect.h - y
    w = h * HERO_RATIO
    return { x, y, w, h }
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const handle = getHandleAt(mx, my)
    if (handle) {
      resizing.current = handle
    } else if (mx >= crop.x && mx <= crop.x + crop.w && my >= crop.y && my <= crop.y + crop.h) {
      dragging.current = { startX: mx, startY: my, initCrop: { ...crop } }
    }
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging.current && !resizing.current) return
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    if (dragging.current) {
      const dx = mx - dragging.current.startX
      const dy = my - dragging.current.startY
      setCrop(prev => clampCrop({
        ...prev,
        x: dragging.current!.initCrop.x + dx,
        y: dragging.current!.initCrop.y + dy,
      }))
    } else if (resizing.current) {
      const handle = resizing.current
      setCrop(prev => {
        let { x, y, w, h } = prev
        if (handle === 'se') {
          w = mx - x
          h = w / HERO_RATIO
        } else if (handle === 'sw') {
          w = (x + w) - mx
          h = w / HERO_RATIO
          x = mx
          y = (y + prev.h) - h
        } else if (handle === 'ne') {
          w = mx - x
          h = w / HERO_RATIO
          y = (prev.y + prev.h) - h
        } else if (handle === 'nw') {
          w = (x + prev.w) - mx
          h = w / HERO_RATIO
          x = mx
          y = (prev.y + prev.h) - h
        }
        return clampCrop({ x, y, w, h })
      })
    }
  }

  function onMouseUp() {
    dragging.current  = null
    resizing.current  = null
  }

  // ── Cursor style based on position ─────────────────────────
  function onMouseMoveForCursor(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const handle = getHandleAt(mx, my)
    const canvas = canvasRef.current!
    if (handle === 'nw' || handle === 'se') canvas.style.cursor = 'nwse-resize'
    else if (handle === 'ne' || handle === 'sw') canvas.style.cursor = 'nesw-resize'
    else if (mx >= crop.x && mx <= crop.x + crop.w && my >= crop.y && my <= crop.y + crop.h) canvas.style.cursor = 'move'
    else canvas.style.cursor = 'default'

    onMouseMove(e)
  }

  // ── Confirm: render cropped image to blob ──────────────────
  async function handleConfirm() {
    if (!imgRef.current) return
    const out = document.createElement('canvas')
    out.width  = HERO_W
    out.height = HERO_H
    const ctx = out.getContext('2d')!

    const scaleX = imgRect.natW / imgRect.w
    const scaleY = imgRect.natH / imgRect.h
    const sx = (crop.x - imgRect.x) * scaleX
    const sy = (crop.y - imgRect.y) * scaleY
    const sw = crop.w * scaleX
    const sh = crop.h * scaleY

    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, HERO_W, HERO_H)
    out.toBlob(blob => { if (blob) onConfirm(blob) }, 'image/jpeg', 0.92)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #1a1a1a',
        background: '#050505',
        flexShrink: 0,
      }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#e8200c', letterSpacing: '0.2em', margin: 0 }}>
            CROP EDITOR — HERO BANNER
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#333', margin: '2px 0 0' }}>
            Drag kotak merah untuk geser • Tarik sudut untuk resize • Rasio 16:9 terkunci otomatis
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Live preview */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#444', marginBottom: '4px' }}>LIVE PREVIEW</p>
            <canvas
              ref={previewRef}
              style={{ width: '160px', height: '90px', border: '1px solid #222', borderRadius: '2px', display: 'block' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={handleConfirm}
              style={{
                background: '#e8200c', color: '#fff', border: 'none',
                padding: '0.6rem 1.4rem', fontFamily: 'monospace',
                fontSize: '0.78rem', letterSpacing: '0.15em',
                cursor: 'pointer', borderRadius: '2px',
                fontWeight: 'bold',
              }}
            >
              ✓ APPLY CROP
            </button>
            <button
              onClick={onCancel}
              style={{
                background: 'transparent', color: '#555', border: '1px solid #222',
                padding: '0.5rem 1.4rem', fontFamily: 'monospace',
                fontSize: '0.72rem', letterSpacing: '0.1em',
                cursor: 'pointer', borderRadius: '2px',
              }}
            >
              BATAL
            </button>
          </div>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}
      >
        {ready ? (
          <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: '100%' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMoveForCursor}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#333', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            LOADING IMAGE...
          </div>
        )}
      </div>

      {/* Footer info */}
      <div style={{
        padding: '0.6rem 1.5rem',
        borderTop: '1px solid #111',
        background: '#050505',
        display: 'flex',
        gap: '2rem',
        flexShrink: 0,
      }}>
        {[
          ['OUTPUT', `${HERO_W} × ${HERO_H}px`],
          ['FORMAT', 'JPEG 92%'],
          ['RATIO', '16 : 9'],
          ['CROP SIZE', `${Math.round(crop.w)} × ${Math.round(crop.h)}px (display)`],
        ].map(([label, val]) => (
          <div key={label}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#333', margin: 0 }}>{label}</p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#666', margin: 0 }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────
export default function AdminHeroPage() {
  const [banners,        setBanners]        = useState<any[]>([])
  const [currentLogo,    setCurrentLogo]    = useState<string | null>(null)
  const [loading,        setLoading]        = useState(false)
  const [logoLoading,    setLogoLoading]    = useState(false)
  const [fetching,       setFetching]       = useState(true)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  // Crop modal state
  const [pendingFile,   setPendingFile]   = useState<File | null>(null)
  const [showCrop,      setShowCrop]      = useState(false)
  const [previewUrl,    setPreviewUrl]    = useState<string | null>(null)
  const [croppedBlob,   setCroppedBlob]   = useState<Blob | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase     = createClient()

  // ── Fetch data ─────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setFetching(true)
    try {
      const { data: bannerData } = await supabase
        .from('hero_settings').select('*').order('order_index', { ascending: true })
      setBanners(bannerData || [])

      const { data: logoData } = await supabase
        .from('logo_settings').select('logo_url').eq('id', 1).maybeSingle()
      if (logoData?.logo_url) setCurrentLogo(logoData.logo_url)
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setFetching(false)
    }
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  // ── File picked → check if needs crop ─────────────────────
  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear any previous state
    setCroppedBlob(null)
    setPreviewUrl(null)

    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight
      const isAlready169 = Math.abs(ratio - HERO_RATIO) < 0.02

      if (isAlready169) {
        // Sudah 16:9 — langsung set preview, tawari skip crop
        setPreviewUrl(url)
        setPendingFile(file)
        setShowCrop(false)
      } else {
        // Perlu crop
        setPendingFile(file)
        setShowCrop(true)
      }
    }
    img.src = url
  }

  // ── Crop confirmed ─────────────────────────────────────────
  function handleCropConfirm(blob: Blob) {
    setCroppedBlob(blob)
    setPreviewUrl(URL.createObjectURL(blob))
    setShowCrop(false)
  }

  // ── Upload final (cropped or original) ────────────────────
  async function handleBannerUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pendingFile && !croppedBlob) {
      alert('Pilih foto banner dulu bro!')
      return
    }

    setLoading(true)
    setUploadProgress('Mempersiapkan file...')

    try {
      const uploadBlob = croppedBlob ?? pendingFile!
      const fileName   = `hero-${Date.now()}.jpg`

      setUploadProgress('Mengunggah ke storage...')
      const { error: upErr } = await supabase.storage
        .from('hero').upload(fileName, uploadBlob, { contentType: 'image/jpeg' })
      if (upErr) throw upErr

      const { data: urlData } = supabase.storage.from('hero').getPublicUrl(fileName)

      setUploadProgress('Menyimpan ke database...')
      const nextOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order_index)) + 1 : 0
      const { error: dbErr } = await supabase.from('hero_settings').insert([{
        background_url: urlData.publicUrl,
        order_index:    nextOrder,
        created_at:     new Date().toISOString(),
      }])
      if (dbErr) throw dbErr

      alert('Banner berhasil ditambahkan! 📸')
      // Reset
      setPendingFile(null)
      setCroppedBlob(null)
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchData()

    } catch (err: any) {
      alert('Gagal upload: ' + err.message)
    } finally {
      setLoading(false)
      setUploadProgress(null)
    }
  }

  // ── Delete banner ──────────────────────────────────────────
  async function handleDeleteBanner(id: number, url: string) {
    if (!window.confirm('Yakin mau hapus slide ini?')) return
    setLoading(true)
    try {
      const fileName = url.split('/').pop()
      if (fileName) await supabase.storage.from('hero').remove([fileName])
      const { error } = await supabase.from('hero_settings').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Logo upload ────────────────────────────────────────────
  async function handleLogoUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLogoLoading(true)
    const form = e.currentTarget
    const fileInput = form.elements.namedItem('logo-image') as HTMLInputElement
    const file = fileInput.files?.[0]
    if (!file) { alert('Pilih file logo PNG dulu bro!'); setLogoLoading(false); return }

    try {
      const fileName = `main-logo-${Date.now()}.${file.name.split('.').pop()}`
      const { error: upErr } = await supabase.storage.from('hero').upload(fileName, file)
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('hero').getPublicUrl(fileName)
      const { error: dbErr }  = await supabase.from('logo_settings')
        .upsert({ id: 1, logo_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      if (dbErr) throw dbErr
      setCurrentLogo(urlData.publicUrl)
      alert('Logo berhasil diperbarui! 🔥')
      form.reset()
    } catch (err: any) {
      alert('Gagal update logo: ' + err.message)
    } finally {
      setLogoLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1100px', paddingBottom: '6rem', color: '#fff' }}>

      {/* Crop Modal */}
      {showCrop && pendingFile && (
        <CropModal
          file={pendingFile}
          onConfirm={handleCropConfirm}
          onCancel={() => {
            setShowCrop(false)
            setPendingFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
          }}
        />
      )}

      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '0.15em', margin: 0, color: '#fff' }}>
          HERO MASTER CMS
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '1rem' }}>
          Pusat kendali visual utama: Logo Band & Banner Slider Halaman Depan.
        </p>
      </header>

      {/* ── SECTION 1: LOGO ─────────────────────────────────── */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#888', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>
          STAGE 01: LOGO MANAGEMENT
        </h2>
        <Card style={{ border: '1px solid #222', background: '#080808' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
            <div style={{
              width: '200px', height: '200px', background: '#000',
              border: '2px solid #111', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}>
              {currentLogo ? (
                <img src={currentLogo} alt="Logo Active" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#333' }}>NO LOGO ACTIVE</span>
              )}
            </div>

            <form onSubmit={handleLogoUpload} style={{ flex: 1, minWidth: '300px' }}>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                Gunakan file PNG transparan (White/Silver) agar kontras dengan background gelap.
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

      {/* ── SECTION 2: BANNER SLIDER ────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '1.2rem', color: '#888', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>
          STAGE 02: BANNER SLIDER
        </h2>

        {/* Upload form */}
        <Card style={{ marginBottom: '3rem', border: '1px dashed #333', background: '#050505' }}>
          <form onSubmit={handleBannerUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Drop zone */}
            <div
              style={{
                padding: '2.5rem',
                border: `2px dashed ${pendingFile ? '#e8200c' : '#1a1a1a'}`,
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFilePick}
              />
              {previewUrl ? (
                /* Preview dengan tombol re-crop */
                <div>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        width: '100%', maxWidth: '640px', maxHeight: '240px',
                        objectFit: 'cover', borderRadius: '4px',
                        border: '1px solid #2a2a2a', display: 'block', margin: '0 auto',
                      }}
                    />
                    {/* Badge */}
                    <div style={{
                      position: 'absolute', top: '8px', left: '8px',
                      background: croppedBlob ? '#e8200c' : '#16a34a',
                      color: '#fff', fontFamily: 'monospace',
                      fontSize: '0.6rem', letterSpacing: '0.1em',
                      padding: '3px 8px', borderRadius: '2px',
                    }}>
                      {croppedBlob ? '✂ DICROP' : '✓ SUDAH 16:9'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setShowCrop(true) }}
                      style={{
                        background: 'transparent', color: '#888',
                        border: '1px solid #333', padding: '0.4rem 1rem',
                        fontFamily: 'monospace', fontSize: '0.72rem',
                        letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px',
                      }}
                    >
                      ✂ CROP ULANG
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        setPendingFile(null); setCroppedBlob(null); setPreviewUrl(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      style={{
                        background: 'transparent', color: '#555',
                        border: '1px solid #222', padding: '0.4rem 1rem',
                        fontFamily: 'monospace', fontSize: '0.72rem',
                        letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px',
                      }}
                    >
                      GANTI FOTO
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>📷</div>
                  <p style={{ color: '#555', fontFamily: 'monospace', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                    Klik untuk pilih foto banner
                  </p>
                  <p style={{ color: '#2a2a2a', fontFamily: 'monospace', fontSize: '0.65rem', margin: 0 }}>
                    JPG / WEBP / PNG — Jika bukan 16:9, crop editor otomatis terbuka
                  </p>
                </div>
              )}
            </div>

            {/* Format guide */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem', padding: '1rem',
              background: '#080808', borderRadius: '6px',
              border: '1px solid #111',
            }}>
              {[
                ['✓ IDEAL', '1920 × 1080px (16:9)', '#16a34a'],
                ['✓ OK', '2560 × 1440px (16:9)', '#16a34a'],
                ['⚠ AUTO CROP', 'Rasio lain → crop editor', '#e8200c'],
              ].map(([badge, desc, color]) => (
                <div key={badge} style={{ textAlign: 'center' }}>
                  <span style={{
                    fontFamily: 'monospace', fontSize: '0.6rem', color,
                    letterSpacing: '0.1em', display: 'block', marginBottom: '4px',
                  }}>
                    {badge}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#444' }}>
                    {desc}
                  </span>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!pendingFile && !croppedBlob}
              style={{ height: '4rem', fontSize: '1rem', fontWeight: 'bold' }}
            >
              {uploadProgress || 'UPLOAD KE SLIDER →'}
            </Button>
          </form>
        </Card>

        {/* Banner list */}
        {fetching ? (
          <p style={{ color: '#444' }}>Sinkronisasi data slider...</p>
        ) : banners.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center', background: '#0a0a0a', border: '1px solid #111', borderRadius: '15px' }}>
            <p style={{ color: '#333', letterSpacing: '0.1em' }}>TIDAK ADA BANNER AKTIF.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {banners.map((slide, index) => (
              <Card key={slide.id} style={{ padding: '0', overflow: 'hidden', background: '#0a0a0a', border: '1px solid #1a1a1a', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: '12px', left: '12px', zIndex: 10,
                  background: 'rgba(0,0,0,0.85)', color: '#fff',
                  padding: '4px 10px', borderRadius: '2px',
                  fontSize: '0.65rem', fontFamily: 'monospace', letterSpacing: '0.1em',
                  border: '1px solid #333',
                }}>
                  SLIDE {index + 1}
                </div>
                <div style={{
                  width: '100%', aspectRatio: '16/9',
                  backgroundImage: `url(${slide.background_url})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.6rem', color: '#2a2a2a', marginBottom: '1rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {slide.background_url.substring(0, 60)}...
                  </p>
                  <Button
                    variant="danger"
                    style={{ width: '100%' }}
                    onClick={() => handleDeleteBanner(slide.id, slide.background_url)}
                  >
                    HAPUS SLIDE
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <footer style={{ marginTop: '6rem', textAlign: 'center', borderTop: '1px solid #111', paddingTop: '3rem' }}>
        <p style={{ color: '#222', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          DAKARA INTERNAL CMS v2.1 // POWERED BY SUPABASE & NEXT.JS 14
        </p>
      </footer>
    </div>
  )
}