'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const supabase = createClient()

  async function fetchMembers() {
    setFetchLoading(true)
    const { data } = await supabase
      .from('members')
      .select('*')
      .order('order_index', { ascending: true })
    setMembers(data || [])
    setFetchLoading(false)
  }

  useEffect(() => { fetchMembers() }, [])

  const handleEditClick = (member: any) => {
    setEditingId(member.id)
    const form = document.getElementById('member-form') as HTMLFormElement
    if (form) {
      (form.elements.namedItem('name') as HTMLInputElement).value = member.name || '';
      (form.elements.namedItem('role') as HTMLInputElement).value = member.role || '';
      (form.elements.namedItem('order_index') as HTMLInputElement).value = String(member.order_index || 0);
      (form.elements.namedItem('bio') as HTMLTextAreaElement).value = member.bio || '';
      // Input file tidak bisa diisi secara programmatik demi keamanan browser
      (form.elements.namedItem('photo') as HTMLInputElement).value = ''; 
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const role = (form.elements.namedItem('role') as HTMLInputElement).value
    const order_index = parseInt((form.elements.namedItem('order_index') as HTMLInputElement).value) || 0
    const bio = (form.elements.namedItem('bio') as HTMLTextAreaElement).value
    const photoFile = (form.elements.namedItem('photo') as HTMLInputElement).files?.[0]

    let photo_url = null
    
    // Logika Upload Foto
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('members')
        .upload(filePath, photoFile)
      
      if (uploadError) {
        alert('Gagal upload foto: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('members').getPublicUrl(filePath)
      photo_url = urlData.publicUrl
    }

    const payload: any = { name, role, order_index, bio }
    // Hanya tambahkan photo_url ke payload jika ada foto baru yang diupload
    if (photo_url) payload.photo_url = photo_url

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('members').update(payload).eq('id', editingId)
      error = err
    } else {
      const { error: err } = await supabase.from('members').insert(payload)
      error = err
    }

    if (error) {
      alert('Error Simpan Data: ' + error.message)
    } else {
      alert(editingId ? 'Data personil diperbarui!' : 'Personil ditambahkan!')
      form.reset()
      setEditingId(null)
      fetchMembers()
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus personil ini?')) return
    
    // Optional: Hapus file dari storage juga bisa ditambahkan di sini jika perlu
    
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) {
      alert('Gagal menghapus: ' + error.message)
    } else {
      fetchMembers()
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '2rem' }}>BAND MEMBERS</h1>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1.5rem' }}>
          {editingId ? 'EDIT PERSONIL' : '+ TAMBAH PERSONIL'}
        </h2>
        <form id="member-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="name" placeholder="Nama Lengkap *" required
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
            <input name="role" placeholder="Role (ex: Drums, Vocals) *" required
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="order_index" type="number" placeholder="Urutan Tampil (0, 1, 2...)"
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
            <input name="photo" type="file" accept="image/*"
              style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          </div>

          <textarea name="bio" placeholder="Bio singkat personil" rows={3}
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff', resize: 'vertical' }} />
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button type="submit" loading={loading} style={{ flex: 1 }}>
              {editingId ? 'SIMPAN PERUBAHAN' : 'TAMBAH PERSONIL'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={() => { 
                setEditingId(null); 
                (document.getElementById('member-form') as HTMLFormElement).reset() 
              }}>BATAL</Button>
            )}
          </div>
        </form>
      </Card>

      <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1rem' }}>DAFTAR PERSONIL</h2>
      {fetchLoading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {members.length === 0 ? (
            <p style={{ color: '#444' }}>Belum ada data personil.</p>
          ) : (
            members.map((member) => (
              <Card key={member.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#222', overflow: 'hidden', flexShrink: 0 }}>
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🎸</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold' }}>{member.name}</p>
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>{member.role} (Urutan: {member.order_index})</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button size="sm" onClick={() => handleEditClick(member)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(member.id)}>Hapus</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}