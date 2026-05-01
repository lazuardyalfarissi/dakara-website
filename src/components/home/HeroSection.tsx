export default function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
      padding: '2rem',
    }}>
      <h1 style={{
        fontSize: 'clamp(4rem, 15vw, 12rem)',
        fontWeight: '900',
        letterSpacing: '0.2em',
        lineHeight: 1,
        margin: 0,
      }}>
        DAKARA
      </h1>
      <p style={{
        fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
        letterSpacing: '0.4em',
        color: '#999',
        marginTop: '1rem',
        textTransform: 'uppercase',
      }}>
        Rock Band from Jakarta, Indonesia
      </p>
      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
        <a href="#about" style={{
          padding: '0.75rem 2rem',
          border: '1px solid #fff',
          color: '#fff',
          textDecoration: 'none',
          letterSpacing: '0.2em',
          fontSize: '0.85rem',
          transition: 'all 0.3s',
        }}>
          KNOW MORE
        </a>
        <a href="/discography" style={{
          padding: '0.75rem 2rem',
          background: '#fff',
          color: '#000',
          textDecoration: 'none',
          letterSpacing: '0.2em',
          fontSize: '0.85rem',
        }}>
          DISCOGRAPHY
        </a>
      </div>
    </section>
  )
}