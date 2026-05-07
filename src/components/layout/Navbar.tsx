'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './Navbar.module.css'

const navLinks = [
  { href: '/',              label: 'Home' },
  { href: '/profile',       label: 'Profile' },
  { href: '/discography',   label: 'Album & Song' },
  { href: '/show-dates',    label: 'Show Dates' },
  { href: '/gallery',       label: 'Gallery' },
  { href: '/news',          label: 'News' },
]

export default function Navbar() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [logoUrl,   setLogoUrl]   = useState<string | null>(null)
  const [scrolled,  setScrolled]  = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  /* ── fetch logo ── */
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

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── close mobile menu on route change ── */
  useEffect(() => { setIsOpen(false) }, [pathname])

  /* ── lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>

      {/* ── LOGO ── */}
      <Link href="/" className={styles.logoContainer} aria-label="DAKARA — Home">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="DAKARA"
            className={styles.logoImg}
          />
        ) : (
          <span className={styles.logoText}>DAKARA</span>
        )}
      </Link>

      {/* ── DESKTOP LINKS ── */}
      <div className={styles.navLinks}>
        {navLinks.map(link => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {isActive && <span className={styles.activeDot} aria-hidden="true" />}
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className={styles.navRight}>
        <Link href="/show-dates" className={styles.ctaBtn}>
          Tickets&nbsp;→
        </Link>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setIsOpen(prev => !prev)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      <div
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!isOpen}
      >
        {/* backdrop */}
        <div
          className={styles.mobileBackdrop}
          onClick={() => setIsOpen(false)}
        />

        <div className={styles.mobilePanel}>
          {/* decorative label */}
          <p className={styles.mobilePanelLabel}>Navigation</p>

          <div className={styles.mobileLinkList}>
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
                  style={{ animationDelay: `${idx * 55}ms` }}
                >
                  <span className={styles.mobileLinkNum}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                  {isActive && (
                    <span className={styles.mobileLinkDot} aria-hidden="true" />
                  )}
                </Link>
              )
            })}
          </div>

          <Link
            href="/show-dates"
            className={styles.mobileCtaBtn}
            onClick={() => setIsOpen(false)}
          >
            Get Tickets →
          </Link>
        </div>
      </div>
    </nav>
  )
}