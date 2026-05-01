'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AboutSection() {
  const [members, setMembers] = useState<any[]>([])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .order('order_index', { ascending: true })
      
      if (membersData) setMembers(membersData)

      const { data: logoData } = await supabase
        .from('logo_settings')
        .select('logo_url')
        .eq('id', 1)
        .maybeSingle()

      if (logoData?.logo_url) setLogoUrl(logoData.logo_url)
    }
    fetchData()
  }, [])

  // Running text items — logo + teks akan di-loop
  const marqueeItems = [
    'DAKARA', '✦', 'JAKARTA ROCK COLLECTIVE', '✦',
    'DAKARA', '✦', 'SINCE FOREVER', '✦',
    'DAKARA', '✦', 'JAKARTA ROCK COLLECTIVE', '✦',
    'DAKARA', '✦', 'ALL TIME', '✦',
  ]

  return (
    <section
      id="about"
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
           MARQUEE RUNNING TEXT
        ================================ */
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 22s linear infinite;
          will-change: transform;
        }

        .marquee-track-reverse {
          animation: marquee-scroll-reverse 28s linear infinite;
        }

        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @keyframes marquee-scroll-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        .marquee-track:hover,
        .marquee-track-reverse:hover {
          animation-play-state: paused;
        }

        /* ================================
           MEMBER CARD EFFECTS
        ================================ */
        .member-card {
          position: relative;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .member-card:hover {
          transform: translateY(-12px);
        }

        .member-photo-wrap {
          position: relative;
          width: 200px;
          height: 260px;
          margin: 0 auto 1.5rem;
          overflow: hidden;
          clip-path: polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%);
          transition: clip-path 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .member-card:hover .member-photo-wrap {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%);
        }

        .member-photo-wrap img,
        .member-photo-wrap .member-placeholder {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(1.1);
          transition: filter 0.5s ease, transform 0.5s ease;
        }

        .member-card:hover .member-photo-wrap img,
        .member-card:hover .member-photo-wrap .member-placeholder {
          filter: grayscale(0%) contrast(1.05);
          transform: scale(1.06);
        }

        /* Red corner accent */
        .member-photo-wrap::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          background: #e8200c;
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
          transition: width 0.4s ease, height 0.4s ease;
        }

        .member-card:hover .member-photo-wrap::after {
          width: 0;
          height: 0;
        }

        /* Number badge */
        .member-number {
          position: absolute;
          top: -12px;
          left: -8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 4rem;
          line-height: 1;
          color: rgba(255,255,255,0.06);
          pointer-events: none;
          transition: color 0.3s;
          z-index: 0;
          user-select: none;
        }

        .member-card:hover .member-number {
          color: rgba(232, 32, 12, 0.12);
        }

        /* Name underline sweep */
        .member-name-line {
          position: relative;
          display: inline-block;
        }

        .member-name-line::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2px;
          background: #e8200c;
          transition: width 0.35s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .member-card:hover .member-name-line::after {
          width: 100%;
        }

        /* ================================
           SECTION DIVIDER LINE ANIMATE
        ================================ */
        @keyframes line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(to right, transparent, #333, transparent);
          transform-origin: left;
          animation: line-grow 1.5s ease-out forwards;
        }

        /* ================================
           BG TEXTURE GRAIN
        ================================ */
        .about-grain {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 300px;
          pointer-events: none;
          z-index: 0;
        }

        /* ================================
           MARQUEE LOGO IMAGE
        ================================ */
        .marquee-logo-img {
          height: 28px;
          width: auto;
          opacity: 0.85;
          vertical-align: middle;
          filter: brightness(0) invert(1);
        }

        /* ================================
           FADE IN UP
        ================================ */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fade-up 0.9s cubic-bezier(0.23, 1, 0.32, 1) both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.25s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.55s; }
        .delay-5 { animation-delay: 0.7s; }

        /* ================================
           ABOUT TOP ROW GRID
        ================================ */
        .about-top-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: end;
          margin-bottom: 4rem;
        }

        /* ================================
           MEMBER GRID
        ================================ */
        .member-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 2.5rem 2rem;
        }

        /* ================================
           MAIN CONTENT PADDING
        ================================ */
        .about-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 2rem 3rem;
          position: relative;
          z-index: 1;
        }

        /* ================================
           MOBILE: ≤ 640px
        ================================ */
        @media (max-width: 640px) {
          /* Top row: stack vertically */
          .about-top-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
          }

          /* "About the Band" label geser ke kanan di mobile */
          .about-band-label {
            text-align: right;
          }

          /* Tighter content padding */
          .about-content {
            padding: 3rem 1.25rem 2rem;
          }

          /* Marquee logo smaller */
          .marquee-logo-img {
            height: 20px;
          }

          /* Member grid: 2 columns on small mobile */
          .member-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem 1.25rem;
          }

          /* Member photo smaller on mobile */
          .member-photo-wrap {
            width: 100%;
            height: 200px;
          }

          /* Ghost number smaller */
          .member-number {
            font-size: 2.8rem;
            top: -8px;
            left: -4px;
          }

          /* Disable translateY hover on touch — feels glitchy */
          .member-card:hover {
            transform: none;
          }

          /* Still show underline on tap via active */
          .member-card:active .member-name-line::after {
            width: 100%;
          }

          /* Quote block: tighter border */
          .about-quote {
            padding-left: 1rem !important;
            border-left-width: 2px !important;
          }

          /* Bottom marquee names: smaller spacing */
          .marquee-track-reverse span {
            padding: 0 1rem !important;
          }
        }

        /* ================================
           TABLET: 641px – 900px
        ================================ */
        @media (min-width: 641px) and (max-width: 900px) {
          .about-top-row {
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .about-content {
            padding: 4rem 1.75rem 2.5rem;
          }

          .member-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem 1.5rem;
          }

          .member-photo-wrap {
            width: 100%;
            height: 230px;
          }
        }

        /* ================================
           SAFE AREA (notch / home bar)
        ================================ */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .about-marquee-bottom {
            padding-bottom: max(14px, env(safe-area-inset-bottom));
          }
        }

        /* ================================
           TOUCH: disable pause-on-hover for marquee
           (hover state sticks on touch devices)
        ================================ */
        @media (hover: none) {
          .marquee-track:hover,
          .marquee-track-reverse:hover {
            animation-play-state: running;
          }
        }
      `}} />

      {/* GRAIN TEXTURE */}
      <div className="about-grain" />

      {/* ── MARQUEE TOP ── */}
      <div style={{
        background: '#e8200c',
        overflow: 'hidden',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 2,
      }}>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.95rem',
              letterSpacing: '0.25em',
              color: '#fff',
              padding: '0 1.5rem',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}>
              {item === 'DAKARA' && logoUrl ? (
                <img src={logoUrl} alt="DAKARA" className="marquee-logo-img" />
              ) : item}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="about-content">

        {/* TOP ROW: eyebrow + heading */}
        <div className="about-top-row">
          <div className="fade-up delay-1">
            <p
              className="about-band-label"
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
              About the Band
            </p>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(4rem, 9vw, 8rem)',
              fontWeight: 400,
              lineHeight: 0.9,
              letterSpacing: '0.03em',
              margin: 0,
            }}>
              DAKARA
            </h2>
          </div>

          <div className="fade-up delay-2" style={{ paddingBottom: '0.5rem' }}>
            <p
              className="about-quote"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
                lineHeight: 1.75,
                color: '#888',
                borderLeft: '2px solid #e8200c',
                paddingLeft: '1.5rem',
              }}
            >
              Dakara is a rock band from Jakarta, Indonesia. The name is taken from Indian Sanskrit,
              meaning <span style={{ color: '#ccc', fontStyle: 'normal' }}>"all time"</span> — in the
              hope that Dakara&apos;s music will be remembered forever.
            </p>
          </div>
        </div>

        <div className="divider-line fade-up delay-3" style={{ marginBottom: '4rem' }} />

        {/* MEMBERS LABEL */}
        <p className="fade-up delay-3" style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 300,
          letterSpacing: '0.4em',
          color: '#444',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          marginBottom: '3rem',
        }}>
          The Members
        </p>

        {/* MEMBER GRID */}
        <div className="member-grid">
          {members.length > 0 ? members.map((member, index) => (
            <div
              key={member.id}
              className={`member-card fade-up delay-${Math.min(index + 3, 5)}`}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Large ghost number */}
              <div className="member-number">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Photo */}
              <div className="member-photo-wrap">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} />
                ) : (
                  <div
                    className="member-placeholder"
                    style={{
                      background: '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                    }}
                  >
                    🎸
                  </div>
                )}

                {/* Hover overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(232,32,12,0.35) 0%, transparent 60%)',
                  opacity: hoveredId === member.id ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }} />
              </div>

              {/* Info */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.4rem',
                  letterSpacing: '0.08em',
                  marginBottom: '0.35rem',
                  fontWeight: 400,
                }}>
                  <span className="member-name-line">
                    {member.name.toUpperCase()}
                  </span>
                </p>
                <p style={{
                  fontFamily: "'Barlow', sans-serif",
                  color: '#555',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 400,
                  transition: 'color 0.3s',
                  ...(hoveredId === member.id && { color: '#e8200c' }),
                }}>
                  {member.role}
                </p>
              </div>
            </div>
          )) : (
            <p style={{ color: '#333', fontFamily: "'Barlow', sans-serif", gridColumn: '1/-1' }}>
              Loading members...
            </p>
          )}
        </div>
      </div>

      {/* ── MARQUEE BOTTOM (reverse, slower, muted) ── */}
      <div
        className="about-marquee-bottom"
        style={{
          overflow: 'hidden',
          padding: '14px 0',
          borderTop: '1px solid #161616',
          marginTop: '4rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div className="marquee-track marquee-track-reverse">
          {[...Array(2)].flatMap(() =>
            ['MARVI PRANA', '·', 'SATRIA FAJAR', '·', 'DIFA KARINDRA', '·', 'ARYA KUSUMA', '·'].map((item, i) => (
              <span key={i + item} style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.85rem',
                letterSpacing: '0.35em',
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
    </section>
  )
}