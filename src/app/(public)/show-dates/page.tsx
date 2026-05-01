import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ShowDate } from '@/types'

export default async function ShowDatesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: shows } = await supabase
    .from('show_dates')
    .select('*')
    .order('show_date', { ascending: true })

  const upcoming = shows?.filter(s => new Date(s.show_date) >= new Date())
  const past = shows?.filter(s => new Date(s.show_date) < new Date())

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '6rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <p style={{ letterSpacing: '0.3em', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>WHERE WE PLAY</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: '900', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '4rem' }}>
          SHOW DATES
        </h1>

        <h2 style={{ fontSize: '1rem', letterSpacing: '0.2em', color: '#666', marginBottom: '1.5rem' }}>UPCOMING</h2>
        {(!upcoming || upcoming.length === 0)
          ? <p style={{ color: '#555', marginBottom: '3rem' }}>No upcoming shows. Check back soon!</p>
          : upcoming.map((show: ShowDate) => (
            <ShowCard key={show.id} show={show} />
          ))
        }

        {past && past.length > 0 && (
          <>
            <h2 style={{ fontSize: '1rem', letterSpacing: '0.2em', color: '#666', margin: '3rem 0 1.5rem' }}>PAST SHOWS</h2>
            {past.map((show: ShowDate) => (
              <ShowCard key={show.id} show={show} isPast />
            ))}
          </>
        )}
      </div>
    </main>
  )
}

function ShowCard({ show, isPast }: { show: ShowDate; isPast?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1.25rem 1.5rem', border: '1px solid #222', borderRadius: '8px',
      marginBottom: '1rem', opacity: isPast ? 0.5 : 1,
    }}>
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{show.event_name}</p>
        <p style={{ color: '#666', fontSize: '0.85rem' }}>{show.venue}, {show.city}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ color: '#ccc', marginBottom: '0.25rem' }}>
          {new Date(show.show_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        {!isPast && (show.is_sold_out
          ? <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>SOLD OUT</span>
          : show.ticket_url
            ? <a href={show.ticket_url} target="_blank" rel="noopener noreferrer"
                style={{ color: '#fff', fontSize: '0.8rem', textDecoration: 'underline' }}>Get Tickets</a>
            : null
        )}
      </div>
    </div>
  )
}