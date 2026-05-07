'use client'

import Link from 'next/link'
import { ShowDate } from '@/types'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props {
  shows: ShowDate[] | null
}

export default function ShowDatesPreview({ shows }: Props) {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.1 })
  const { ref: tableRef, isVisible: tableVisible } = useScrollReveal({ threshold: 0.05 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.1 })

  return (
    <section
      id="show-dates"
      style={{
        background: '#fff',
        color: '#111',
        position: 'relative',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        /* ── MARQUEE ── */
        .sdp-marquee-track {
          display: flex;
          width: max-content;
          animation: sdp-marquee-scroll 30s linear infinite;
          will-change: transform;
        }
        @keyframes sdp-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── LAYOUT ── */
        .sdp-content {
          max-width: 100%;
          margin: 0 auto;
          padding: 3rem 3rem 3rem;
          position: relative;
        }

        /* ── HEADER ── */
        .sdp-header-wrap {
          position: relative;
          text-align: center;
          margin-bottom: 3rem;
        }

        .sdp-top-label {
          font-size: clamp(11px, 1.2vw, 16px);
          letter-spacing: 0.4em;
          color: #888;
          text-transform: uppercase;
          margin: 0 0 0.75rem;
        }

        .sdp-main-title {
          font-family: 'Space Mono', monospace;
          font-size: clamp(3.5rem, 10vw, 7rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          margin: 0 0 0.6rem;
          line-height: 1;
          color: #111;
        }

        .sdp-subtitle-text {
          font-size: clamp(13px, 1.3vw, 18px);
          letter-spacing: 0.2em;
          color: #888;
          margin: 0;
          font-style: italic;
        }

        /* ── SECTION LABEL ── */
        .sdp-section-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 3rem 0 0;
        }

        .sdp-section-label-text {
          font-family: 'Space Mono', monospace;
          font-size: clamp(13px, 1.4vw, 18px);
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #aaa;
          white-space: nowrap;
        }

        .sdp-section-label-line {
          flex: 1;
          height: 1px;
          background: #e8e8e8;
        }

        .sdp-section-label-count {
          font-family: 'Space Mono', monospace;
          font-size: clamp(12px, 1.2vw, 16px);
          letter-spacing: 0.1em;
          color: #ccc;
          white-space: nowrap;
        }

        /* ── TABLE HEADER — desktop ── */
        .sdp-table-header {
          display: grid;
          grid-template-columns: 2fr 1.2fr 2.5fr 1.6fr;
          gap: 0;
          padding: 1rem 0;
          margin-bottom: 0;
        }

        .sdp-table-header span {
          font-family: 'Space Mono', monospace;
          font-size: clamp(14px, 1.6vw, 22px);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111;
          padding: 0 0.75rem;
        }

        .sdp-table-header span:first-child { padding-left: 0; }
        .sdp-table-header span:last-child  { text-align: right; padding-right: 0; }

        /* ── ROW — desktop ── */
        .sdp-row {
          display: grid;
          grid-template-columns: 2fr 1.2fr 2.5fr 1.6fr;
          gap: 0;
          align-items: center;
          min-height: 120px;
          border-bottom: 1px solid #efefef;
          transition: background 0.2s ease;
        }

        .sdp-row:hover { background: #fafafa; }

        /* ── CELLS — desktop ── */
        .sdp-cell {
          padding: 1.5rem 0.75rem;
          font-family: 'Space Mono', monospace;
        }
        .sdp-cell:first-child { padding-left: 0; }

        .sdp-show-name {
          display: block;
          font-weight: 700;
          font-size: clamp(16px, 1.8vw, 26px);
          letter-spacing: 0.03em;
          color: #111;
          margin-bottom: 0.3rem;
        }

        .sdp-show-city {
          display: block;
          font-size: clamp(12px, 1.1vw, 16px);
          color: #888;
          letter-spacing: 0.08em;
          font-weight: 400;
        }

        .sdp-time {
          font-size: clamp(14px, 1.5vw, 22px);
          letter-spacing: 0.05em;
          color: #333;
        }

        .sdp-location-name {
          font-size: clamp(14px, 1.5vw, 22px);
          letter-spacing: 0.04em;
          color: #333;
        }

        /* ── BUTTON CELL — desktop ── */
        .sdp-cell-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.85rem;
          padding-right: 0;
        }

        /* ── BUTTONS ── */
        .sdp-btn {
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

        .sdp-btn:hover { background: #111; color: #fff; }

        .sdp-btn-disabled {
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
        .sdp-empty {
          padding: 4rem 0;
          text-align: center;
        }

        .sdp-empty p {
          font-size: clamp(11px, 1vw, 14px);
          letter-spacing: 0.2em;
          color: #aaa;
          text-transform: uppercase;
        }

        /* ── SEE MORE ── */
        .sdp-see-more-wrap {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .sdp-see-more-btn {
          font-family: 'Space Mono', monospace;
          font-size: clamp(11px, 1.1vw, 15px);
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          border: 1.5px solid #111;
          border-radius: 999px;
          padding: 0.75rem 2.5rem;
          text-decoration: none;
          color: #111;
          transition: background 0.2s, color 0.2s;
          display: inline-block;
        }

        .sdp-see-more-btn:hover {
          background: #111;
          color: #fff;
        }

        /* ── SCROLL REVEAL ── */
        .sdp-sr {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity  0.6s cubic-bezier(0.23, 1, 0.32, 1),
            transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .sdp-sr-visible {
          opacity: 1 !important;
          transform: none !important;
        }
        .sdp-row-reveal {
          opacity: 0;
          transform: translateX(-20px);
          transition:
            opacity  0.55s cubic-bezier(0.23, 1, 0.32, 1),
            transform 0.55s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .sdp-row-reveal.sdp-sr-visible {
          opacity: 1 !important;
          transform: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .sdp-sr, .sdp-row-reveal {
            transition: opacity 0.3s ease !important;
            transform: none !important;
          }
        }

        /* ── TABLET ── */
        @media (min-width: 641px) and (max-width: 900px) {
          .sdp-content { padding: 2rem 2rem 2.5rem; }
          .sdp-table-header,
          .sdp-row { grid-template-columns: 2fr 1.2fr 2fr 1.5fr; }
        }

        /* ── LARGE DESKTOP ── */
        @media (min-width: 1400px) {
          .sdp-content { padding: 4rem 5rem 4rem; }
          .sdp-row { min-height: 130px; }
        }

        /* ═══════════════════════════════════════════════
           MOBILE PORTRAIT  ≤ 640px
           Layout: card per-row, tombol di kanan atas
        ════════════════════════════════════════════════ */
        @media (max-width: 640px) {
          .sdp-content { padding: 1.5rem 1rem 2rem; }

          /* Header tabel mobile: hanya Show + Show Detail */
          .sdp-table-header {
            display: grid;
            grid-template-columns: 1fr auto;
            border-bottom: 2px solid #111;
            padding: 0.5rem 0;
            margin-bottom: 0;
          }

          /* Sembunyikan kolom Time & Location dari header */
          .sdp-table-header span:nth-child(2),
          .sdp-table-header span:nth-child(3) {
            display: none;
          }

          .sdp-table-header span {
            font-size: 10px;
            letter-spacing: 0.18em;
            padding: 0;
            color: #888;
          }

          .sdp-table-header span:last-child {
            text-align: right;
          }

          /* Row jadi flex column, bukan grid */
          .sdp-row {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            min-height: unset;
            padding: 0.85rem 0;
            gap: 0;
            border-bottom: 1px solid #efefef;
          }

          /* Row bagian dalam: nama + tombol sejajar horizontal */
          .sdp-row-inner-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 0.75rem;
          }

          /* Info nama show */
          .sdp-show-name {
            font-size: 13px;
            margin-bottom: 0.1rem;
            line-height: 1.3;
          }

          .sdp-show-city {
            font-size: 11px;
          }

          /* Meta baris: tanggal + venue */
          .sdp-mobile-meta {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
            margin-top: 0.35rem;
          }

          .sdp-mobile-meta-item {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            color: #999;
            letter-spacing: 0.05em;
          }

          .sdp-mobile-meta-item strong {
            color: #555;
            font-weight: 700;
          }

          /* SEMBUNYIKAN cell desktop Time & Location di mobile */
          .sdp-cell-desktop-time,
          .sdp-cell-desktop-location {
            display: none !important;
          }

          /* Tombol — tidak absolute, ikut flex normal di kanan atas */
          .sdp-cell-right {
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;
            flex-shrink: 0;
            padding: 0;
          }

          .sdp-btn {
            font-size: 9px;
            padding: 0.4rem 0.8rem;
            letter-spacing: 0.1em;
            white-space: nowrap;
          }

          .sdp-btn-disabled {
            font-size: 9px;
            padding: 0.4rem 0.8rem;
            letter-spacing: 0.1em;
            white-space: nowrap;
          }

          .sdp-section-label { margin: 1.5rem 0 0; }

          .sdp-see-more-wrap { margin-top: 2rem; }

          .sdp-see-more-btn {
            font-size: 10px;
            padding: 0.65rem 1.75rem;
            letter-spacing: 0.2em;
          }
        }

        /* sdp-mobile-meta: HANYA tampil di mobile */
        .sdp-mobile-meta { display: none; }

        /* Tombol mobile (di dalam row-inner-top): HANYA mobile */
        .sdp-btn-mobile-only { display: none; }

        /* Tombol desktop (kolom 4 grid): HANYA desktop */
        .sdp-btn-desktop-only { display: flex; }

        @media (max-width: 640px) {
          .sdp-mobile-meta      { display: flex; }
          .sdp-btn-mobile-only  { display: flex; }
          .sdp-btn-desktop-only { display: none !important; }

          /* sdp-row-inner-top: flex horizontal di mobile */
          .sdp-row-inner-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 0.75rem;
          }
        }

        /* Di desktop sdp-row-inner-top tidak perlu flex — biarkan normal */
        @media (min-width: 641px) {
          .sdp-row-inner-top { display: block; }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .sdp-marquee-bottom {
            padding-bottom: max(14px, env(safe-area-inset-bottom));
          }
        }
      `}} />

      {/* MARQUEE TOP */}
      <div style={{
        background: '#111',
        overflow: 'hidden',
        padding: '9px 0',
        borderBottom: '1px solid #222',
      }}>
        <div className="sdp-marquee-track">
          {[...Array(2)].flatMap((_, gi) =>
            ['LIVE DATES', '✦', 'ON STAGE', '✦', 'UPCOMING SHOWS', '✦', 'LIVE DATES', '✦',
             'ON STAGE', '✦', 'UPCOMING SHOWS', '✦'].map((item, i) => (
              <span key={`${gi}-${i}`} style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                color: '#444',
                padding: '0 2rem',
                whiteSpace: 'nowrap',
              }}>
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="sdp-content">

        {/* HEADER */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`sdp-header-wrap sdp-sr ${headerVisible ? 'sdp-sr-visible' : ''}`}
        >
          <p className="sdp-top-label">Our Sailing Schedule</p>
          <h2 className="sdp-main-title">SHOW DATES</h2>
          <p className="sdp-subtitle-text">Keep monitoring where we are, stay safe all of you</p>
        </div>

        {/* TABLE */}
        {!shows || shows.length === 0 ? (
          <div
            className={`sdp-empty sdp-sr ${tableVisible ? 'sdp-sr-visible' : ''}`}
            ref={tableRef as React.RefObject<HTMLDivElement>}
          >
            <p>No upcoming shows at the moment. Stay tuned.</p>
          </div>
        ) : (
          <div ref={tableRef as React.RefObject<HTMLDivElement>}>

            {/* Section label */}
            <div className={`sdp-section-label sdp-sr ${tableVisible ? 'sdp-sr-visible' : ''}`}>
              <span className="sdp-section-label-text">Upcoming</span>
              <div className="sdp-section-label-line" />
              <span className="sdp-section-label-count">
                {shows.length} show{shows.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Table header */}
            <div
              className={`sdp-table-header sdp-sr ${tableVisible ? 'sdp-sr-visible' : ''}`}
              style={{ transitionDelay: '0.1s' }}
            >
              <span>Show</span>
              <span>Time</span>
              <span>Location</span>
              <span>Show Detail</span>
            </div>

            {/* Rows */}
            <div style={{ marginBottom: '1rem' }}>
              {shows.map((show, index) => {
                const date    = new Date(show.show_date)
                const dateStr = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day:   'numeric',
                  year:  'numeric',
                })
                const time   = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                const hasTime = time !== '00:00'

                const ticketBtn = show.is_sold_out ? (
                  <span className="sdp-btn-disabled">Sold Out</span>
                ) : show.ticket_url ? (
                  <a href={show.ticket_url} target="_blank" rel="noopener noreferrer" className="sdp-btn">
                    More Info
                  </a>
                ) : (
                  <span className="sdp-btn-disabled">TBA</span>
                )

                return (
                  <div
                    key={show.id}
                    className={`sdp-row sdp-row-reveal ${tableVisible ? 'sdp-sr-visible' : ''}`}
                    style={{ transitionDelay: `${0.12 + index * 0.07}s` }}
                  >
                    {/* ── KOLOM 1: nama show ─────────────────────── */}
                    {/*
                      Di desktop: cell biasa dalam grid.
                      Di mobile:  berisi sdp-row-inner-top (nama + tombol sejajar)
                                  + sdp-mobile-meta (tanggal & venue di bawah).
                    */}
                    <div className="sdp-cell">

                      {/* Baris atas: nama show (kiri) + tombol (kanan) — mobile only via flex */}
                      <div className="sdp-row-inner-top">
                        <div>
                          <span className="sdp-show-name">{show.event_name}</span>
                          {show.city && <span className="sdp-show-city">{show.city}</span>}

                          {/* Meta info — HANYA TAMPIL di mobile (via CSS) */}
                          <div className="sdp-mobile-meta">
                            <span className="sdp-mobile-meta-item">
                              <strong>{dateStr}</strong>
                              {hasTime && ` · ${time} WIB`}
                            </span>
                            <span className="sdp-mobile-meta-item">
                              {show.venue}{show.city ? ` — ${show.city}` : ''}
                            </span>
                          </div>
                        </div>

                        {/*
                          Tombol versi MOBILE — tampil di dalam sdp-row-inner-top
                          di mobile, disembunyikan di desktop via CSS.
                        */}
                        <div className="sdp-cell-right sdp-btn-mobile-only">
                          {ticketBtn}
                        </div>
                      </div>
                    </div>

                    {/* ── KOLOM 2: waktu — desktop only ───────────── */}
                    <div className="sdp-cell sdp-cell-desktop-time">
                      <span className="sdp-time">{dateStr}</span>
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

                    {/* ── KOLOM 3: lokasi — desktop only ──────────── */}
                    <div className="sdp-cell sdp-cell-desktop-location">
                      <span className="sdp-location-name">
                        {show.venue}{show.city ? ` — ${show.city}` : ''}
                      </span>
                    </div>

                    {/* ── KOLOM 4: tombol — desktop only ──────────── */}
                    <div className="sdp-cell sdp-cell-right sdp-btn-desktop-only">
                      {ticketBtn}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* SEE MORE */}
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`sdp-see-more-wrap sdp-sr ${ctaVisible ? 'sdp-sr-visible' : ''}`}
        >
          <Link href="/show-dates" className="sdp-see-more-btn">
            See All Shows →
          </Link>
        </div>
      </div>

      {/* MARQUEE BOTTOM */}
      <div
        className="sdp-marquee-bottom"
        style={{
          overflow: 'hidden',
          padding: '9px 0',
          borderTop: '2px solid #111',
          marginTop: '1rem',
          background: '#fff',
        }}
      >
        <div className="sdp-marquee-track" style={{ animationDuration: '20s' }}>
          {[...Array(2)].flatMap((_, gi) =>
            ['LIVE', '✦', 'ON STAGE', '✦', 'UPCOMING', '✦', 'TICKETS', '✦',
             'LIVE', '✦', 'ON STAGE', '✦', 'UPCOMING', '✦', 'TICKETS', '✦'].map((item, i) => (
              <span key={`${gi}-${i}`} style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                color: '#bbb',
                padding: '0 2rem',
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