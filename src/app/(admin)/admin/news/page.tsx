'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { NewsPost } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

function slugify(text: string) {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const supabase = createClient()

  async function fetchPosts() {
    setFetchLoading(true)
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setFetchLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value
    const excerpt = (form.elements.namedItem('excerpt') as HTMLInputElement).value
    const is_published = (form.elements.namedItem('is_published') as HTMLInputElement).checked
    const coverFile = (form.elements.namedItem('cover') as HTMLInputElement).files?.[0]

    let cover_url = null
    if (coverFile) {
      const fileName = `${Date.now()}-${coverFile.name}`
      const { error: uploadError } = await supabase.storage.from('news').upload(fileName, coverFile)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('news').getPublicUrl(fileName)
        cover_url = publicUrl
      }
    }

    const slug = slugify(title) + '-' + Date.now()

    const { error } = await supabase.from('news').insert({
      title, content, excerpt, slug, cover_url, is_published,
      published_at: new Date().toISOString()
    })

    if (error) alert('Error: ' + error.message)
    else { alert('Post berhasil ditambahkan!'); form.reset(); fetchPosts() }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin mau hapus post ini?')) return
    await supabase.from('news').delete().eq('id', id)
    fetchPosts()
  }

  async function togglePublish(id: string, current: boolean) {
    await supabase.from('news').update({ is_published: !current }).eq('id', id)
    fetchPosts()
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '2rem' }}>NEWS</h1>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1.5rem' }}>+ TAMBAH POST</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input name="title" placeholder="Judul Post *" required
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <input name="excerpt" placeholder="Excerpt / Ringkasan singkat"
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <textarea name="content" placeholder="Isi konten *" required rows={6}
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff', resize: 'vertical' }} />
          <input name="cover" type="file" accept="image/*"
            style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>
            <input name="is_published" type="checkbox" />
            Publish sekarang
          </label>
          <Button type="submit" loading={loading}>TAMBAH POST</Button>
        </form>
      </Card>

      <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#666', marginBottom: '1rem' }}>DAFTAR POST</h2>
      {fetchLoading ? (
        <p style={{ color: '#555' }}>Loading...</p>
      ) : posts.length === 0 ? (
        <p style={{ color: '#555' }}>Belum ada post.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <Card key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 'bold' }}>{post.title}</p>
                <p style={{ color: '#555', fontSize: '0.85rem' }}>
                  {new Date(post.published_at).toLocaleDateString('id-ID')} •{' '}
                  <span style={{ color: post.is_published ? '#4ade80' : '#f87171' }}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant={post.is_published ? 'ghost' : 'secondary'}
                  size="sm"
                  onClick={() => togglePublish(post.id, post.is_published)}
                >
                  {post.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>Hapus</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}