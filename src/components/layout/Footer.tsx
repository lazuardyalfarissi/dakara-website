export default function Footer() {
  return (
    <footer style={{ 
      background: '#000', 
      color: '#444', 
      textAlign: 'center', 
      padding: '3rem 2rem',
      borderTop: '1px solid #111' 
    }}>
      {/* Menggunakan dangerouslySetInnerHTML agar Next.js tidak memproses style sebagai teks biasa */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dev-link { 
          color: #888; 
          text-decoration: none; 
          font-weight: bold; 
          transition: all 0.2s ease; 
        }
        .dev-link:hover { 
          color: #fff !important; 
          text-shadow: 0 0 8px rgba(255,255,255,0.3);
        }
      `}} />
      
      <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
        © 2026 DAKARA. ALL RIGHTS RESERVED.
      </p>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
        POWERED BY{' '}
        <a 
          href="https://lazuardyalf.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="dev-link"
        >
          LAZUARDY AL FARISSI
        </a>
      </p>
    </footer>
  )
}