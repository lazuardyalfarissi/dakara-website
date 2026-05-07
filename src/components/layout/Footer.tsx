'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/',            label: 'Home' },
  { href: '/profile',     label: 'Profile' },
  { href: '/discography', label: 'Album & Song' },
  { href: '/show-dates',  label: 'Show Date' },
  { href: '/gallery',     label: 'Gallery' },
  { href: '/news',        label: 'News' },
]

const contactItems = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    label: 'Press Kit',
    value: 'Download Here',
    href: '#',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Telephone',
    value: '+62 857-7449-7521',
    href: 'tel:+6285774497521',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
    label: 'WhatsApp',
    value: '+62 857-7449-7521',
    href: 'https://wa.me/6285774497521',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'E-Mail',
    value: 'dakara@gmail.com',
    href: 'mailto:dakara@gmail.com',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Address',
    value: 'Jakarta, Indonesia',
    href: '#',
  },
]

const socialLinks = [
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchLogo() {
      const { data } = await supabase
        .from('logo_settings')
        .select('logo_url')
        .eq('id', 1)
        .maybeSingle()
      if (data?.logo_url) setLogoUrl(data.logo_url)
    }
    fetchLogo()
  }, [supabase])

  return (
    <footer style={{
      background: '#000',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── FOOTER SOCIAL ICON ── */
        .ft-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          color: #555;
          text-decoration: none;
          border: 1px solid #111;
          transition: color 0.25s ease, border-color 0.25s ease;
        }
        .ft-social-link:hover {
          color: #fff;
          border-color: #333;
        }

        /* ── CONTACT ITEM ── */
        .ft-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          text-decoration: none;
          color: inherit;
          transition: opacity 0.2s;
        }
        .ft-contact-item:hover { opacity: 0.7; }
        .ft-contact-item:hover .ft-contact-icon { color: #e8200c; }

        .ft-contact-icon {
          color: #2a2a2a;
          flex-shrink: 0;
          margin-top: 2px;
          transition: color 0.25s;
        }

        /* ── NAV LINK ── */
        .ft-nav-link {
          font-family: var(--font-barlow), 'Barlow', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #444;
          text-decoration: none;
          transition: color 0.2s;
          white-space: nowrap;
          position: relative;
        }
        .ft-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: #e8200c;
          transition: width 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        .ft-nav-link:hover { color: #fff; }
        .ft-nav-link:hover::after { width: 100%; }

        /* ── DEV LINK ── */
        .ft-dev-link {
          color: #555;
          text-decoration: none;
          font-weight: 700;
          transition: color 0.2s;
        }
        .ft-dev-link:hover { color: #fff; }

        /* ── GRAIN ── */
        .ft-grain {
          position: absolute;
          inset: 0;
          opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── CONTACT GRID ── */
        .ft-contact-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 2rem;
          padding: 2.5rem 5%;
          border-top: 1px solid #111;
          border-bottom: 1px solid #111;
        }

        @media (max-width: 900px) {
          .ft-contact-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 560px) {
          .ft-contact-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
        }

        /* ── BOTTOM BAR ── */
        .ft-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.25rem 5%;
          flex-wrap: wrap;
        }

        .ft-nav-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .ft-bottom-bar {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
            padding: 1.5rem 5%;
          }
          .ft-nav-row {
            justify-content: center;
            gap: 1.25rem;
          }
        }
      `}} />

      {/* GRAIN */}
      <div className="ft-grain" />

      {/* ── TOP: LOGO + TAGLINE + SOCIALS ── */}
      <div style={{
        textAlign: 'center',
        padding: '4rem 5% 3.5rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            href="/"
            aria-label="DAKARA — Home"
            style={{
              display: 'inline-block',
              transition: 'opacity 0.25s ease',
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="DAKARA"
                style={{
                  display: 'block',
                  height: '80px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                  opacity: 1,
                  margin: '0 auto',
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                }}
              />
            ) : (
              <span style={{
                fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                fontSize: '1.8rem',
                fontWeight: 700,
                letterSpacing: '0.35em',
                color: '#fff',
              }}>
                DAKARA
              </span>
            )}
          </Link>
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          color: '#ccc',
          lineHeight: 1.9,
          maxWidth: '520px',
          margin: '0 auto 2.25rem',
        }}>
          This is our official website which contains everything about Dakara.<br />
          Especially for all of you!
        </p>

        {/* Social icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
        }}>
          {socialLinks.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social-link"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── CONTACT BAR ── */}
      <div className="ft-contact-grid" style={{ position: 'relative', zIndex: 1 }}>
        {contactItems.map(item => (
          <a
            key={item.label}
            href={item.href}
            className="ft-contact-item"
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <span className="ft-contact-icon">{item.icon}</span>
            <span>
              <p style={{
                fontFamily: "var(--font-barlow), 'Barlow', sans-serif",
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#333',
                fontWeight: 300,
                marginBottom: '0.2rem',
              }}>
                {item.label}
              </p>
              <p style={{
                fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                fontSize: '0.72rem',
                letterSpacing: '0.04em',
                color: '#888',
                fontWeight: 700,
              }}>
                {item.value}
              </p>
            </span>
          </a>
        ))}
      </div>

      {/* ── BOTTOM BAR: NAV + COPYRIGHT ── */}
      <div className="ft-bottom-bar" style={{ position: 'relative', zIndex: 1 }}>
        {/* Nav links */}
        <nav className="ft-nav-row" aria-label="Footer navigation">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="ft-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p style={{
          fontFamily: "var(--font-barlow), 'Barlow', sans-serif",
          fontSize: '0.68rem',
          letterSpacing: '0.15em',
          color: '#2a2a2a',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          © Dakara 2026, All Rights Reserved —{' '}
          <a
            href="https://lazuardyalf.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ft-dev-link"
          >
            Lazuardy Al Farissi
          </a>
        </p>
      </div>
    </footer>
  )
}