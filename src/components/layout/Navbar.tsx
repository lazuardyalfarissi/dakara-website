'use client'

import Link from 'next/link'
import { useState } from 'react'
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

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        DAKARA
      </Link>
      
      <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className={styles.navLink}>
            {link.label}
          </Link>
        ))}
      </div>

      <button 
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
    </nav>
  )
}