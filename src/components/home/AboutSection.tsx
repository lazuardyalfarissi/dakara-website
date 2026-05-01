export default function AboutSection() {
  return (
    <section id="about" style={{
      padding: '6rem 2rem',
      background: '#0a0a0a',
      color: '#fff',
      maxWidth: '900px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <p style={{ letterSpacing: '0.3em', color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
        ABOUT US
      </p>
      <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', marginBottom: '2rem', letterSpacing: '0.1em' }}>
        DAKARA
      </h2>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#aaa', marginBottom: '3rem' }}>
        Dakara is a rock band from Jakarta, Indonesia consisting of Marvi Prana (lead guitar, vocals),
        Satria Fajar (organ, vocals), Difa Karindra (bass, vocals), and Arya Kusuma (drums).
        Dakara&apos;s name is taken from Indian Sanskrit which means &quot;all time&quot; in the hope
        that Dakara&apos;s musical works will be remembered for all time. Their goal is to introduce
        rock music which is not only entertainment for teenagers, but also art that deserves to be
        heard and enjoyed.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        {[
          { name: 'Marvi Prana', role: 'Lead Guitar, Vocals' },
          { name: 'Satria Fajar', role: 'Organ, Vocals' },
          { name: 'Difa Karindra', role: 'Bass, Vocals' },
          { name: 'Arya Kusuma', role: 'Drums' },
        ].map((member) => (
          <div key={member.name}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: '#222', margin: '0 auto 1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem',
            }}>
              🎸
            </div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{member.name}</p>
            <p style={{ color: '#666', fontSize: '0.85rem' }}>{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}