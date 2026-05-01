import Link from 'next/link'
import { ShowDate } from '@/types'

interface Props {
  shows: ShowDate[] | null
}

export default function ShowDatesPreview({ shows }: Props) {
  return (
    <section style={{ padding: '4rem 2rem', background: '#111', color: '#fff' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '0.2em', marginBottom: '2rem' }}>
        SHOW DATES
      </h2>

      {!shows || shows.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No upcoming shows at the moment.</p>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {shows.map((show) => (
            <div key={show.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem 1.5rem', border: '1px solid #333', borderRadius: '8px'
            }}>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{show.event_name}</p>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>{show.venue}, {show.city}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#ccc' }}>
                  {new Date(show.show_date).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                {show.is_sold_out ? (
                  <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>SOLD OUT</span>
                ) : show.ticket_url ? (
                  <a href={show.ticket_url} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#fff', fontSize: '0.8rem', textDecoration: 'underline' }}>
                    Get Tickets
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/show-dates" style={{ color: '#fff', textDecoration: 'underline', letterSpacing: '0.1em' }}>
          SEE ALL SHOWS →
        </Link>
      </div>
    </section>
  )
}