import Link from 'next/link'
import { ShowDate } from '@/types'

interface Props {
  shows: ShowDate[] | null
}

export default function ShowDatesPreview({ shows }: Props) {
  return (
    <section
      id="show-dates"
      style={{
        background: '#080808',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Barlow:wght@300;400;500&display=swap');

        /* ================================
           MARQUEE
        ================================ */
        .sd-marquee-track {
          display: flex;
          width: max-content;
          animation: sd-marquee-scroll 30s linear infinite;
          will-change: transform;
        }

        @keyframes sd-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @media (hover: none) {
          .sd-marquee-track:hover { animation-play-state: running; }
        }

        /* ================================
           GRAIN
        ================================ */
        .sd-grain {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 300px;
          pointer-events: none;
          z-index: 0;
        }

        /* ================================
           FADE UP
        ================================ */
        @keyframes sd-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sd-fade-up { animation: sd-fade-up 0.9s cubic-bezier(0.23, 1, 0.32, 1) both; }
        .sd-d1 { animation-delay: 0.05s; }
        .sd-d2 { animation-delay: 0.15s; }
        .sd-d3 { animation-delay: 0.25s; }
        .sd-d4 { animation-delay: 0.35s; }

        /* ================================
           DIVIDER
        ================================ */
        @keyframes sd-line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .sd-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #333, transparent);
          transform-origin: left;
          animation: sd-line-grow 1.5s ease-out forwards;
          margin-bottom: 3rem;
        }

        /* ================================
           SHOW ROW
        ================================ */
        .sd-row {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          align-items: center;
          gap: 2rem;
          padding: 1.75rem 0;
          border-bottom: 1px solid #161616;
          position: relative;
          transition: background 0.3s ease;
          cursor: default;
        }

        .sd-row::before {
          content: '';
          position: absolute;
          left: -2rem;
          right: -2rem;
          top: 0;
          bottom: 0;
          background: rgba(232, 32, 12, 0.04);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .sd-row:hover::before {
          opacity: 1;
        }

        /* Red left bar on hover */
        .sd-row::after {
          content: '';
          position: absolute;
          left: -2rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e8200c;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .sd-row:hover::after {
          transform: scaleY(1);
        }

        /* Date block */
        .sd-date-block {
          text-align: center;
          padding: 0.75rem;
          border: 1px solid #1e1e1e;
          position: relative;
          clip-path: polygon(0 0, 100% 0, 100% 80%, 88% 100%, 0 100%);
          transition: border-color 0.3s, clip-path 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          background: #0e0e0e;
        }

        .sd-row:hover .sd-date-block {
          border-color: #e8200c;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%);
        }

        /* Date block corner accent */
        .sd-date-block::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 14px;
          height: 14px;
          background: #e8200c;
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
          transition: width 0.4s, height 0.4s;
        }

        .sd-row:hover .sd-date-block::after {
          width: 0;
          height: 0;
        }

        /* Ticket button */
        .sd-ticket-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          color: #fff;
          border: 1px solid #333;
          padding: 0.5rem 1.1rem;
          text-decoration: none;
          display: inline-block;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 88% 100%, 0 100%);
          transition: background 0.25s, border-color 0.25s, clip-path 0.3s cubic-bezier(0.23,1,0.32,1), color 0.25s;
          white-space: nowrap;
        }

        .sd-ticket-btn:hover {
          background: #e8200c;
          border-color: #e8200c;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%);
        }

        /* Sold out badge */
        .sd-sold-out {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          color: #e8200c;
          border: 1px solid #e8200c;
          padding: 0.5rem 1.1rem;
          opacity: 0.6;
          white-space: nowrap;
        }

        /* See all link */
        .sd-see-all {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.9rem;
          letter-spacing: 0.3em;
          color: #444;
          text-decoration: none;
          position: relative;
          transition: color 0.3s;
        }

        .sd-see-all::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 1px;
          background: #e8200c;
          transition: width 0.35s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .sd-see-all:hover {
          color: #fff;
        }

        .sd-see-all:hover::after {
          width: 100%;
        }

        /* ================================
           CONTENT WRAPPER
        ================================ */
        .sd-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 2rem 3rem;
          position: relative;
          z-index: 1;
        }

        /* ================================
           MOBILE ≤ 640px
        ================================ */
        @media (max-width: 640px) {
          .sd-content {
            padding: 3rem 1.25rem 2rem;
          }

          .sd-row {
            grid-template-columns: 90px 1fr;
            grid-template-rows: auto auto;
            gap: 0.75rem 1rem;
          }

          /* Ticket/sold-out spans full bottom row */
          .sd-row-action {
            grid-column: 1 / -1;
            display: flex;
            justify-content: flex-end;
          }

          .sd-date-block {
            padding: 0.5rem 0.4rem;
          }

          .sd-heading {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            margin-bottom: 2.5rem !important;
            align-items: start !important;
          }

          .sd-title {
            font-size: clamp(3.5rem, 16vw, 5rem) !important;
          }

          .sd-eyebrow {
            text-align: right;
          }
        }

        /* ================================
           TABLET 641–900px
        ================================ */
        @media (min-width: 641px) and (max-width: 900px) {
          .sd-content {
            padding: 4rem 1.75rem 2.5rem;
          }

          .sd-row {
            grid-template-columns: 100px 1fr auto;
            gap: 1.25rem;
          }

          .sd-heading {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            margin-bottom: 3rem !important;
          }
        }

        /* ================================
           SAFE AREA
        ================================ */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .sd-marquee-bottom {
            padding-bottom: max(14px, env(safe-area-inset-bottom));
          }
        }
      `}} />

      {/* GRAIN */}
      <div className="sd-grain" />

      {/* ── MARQUEE TOP ── */}
      <div style={{
        background: '#0e0e0e',
        borderBottom: '1px solid #161616',
        overflow: 'hidden',
        padding: '10px 0',
        position: 'relative',
        zIndex: 2,
      }}>
        <div className="sd-marquee-track">
          {[...Array(2)].flatMap((_, gi) =>
            ['LIVE DATES', '✦', 'ON STAGE', '✦', 'UPCOMING SHOWS', '✦', 'DAKARA LIVE', '✦',
             'LIVE DATES', '✦', 'ON STAGE', '✦', 'UPCOMING SHOWS', '✦', 'DAKARA LIVE', '✦'].map((item, i) => (
              <span key={`${gi}-${i}`} style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.85rem',
                letterSpacing: '0.3em',
                color: '#2a2a2a',
                padding: '0 2rem',
                whiteSpace: 'nowrap',
              }}>
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="sd-content">

        {/* HEADING ROW */}
        <div
          className="sd-heading sd-fade-up sd-d1"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'end',
            marginBottom: '4rem',
          }}
        >
          <div>
            <p
              className="sd-eyebrow"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.4em',
                color: '#e8200c',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              Live Performances
            </p>
            <h2
              className="sd-title"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(4rem, 9vw, 8rem)',
                fontWeight: 400,
                lineHeight: 0.9,
                letterSpacing: '0.03em',
                margin: 0,
              }}
            >
              SHOW<br />DATES
            </h2>
          </div>

          <div style={{ paddingBottom: '0.5rem' }}>
            {!shows || shows.length === 0 ? (
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                lineHeight: 1.75,
                color: '#555',
                borderLeft: '2px solid #222',
                paddingLeft: '1.5rem',
              }}>
                No upcoming shows at the moment. Stay tuned.
              </p>
            ) : (
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                lineHeight: 1.75,
                color: '#888',
                borderLeft: '2px solid #e8200c',
                paddingLeft: '1.5rem',
              }}>
                Catch Dakara live — raw energy, full volume.{' '}
                <span style={{ color: '#ccc', fontStyle: 'normal' }}>
                  {shows.length} upcoming show{shows.length > 1 ? 's' : ''}.
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="sd-divider sd-fade-up sd-d2" />

        {/* SHOW LIST */}
        {shows && shows.length > 0 && (
          <div className="sd-fade-up sd-d3" style={{ marginBottom: '3rem' }}>
            {shows.map((show, index) => (
              <div key={show.id} className="sd-row">

                {/* DATE BLOCK */}
                <div className="sd-date-block">
                  <p style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.6rem',
                    lineHeight: 1,
                    letterSpacing: '0.04em',
                    color: '#fff',
                    marginBottom: '0.15rem',
                  }}>
                    {new Date(show.show_date).toLocaleDateString('id-ID', { day: '2-digit' })}
                  </p>
                  <p style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#e8200c',
                    fontWeight: 400,
                  }}>
                    {new Date(show.show_date).toLocaleDateString('id-ID', { month: 'short' })}
                  </p>
                  <p style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    color: '#444',
                    fontWeight: 300,
                  }}>
                    {new Date(show.show_date).getFullYear()}
                  </p>
                </div>

                {/* EVENT INFO */}
                <div>
                  <p style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.3rem',
                    letterSpacing: '0.08em',
                    color: '#fff',
                    marginBottom: '0.3rem',
                    lineHeight: 1,
                  }}>
                    {show.event_name.toUpperCase()}
                  </p>
                  <p style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: '0.78rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#555',
                    fontWeight: 300,
                  }}>
                    {show.venue}{show.city ? ` · ${show.city}` : ''}
                  </p>
                </div>

                {/* ACTION */}
                <div className="sd-row-action">
                  {show.is_sold_out ? (
                    <span className="sd-sold-out">SOLD OUT</span>
                  ) : show.ticket_url ? (
                    <a
                      href={show.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sd-ticket-btn"
                    >
                      GET TICKETS →
                    </a>
                  ) : (
                    <span style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: '0.75rem',
                      letterSpacing: '0.15em',
                      color: '#333',
                      fontWeight: 300,
                    }}>
                      TBA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEE ALL */}
        <div className="sd-fade-up sd-d4" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          paddingTop: '1.5rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#161616' }} />
          <Link href="/show-dates" className="sd-see-all">
            SEE ALL SHOWS →
          </Link>
          <div style={{ flex: 1, height: '1px', background: '#161616' }} />
        </div>
      </div>

      {/* ── MARQUEE BOTTOM ── */}
      <div
        className="sd-marquee-bottom"
        style={{
          overflow: 'hidden',
          padding: '14px 0',
          borderTop: '1px solid #161616',
          marginTop: '4rem',
          position: 'relative',
          zIndex: 2,
          background: '#e8200c',
        }}
      >
        <div className="sd-marquee-track" style={{ animationDuration: '18s' }}>
          {[...Array(2)].flatMap((_, gi) =>
            ['DAKARA', '✦', 'LIVE', '✦', 'JAKARTA', '✦', 'ON STAGE', '✦',
             'DAKARA', '✦', 'LIVE', '✦', 'JAKARTA', '✦', 'ON STAGE', '✦'].map((item, i) => (
              <span key={`${gi}-${i}`} style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.95rem',
                letterSpacing: '0.25em',
                color: '#fff',
                padding: '0 1.5rem',
                whiteSpace: 'nowrap',
              }}>
                {item}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  )
}