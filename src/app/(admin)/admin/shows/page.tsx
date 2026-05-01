'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShowDate } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminShowsPage() {
  const [shows, setShows] = useState<ShowDate[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  
  // State khusus buat fitur EDIT
  const [editId, setEditId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  
  const supabase = createClient()

  const fetchShows = useCallback(async () => {
    setFetchLoading(true)
    try {
      const { data, error } = await supabase
        .from('show_dates')
        .select('*')
        .order('show_date', { ascending: true })
      
      if (error) throw error
      setShows(data || [])
    } catch (err: any) {
      alert('Fetch Error: ' + err.message)
    } finally {
      setFetchLoading(false)
    }
  }, [supabase])

  useEffect(() => { fetchShows() }, [fetchShows])

  // FUNGSI UNTUK MENGISI FORM SAAT TOMBOL EDIT DIKLIK
  const handleEditClick = (show: ShowDate) => {
    setEditId(show.id)
    if (formRef.current) {
      // Isi otomatis input form dengan data yang mau diedit
      const f = formRef.current
      ;(f.elements.namedItem('event_name') as HTMLInputElement).value = show.event_name
      ;(f.elements.namedItem('venue') as HTMLInputElement).value = show.venue
      ;(f.elements.namedItem('city') as HTMLInputElement).value = show.city
      ;(f.elements.namedItem('ticket_url') as HTMLInputElement).value = show.ticket_url || ''
      ;(f.elements.namedItem('poster_url') as HTMLInputElement).value = show.poster_url || ''
      
      // Format datetime-local (YYYY-MM-DDThh:mm)
      const date = new Date(show.show_date)
      const formattedDate = date.toISOString().slice(0, 16)
      ;(f.elements.namedItem('show_date') as HTMLInputElement).value = formattedDate
      
      // Scroll ke atas biar kelihatan formnya
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // BATALKAN EDIT
  const cancelEdit = () => {
    setEditId(null)
    formRef.current?.reset()
  }

  // HANDLER SUBMIT (Bisa INSERT atau UPDATE)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const payload = {
      event_name: formData.get('event_name') as string,
      venue: formData.get('venue') as string,
      city: formData.get('city') as string,
      show_date: formData.get('show_date') as string,
      ticket_url: formData.get('ticket_url') as string || null,
      poster_url: formData.get('poster_url') as string || null,
    }

    try {
      if (editId) {
        // JIKA LAGI MODE EDIT -> JALANKAN UPDATE
        const { error } = await supabase
          .from('show_dates')
          .update(payload)
          .eq('id', editId)
        
        if (error) throw error
        alert('Jadwal Berhasil Diperbarui! ✨')
      } else {
        // JIKA MODE BIASA -> JALANKAN INSERT
        const { error } = await supabase
          .from('show_dates')
          .insert([{ ...payload, is_sold_out: false }])
        
        if (error) throw error
        alert('Show DAKARA Berhasil Ditambahkan! 🔥')
      }
      
      cancelEdit()
      fetchShows()
    } catch (err: any) {
      alert('Gagal Simpan: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function toggleSoldOut(id: string, currentStatus: boolean) {
    await supabase.from('show_dates').update({ is_sold_out: !currentStatus }).eq('id', id)
    fetchShows()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus jadwal ini bro?')) return
    await supabase.from('show_dates').delete().eq('id', id)
    fetchShows()
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '0.2em', marginBottom: '3rem' }}>
        SHOW DATES MANAGER
      </h1>

      <Card style={{ marginBottom: '4rem', background: '#080808', border: editId ? '1px solid #e8200c' : '1px solid #1a1a1a' }}>
        <h2 style={{ fontSize: '0.8rem', color: '#e8200c', marginBottom: '2rem', letterSpacing: '0.3em' }}>
          {editId ? '⚡ EDITING MODE' : '+ ADD NEW CONCERT'}
        </h2>
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <input name="event_name" placeholder="Event Name *" required style={inputStyle} />
          </div>
          <input name="venue" placeholder="Venue *" required style={inputStyle} />
          <input name="city" placeholder="City *" required style={inputStyle} />
          <input name="show_date" type="datetime-local" required style={inputStyle} />
          <input name="ticket_url" placeholder="Ticket URL (Optional)" style={inputStyle} />
          <div style={{ gridColumn: 'span 2' }}>
            <input name="poster_url" placeholder="Poster Image URL (Optional)" style={inputStyle} />
          </div>
          <div style={{ gridColumn: 'span 2', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <Button type="submit" loading={loading} style={{ flex: 1, height: '3.5rem' }}>
              {editId ? 'UPDATE SCHEDULE' : 'SAVE TO CALENDAR'}
            </Button>
            {editId && (
              <Button type="button" onClick={cancelEdit} variant="ghost" style={{ height: '3.5rem' }}>
                CANCEL
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {fetchLoading ? <p>Syncing...</p> : shows.map(show => (
          <Card key={show.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a', border: editId === show.id ? '1px solid #e8200c' : '1px solid #111' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              {show.poster_url && (
                <img src={show.poster_url} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} alt="Poster" />
              )}
              <div>
                <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{show.event_name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#555' }}>{show.venue}, {show.city}</p>
                <p style={{ fontSize: '0.75rem', color: '#e8200c' }}>{new Date(show.show_date).toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Button size="sm" variant="ghost" onClick={() => handleEditClick(show)}>EDIT</Button>
              <Button size="sm" variant={show.is_sold_out ? 'ghost' : 'secondary'} onClick={() => toggleSoldOut(show.id, show.is_sold_out)}>
                {show.is_sold_out ? 'AVAILABLE' : 'SOLD OUT'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(show.id)}>DELETE</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px', outline: 'none'
}