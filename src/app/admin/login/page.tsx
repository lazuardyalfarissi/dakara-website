'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('') // Reset error setiap kali mencoba login

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Kita handle redirect manual agar lebih stabil
      })

      if (result?.error) {
        setError('Email atau password salah!')
        setLoading(false)
      } else {
        // Force refresh ke halaman admin untuk memastikan session terdeteksi
        window.location.href = '/admin'
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#111' }}>
      <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#fff', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '0.2em' }}>DAKARA</h1>
        <p style={{ color: '#555', textAlign: 'center', marginBottom: '2rem', fontSize: '0.85rem' }}>Admin Panel</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            required
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff' }} 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            required
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff' }} 
          />
          
          {error && <p style={{ color: '#ff4444', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '0.75rem', 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}