import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ShowDate } from '@/types'

export default async function ShowDatesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: shows } = await supabase
    .from('show_dates')
    .select('*')
    .order('show_date', { ascending: true })

  const now      = new Date()
  const upcoming = shows?.filter(s => new Date(s.show_date) >= now) ?? []
  const past     = shows?.filter(s => new Date(s.show_date) < now).reverse() ?? []

  return (
    <main>
      {/* Dark bar sits behind the fixed transparent navbar on this white-bg page */}
      <div className="sd-navbar-bar" aria-hidden="true" />

      <section
        style={{
          background: '#fff',
          color: '#111',
          position: 'relative',
          minHeight: '100vh',
          fontFamily: "'Space Mono', monospace",
          paddingTop: '68px',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

          /* ── NAVBAR BAR ── */
          .sd-navbar-bar {
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 68px;
            background: rgba(5,5,5,0.95);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom: 1px solid rgba(255,255,255,0.04);
            z-index: 999;
            pointer-events: none;
          }

          /* ── LAYOUT ── */
          .sd-content {
            max-width: 100%;
            margin: 0 auto;
            padding: 3rem 3rem 3rem;
            position: relative;
          }

          /* ── HEADER ── */
          .sd-header-wrap {
            text-align: center;
            margin-bottom: 3rem;
          }

          .sd-top-label {
            font-size: clamp(11px, 1.2vw, 16px);
            letter-spacing: 0.4em;
            color: #888;
            text-transform: uppercase;
            margin: 0 0 0.75rem;
          }

          .sd-main-title {
            font-family: 'Space Mono', monospace;
            font-size: clamp(3.5rem, 10vw, 7rem);
            font-weight: 700;
            letter-spacing: 0.04em;
            margin: 0 0 0.6rem;
            line-height: 1;
            color: #111;
          }

          .sd-subtitle-text {
            font-size: clamp(13px, 1.3vw, 18px);
            letter-spacing: 0.2em;
            color: #888;
            margin: 0;
            font-style: italic;
          }

          /* ── SECTION LABEL ── */
          .sd-section-label {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 3rem 0 0;
          }

          .sd-section-label-text {
            font-family: 'Space Mono', monospace;
            font-size: clamp(13px, 1.4vw, 18px);
            font-weight: 700;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #aaa;
            white-space: nowrap;
          }

          .sd-section-label-line {
            flex: 1;
            height: 1px;
            background: #e8e8e8;
          }

          .sd-section-label-count {
            font-family: 'Space Mono', monospace;
            font-size: clamp(12px, 1.2vw, 16px);
            letter-spacing: 0.1em;
            color: #ccc;
            white-space: nowrap;
          }

          /* ── TABLE HEADER — desktop ── */
          .sd-table-header {
            display: grid;
            grid-template-columns: 2fr 1.2fr 2.5fr 1.6fr;
            padding: 1rem 0;
            margin-bottom: 0;
          }

          .sd-table-header span {
            font-family: 'Space Mono', monospace;
            font-size: clamp(14px, 1.6vw, 22px);
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #111;
            padding: 0 0.75rem;
          }

          .sd-table-header span:first-child { padding-left: 0; }
          .sd-table-header span:last-child  { text-align: right; padding-right: 0; }
          .sd-table-header.past span        { color: #bbb; }

          /* ── ROW — desktop ── */
          .sd-row {
            display: grid;
            grid-template-columns: 2fr 1.2fr 2.5fr 1.6fr;
            align-items: center;
            min-height: 120px;
            border-bottom: 1px solid #efefef;
            transition: background 0.2s ease;
          }

          .sd-row:hover       { background: #fafafa; }
          .sd-row.past        { opacity: 0.45; }
          .sd-row.past:hover  { opacity: 0.65; background: #fafafa; }

          /* ── CELLS — desktop ── */
          .sd-cell {
            padding: 1.5rem 0.75rem;
            font-family: 'Space Mono', monospace;
          }
          .sd-cell:first-child { padding-left: 0; }

          .sd-show-name {
            display: block;
            font-weight: 700;
            font-size: clamp(16px, 1.8vw, 26px);
            letter-spacing: 0.03em;
            color: #111;
            margin-bottom: 0.3rem;
          }

          .sd-show-city {
            display: block;
            font-size: clamp(12px, 1.1vw, 16px);
            color: #888;
            letter-spacing: 0.08em;
            font-weight: 400;
          }

          .sd-time {
            font-size: clamp(14px, 1.5vw, 22px);
            letter-spacing: 0.05em;
            color: #333;
          }

          .sd-location-name {
            font-size: clamp(14px, 1.5vw, 22px);
            letter-spacing: 0.04em;
            color: #333;
          }

          /* ── BUTTON CELL ── */
          .sd-cell-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.85rem;
            padding-right: 0;
          }

          /* ── BUTTONS ── */
          .sd-btn {
            display: inline-block;
            font-family: 'Space Mono', monospace;
            font-size: clamp(11px, 1.1vw, 15px);
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            border: 1.5px solid #111;
            border-radius: 999px;
            padding: 0.6rem 1.4rem;
            cursor: pointer;
            background: transparent;
            color: #111;
            white-space: nowrap;
            text-decoration: none;
            transition: background 0.2s, color 0.2s;
            line-height: 1;
          }

          .sd-btn:hover { background: #111; color: #fff; }

          .sd-btn-disabled {
            display: inline-block;
            font-family: 'Space Mono', monospace;
            font-size: clamp(11px, 1.1vw, 15px);
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            border: 1.5px solid #ddd;
            border-radius: 999px;
            padding: 0.6rem 1.4rem;
            background: transparent;
            color: #ccc;
            white-space: nowrap;
            line-height: 1;
          }

          /* ── EMPTY STATE ── */
          .sd-empty {
            padding: 3rem 0;
            text-align: center;
          }

          .sd-empty p {
            font-size: 11px;
            letter-spacing: 0.2em;
            color: #bbb;
            text-transform: uppercase;
          }

          /* ── MOBILE/DESKTOP SHOW-HIDE ──
             sdp-mobile-meta   : hanya tampil di mobile
             sd-btn-mobile-only: tombol dalam row-inner-top, hanya mobile
             sd-btn-desktop-only: tombol kolom 4 grid, hanya desktop
             sd-cell-desktop-time / location: hanya desktop
          */
          .sd-mobile-meta       { display: none; }
          .sd-btn-mobile-only   { display: none; }
          .sd-btn-desktop-only  { display: flex; }

          @media (min-width: 641px) {
            .sd-row-inner-top { display: block; }
          }

          /* ═══════════════════════════════════════════
             MOBILE PORTRAIT ≤ 640px
          ═══════════════════════════════════════════ */
          @media (max-width: 640px) {
            .sd-content { padding: 1.5rem 1rem 2rem; }

            /* Header tabel mobile: hanya Show + Show Detail */
            .sd-table-header {
              display: grid;
              grid-template-columns: 1fr auto;
              padding: 0.5rem 0;
              border-bottom: 2px solid #111;
            }

            .sd-table-header span {
              font-size: 10px;
              letter-spacing: 0.18em;
              padding: 0;
              color: #888;
            }

            /* Sembunyikan kolom Time & Location dari header */
            .sd-table-header span:nth-child(2),
            .sd-table-header span:nth-child(3) { display: none; }

            .sd-table-header span:last-child { text-align: right; }

            /* Row: flex column */
            .sd-row {
              display: flex;
              flex-direction: column;
              align-items: stretch;
              min-height: unset;
              padding: 0.85rem 0;
              gap: 0;
              border-bottom: 1px solid #efefef;
            }

            /* Baris atas: nama show (kiri) + tombol (kanan) */
            .sd-row-inner-top {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 0.75rem;
            }

            /* Nama & city */
            .sd-show-name {
              font-size: 13px;
              margin-bottom: 0.1rem;
              line-height: 1.3;
            }

            .sd-show-city { font-size: 11px; }

            /* Meta info di bawah nama */
            .sd-mobile-meta {
              display: flex;
              flex-direction: column;
              gap: 0.15rem;
              margin-top: 0.35rem;
            }

            .sd-mobile-meta-item {
              font-family: 'Space Mono', monospace;
              font-size: 10px;
              color: #999;
              letter-spacing: 0.05em;
            }

            .sd-mobile-meta-item strong {
              color: #555;
              font-weight: 700;
            }

            /* Sembunyikan cell Time & Location desktop */
            .sd-cell-desktop-time,
            .sd-cell-desktop-location { display: none !important; }

            /* Tombol mobile — flex kanan atas */
            .sd-btn-mobile-only {
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
              flex-shrink: 0;
              padding: 0;
            }

            /* Sembunyikan tombol desktop (kolom 4) */
            .sd-btn-desktop-only { display: none !important; }

            .sd-btn {
              font-size: 9px;
              padding: 0.4rem 0.8rem;
              letter-spacing: 0.1em;
              white-space: nowrap;
            }

            .sd-btn-disabled {
              font-size: 9px;
              padding: 0.4rem 0.8rem;
              letter-spacing: 0.1em;
              white-space: nowrap;
            }

            .sd-section-label { margin: 1.5rem 0 0; }
          }

          /* ── TABLET 641–900px ── */
          @media (min-width: 641px) and (max-width: 900px) {
            .sd-content { padding: 2rem 2rem 2.5rem; }
            .sd-table-header,
            .sd-row { grid-template-columns: 2fr 1.2fr 2fr 1.5fr; }
          }

          /* ── LARGE DESKTOP ≥ 1400px ── */
          @media (min-width: 1400px) {
            .sd-content { padding: 4rem 5rem 4rem; }
            .sd-row { min-height: 130px; }
          }
        `}} />

        {/* ── MAIN CONTENT ── */}
        <div className="sd-content">

          {/* HEADER */}
          <div className="sd-header-wrap">
            <p className="sd-top-label">All Shows</p>
            <h1 className="sd-main-title">SHOW DATES</h1>
            <p className="sd-subtitle-text">
              {upcoming.length > 0
                ? `${upcoming.length} upcoming show${upcoming.length > 1 ? 's' : ''} — we'll see you there.`
                : 'No upcoming shows at the moment. Stay tuned.'}
            </p>
          </div>

          {/* ── UPCOMING ── */}
          <div className="sd-section-label">
            <span className="sd-section-label-text">Upcoming</span>
            <div className="sd-section-label-line" />
            <span className="sd-section-label-count">
              {upcoming.length} show{upcoming.length !== 1 ? 's' : ''}
            </span>
          </div>

          {upcoming.length === 0 ? (
            <div className="sd-empty">
              <div style={{
                borderTop: '2px solid #111',
                borderBottom: '1px dashed #ddd',
                padding: '0.5rem 0',
                marginBottom: '2rem',
              }} />
              <p>No upcoming shows. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="sd-table-header">
                <span>Show</span>
                <span>Time</span>
                <span>Location</span>
                <span>Show Detail</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                {upcoming.map(show => (
                  <ShowRow key={show.id} show={show} />
                ))}
              </div>
            </>
          )}

          {/* ── PAST SHOWS ── */}
          {past.length > 0 && (
            <>
              <div className="sd-section-label" style={{ marginTop: '4rem' }}>
                <span className="sd-section-label-text" style={{ color: '#ccc' }}>Past Shows</span>
                <div className="sd-section-label-line" />
                <span className="sd-section-label-count">
                  {past.length} show{past.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="sd-table-header past">
                <span>Show</span>
                <span>Time</span>
                <span>Location</span>
                <span>Show Detail</span>
              </div>
              <div style={{ marginBottom: '3rem' }}>
                {past.map(show => (
                  <ShowRow key={show.id} show={show} isPast />
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </main>
  )
}

/* ════════════════════════════════════════════════════════
   SHOW ROW
════════════════════════════════════════════════════════ */
function ShowRow({ show, isPast }: { show: ShowDate; isPast?: boolean }) {
  const date    = new Date(show.show_date)
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  })
  const time    = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const hasTime = time !== '00:00'

  const ticketBtn = show.is_sold_out ? (
    <span className="sd-btn-disabled">Sold Out</span>
  ) : show.ticket_url && !isPast ? (
    <a href={show.ticket_url} target="_blank" rel="noopener noreferrer" className="sd-btn">
      More Info
    </a>
  ) : (
    <span className="sd-btn-disabled">{isPast ? 'Ended' : 'TBA'}</span>
  )

  return (
    <div className={`sd-row${isPast ? ' past' : ''}`}>

      {/* ── KOLOM 1: nama show ───────────────────────────── */}
      <div className="sd-cell">
        <div className="sd-row-inner-top">
          <div>
            <span className="sd-show-name">{show.event_name}</span>
            {show.city && <span className="sd-show-city">{show.city}</span>}

            {/* Meta info — hanya tampil di mobile */}
            <div className="sd-mobile-meta">
              <span className="sd-mobile-meta-item">
                <strong>{dateStr}</strong>
                {hasTime && ` · ${time} WIB`}
              </span>
              <span className="sd-mobile-meta-item">
                {show.venue}{show.city ? ` — ${show.city}` : ''}
              </span>
            </div>
          </div>

          {/* Tombol mobile — sejajar kanan nama show */}
          <div className="sd-cell-right sd-btn-mobile-only">
            {ticketBtn}
          </div>
        </div>
      </div>

      {/* ── KOLOM 2: waktu — desktop only ───────────────── */}
      <div className="sd-cell sd-cell-desktop-time">
        <span className="sd-time">{dateStr}</span>
        {hasTime && (
          <span style={{
            display: 'block',
            fontSize: 'clamp(11px, 1vw, 15px)',
            color: '#aaa',
            letterSpacing: '0.08em',
            marginTop: '0.15rem',
          }}>
            {time} WIB
          </span>
        )}
      </div>

      {/* ── KOLOM 3: lokasi — desktop only ──────────────── */}
      <div className="sd-cell sd-cell-desktop-location">
        <span className="sd-location-name">
          {show.venue}{show.city ? ` — ${show.city}` : ''}
        </span>
      </div>

      {/* ── KOLOM 4: tombol — desktop only ──────────────── */}
      <div className="sd-cell sd-cell-right sd-btn-desktop-only">
        {ticketBtn}
      </div>
    </div>
  )
}