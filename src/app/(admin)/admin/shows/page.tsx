'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShowDate } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminShowsPage() {
  const [shows, setShows] = useState<ShowDate[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const supabase = createClient()

  async function fetchShows() {
    setFetchLoading(true)
    const { data } = await supabase
      .from('show_dates')
      .select('*')
      .order('show_date', { ascending: true })
    setShows(data || [])
    setFetchLoading(false)
  }

  useEffect(() => { fetchShows() }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const event_name = (form.elements.namedItem('event_name') as HTMLInputElement).value
    const venue = (form.elements.namedItem('venue') as HTMLInputElement).value
    const city = (form.elements.namedItem('city') as HTMLInputElement).value
    const show_date = (form.elements.namedItem('show_date') as HTMLInputElement).value
    const ticket_url = (form.elements.namedItem('ticket_url') as HTMLInputElement).value

    const { error } = await supabase.from('show_dates').insert({
      event_name, venue, city, show_date, ticket_url, is_sold_out: false
    })

    if (error) alert('Error: ' + error.message)
    else { alert('Show berhasil ditambahkan!'); form.reset(); fetchShows() }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin mau hapus show ini?')) return
    await supabase.from('show_dates').delete().eq('id', id)
    fetchShows()
  }

  async function toggleSoldOut(id: string, current: boolean) {
    await supabase.from('show_dates').update({ is_sold_out: !current }).eq('id', id)
    fetchShows()
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '2rem' }}>SHOW DATES</h1>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1.5rem' }}>+ TAMBAH SHOW</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input name="event_name" placeholder="Nama Event *" required
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="venue" placeholder="Venue *" required
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
            <input name="city" placeholder="Kota *" required
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          </div>
          <input name="show_date" type="datetime-local" required
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <input name="ticket_url" placeholder="Link Tiket (opsional)"
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <Button type="submit" loading={loading}>TAMBAH SHOW</Button>
        </form>
      </Card>

      <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1rem' }}>DAFTAR SHOW</h2>
      {fetchLoading ? (
        <p style={{ color: '#555' }}>Loading...</p>
      ) : shows.length === 0 ? (
        <p style={{ color: '#555' }}>Belum ada show.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {shows.map((show) => (
            <Card key={show.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 'bold' }}>{show.event_name}</p>
                <p style={{ color: '#555', fontSize: '0.85rem' }}>{show.venue}, {show.city}</p>
                <p style={{ color: '#555', fontSize: '0.85rem' }}>
                  {new Date(show.show_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant={show.is_sold_out ? 'ghost' : 'secondary'}
                  size="sm"
                  onClick={() => toggleSoldOut(show.id, show.is_sold_out)}
                >
                  {show.is_sold_out ? 'Mark Available' : 'Mark Sold Out'}
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(show.id)}>Hapus</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}