import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Member } from '@/types'

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '6rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <p style={{ letterSpacing: '0.3em', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>THE BAND</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: '900', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '4rem' }}>
          MEET THE MEMBERS
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {members?.map((member: Member) => (
            <div key={member.id} style={{ textAlign: 'center', padding: '2rem', border: '1px solid #222', borderRadius: '8px' }}>
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: '#1a1a1a', margin: '0 auto 1.5rem',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {member.photo_url
                  ? <img src={member.photo_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '3rem' }}>🎸</span>
                }
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{member.name}</h2>
              <p style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>{member.role}</p>
              {member.bio && <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.7 }}>{member.bio}</p>}
            </div>
          ))}

          {(!members || members.length === 0) && (
            <p style={{ color: '#555', textAlign: 'center', gridColumn: '1/-1' }}>No members data yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}