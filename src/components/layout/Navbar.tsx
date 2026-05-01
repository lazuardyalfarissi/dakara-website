'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './Navbar.module.css'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/profile', label: 'Profile' },
  { href: '/discography', label: 'Discography' },
  { href: '/show-dates', label: 'Show Dates' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const supabase = createClient()

  // Ambil logo dari database saat komponen dimuat
  useEffect(() => {
    async function fetchNavbarLogo() {
      const { data } = await supabase
        .from('logo_settings')
        .select('logo_url')
        .eq('id', 1)
        .maybeSingle()

      if (data?.logo_url) {
        setLogoUrl(data.logo_url)
      }
    }
    fetchNavbarLogo()
  }, [supabase])

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoContainer}>
        {logoUrl ? (
          /* Jika logo sudah diupload di Admin, tampilkan Gambarnya */
          <img 
            src={logoUrl} 
            alt="DAKARA Logo" 
            className={styles.navbarLogoImg} 
          />
        ) : (
          /* Jika belum ada logo, tampilkan Teks sebagai fallback */
          <span className={styles.logoText}>DAKARA</span>
        )}
      </Link>
      
      <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
        {navLinks.map(link => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={styles.navLink}
            onClick={() => setIsOpen(false)} // Tutup menu saat link diklik (mobile)
          >
            {link.label}
          </Link>
        ))}
      </div>

      <button 
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={isOpen ? styles.iconClose : styles.iconOpen}>
          {isOpen ? '✕' : '☰'}
        </span>
      </button>
    </nav>
  )
}