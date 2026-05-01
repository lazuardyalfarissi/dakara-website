import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NewsPost } from '@/types'
import Link from 'next/link'

export default async function NewsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: posts } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '6rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <p style={{ letterSpacing: '0.3em', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>LATEST</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: '900', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '4rem' }}>
          NEWS
        </h1>

        {(!posts || posts.length === 0) && (
          <p style={{ color: '#555', textAlign: 'center' }}>No news yet. Stay tuned!</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {posts?.map((post: NewsPost) => (
            <Link key={post.id} href={`/news/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', border: '1px solid #1a1a1a', borderRadius: '8px', transition: 'border-color 0.3s' }}>
                {post.cover_url && (
                  <img src={post.cover_url} alt={post.title}
                    style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                )}
                <div>
                  <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    {new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{post.title}</h2>
                  {post.excerpt && <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.6 }}>{post.excerpt}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}