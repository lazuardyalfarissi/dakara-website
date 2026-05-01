'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminAlbumsPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleAddAlbum(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value
    const releaseDate = (form.elements.namedItem('release_date') as HTMLInputElement).value
    const spotifyUrl = (form.elements.namedItem('spotify_url') as HTMLInputElement).value
    const coverFile = (form.elements.namedItem('cover') as HTMLInputElement).files?.[0]

    let cover_url = null

    // Upload cover ke Supabase Storage
    if (coverFile) {
      const fileName = `${Date.now()}-${coverFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('albums')
        .upload(fileName, coverFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('albums')
          .getPublicUrl(fileName)
        cover_url = publicUrl
      }
    }

    const { error } = await supabase.from('albums').insert({
      title, description, release_date: releaseDate, spotify_url: spotifyUrl, cover_url
    })

    if (error) alert('Error: ' + error.message)
    else { alert('Album berhasil ditambahkan!'); form.reset() }
    
    setLoading(false)
  }

  return (
    <div>
      <h1>Manage Albums</h1>
      <form onSubmit={handleAddAlbum}>
        <input name="title" placeholder="Judul Album" required />
        <textarea name="description" placeholder="Deskripsi" />
        <input name="release_date" type="date" />
        <input name="spotify_url" placeholder="Spotify URL" />
        <input name="cover" type="file" accept="image/*" />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Tambah Album'}
        </button>
      </form>
    </div>
  )
}