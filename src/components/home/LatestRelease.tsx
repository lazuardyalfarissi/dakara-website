'use client'

import React, { useState, useEffect, useRef } from 'react'

interface Props {
  release: any
}

// ── SVG Icons ──────────────────────────────────────────────────
const SpotifyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.503 17.306c-.216.354-.675.467-1.028.249-2.822-1.723-6.375-2.112-10.559-1.157-.403.092-.811-.157-.903-.559-.092-.403.157-.811.559-.903 4.582-1.049 8.514-.607 11.682 1.328.353.218.466.677.249 1.03zm1.468-3.259c-.272.443-.847.585-1.289.313-3.23-1.986-8.153-2.564-11.972-1.405-.499.152-1.026-.13-1.178-.629-.151-.499.13-1.026.629-1.178 4.364-1.324 9.803-.674 13.518 1.609.442.272.584.847.312 1.29zm.126-3.419c-3.874-2.301-10.268-2.513-13.987-1.385-.595.18-1.226-.164-1.407-.759-.18-.595.164-1.226.759-1.407 4.271-1.297 11.334-1.037 15.787 1.606.534.317.709 1.006.392 1.54-.316.533-1.005.71-1.544.405z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const AppleMusicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.75.058 4.007.154 3.31.488 2.11 1.03 1.27 1.896.734 3.095a7.053 7.053 0 0 0-.38 1.494 10.516 10.516 0 0 0-.114 1.4c-.003.05-.008.1-.01.15v12.733c.01.145.018.29.028.435.04.665.14 1.318.37 1.943.324.872.832 1.617 1.573 2.196.706.55 1.51.878 2.39 1.02.58.092 1.166.12 1.754.127.09.001.18.004.27.004H18.19c.11 0 .22-.004.33-.008.62-.02 1.235-.083 1.837-.246 1.16-.31 2.082-.93 2.77-1.886.55-.75.854-1.6.985-2.502.07-.48.1-.964.113-1.45.003-.072.006-.143.009-.215V6.12c-.004-.067-.004-.13-.004-.2-.002.07-.003.136-.004.204zm-6.742 8.976a.85.85 0 0 1-.508.764c-.273.128-.547.138-.828.064L9.93 14.32l-.064-.022V8.55l6.87 1.857v4.693h.512zM16.384 9.53l-6.518-1.76V6.93l6.518 1.76V9.53z"/>
  </svg>
)

const DeezerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.944 16.67h4.944v1.381h-4.944zm-6.236 0h4.943v1.381h-4.943zm-6.236 0H11.4v1.381H6.472zm-6.236 0h4.942v1.381H.236zm18.708-2.763h4.944v1.381h-4.944zm-6.236 0h4.943v1.381h-4.943zm-6.236 0H11.4v1.381H6.472zm12.472-2.762h4.944v1.381h-4.944zm-6.236 0h4.943v1.381h-4.943zm12.472-2.763h4.944v1.381h-4.944zm-6.236 0h4.943v1.381h-4.943zm6.236-2.763h4.944v1.381h-4.944z"/>
  </svg>
)

const TidalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.012 3.992L8.008 7.996l4.004 4.004 4.004-4.004zM8.008 7.996L4.004 12l4.004 4.004L12.012 12zm7.984 0L12.012 12l3.98 3.996L20.016 12z"/>
  </svg>
)

const SoundCloudIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.015 0-.03.01-.03.01C.484 12.31 0 12.84 0 13.486c0 .654.49 1.183 1.145 1.25.66.067 20.24 0 20.24 0 .623 0 1.13-.51 1.13-1.14 0-.625-.507-1.134-1.13-1.134-.036 0-.07.004-.104.008.024-.13.038-.264.038-.4 0-1.29-1.05-2.334-2.34-2.334-.213 0-.42.03-.615.084.004-.06.007-.12.007-.18 0-2.01-1.63-3.64-3.64-3.64-1.39 0-2.6.78-3.22 1.93-.42-.26-.9-.41-1.42-.41-1.5 0-2.72 1.22-2.72 2.72 0 .1.01.196.02.292-.072-.01-.145-.015-.22-.015-1.006 0-1.82.816-1.82 1.822 0 .182.027.358.076.523z"/>
  </svg>
)

const YouTubeMusicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L16.2 12l-6.516 3.54z"/>
  </svg>
)

const AmazonMusicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.047-.872-1.234-1.276-1.814-2.106-1.734 1.768-2.962 2.297-5.209 2.297-2.66 0-4.731-1.642-4.731-4.927 0-2.565 1.391-4.309 3.37-5.164 1.715-.756 4.11-.891 5.942-1.095V6.41c0-.756.06-1.648-.385-2.302-.384-.581-1.124-.822-1.775-.822-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.582l-3.061-.333c-.259-.056-.548-.266-.472-.66C5.57 1.8 8.299.083 11.297.001c1.53 0 3.53.407 4.734 1.568 1.53 1.43 1.384 3.336 1.384 5.41v4.905c0 1.474.612 2.122 1.188 2.917.202.282.246.621-.01.832l-1.439 1.162zM21.698 20.516c-1.413 1.165-3.464 1.73-5.236 1.73-2.48 0-4.715-.916-6.405-2.439-.133-.12-.014-.283.145-.19 1.824 1.061 4.08 1.7 6.407 1.7 1.571 0 3.299-.325 4.888-.999.24-.102.44.158.201.198zM22.376 19.745c-.181-.232-1.199-.11-1.658-.055-.14.017-.161-.105-.035-.192.813-.571 2.146-.406 2.301-.215.155.192-.041 1.521-.804 2.155-.117.099-.228.046-.176-.083.172-.429.558-1.39.372-1.61z"/>
  </svg>
)

// ── Platform config ────────────────────────────────────────────
const PLATFORMS = [
  { key: 'spotify_url',       label: 'Spotify',        Icon: SpotifyIcon,      color: '#1DB954', hoverColor: '#1ed760' },
  { key: 'apple_music_url',   label: 'Apple Music',    Icon: AppleMusicIcon,   color: '#FC3C44', hoverColor: '#ff5c63' },
  { key: 'youtube_url',       label: 'YouTube',        Icon: YouTubeIcon,      color: '#FF0000', hoverColor: '#ff3333' },
  { key: 'youtube_music_url', label: 'YT Music',       Icon: YouTubeMusicIcon, color: '#FF0000', hoverColor: '#ff3333' },
  { key: 'deezer_url',        label: 'Deezer',         Icon: DeezerIcon,       color: '#FEAA2D', hoverColor: '#ffbe55' },
  { key: 'tidal_url',         label: 'Tidal',          Icon: TidalIcon,        color: '#00FFFF', hoverColor: '#66ffff' },
  { key: 'amazon_music_url',  label: 'Amazon Music',   Icon: AmazonMusicIcon,  color: '#00A8E1', hoverColor: '#33bef0' },
  { key: 'soundcloud_url',    label: 'SoundCloud',     Icon: SoundCloudIcon,   color: '#FF5500', hoverColor: '#ff7733' },
]

// ── Vinyl record SVG decoration ────────────────────────────────
const VinylDecor = ({ spinning }: { spinning: boolean }) => (
  <svg
    viewBox="0 0 300 300"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      // ✅ FIX: was right:-80px causing overflow; now hidden safely within cover
      right: '-60px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '260px',
      height: '260px',
      opacity: 0.06,
      animation: spinning ? 'vinyl-spin 12s linear infinite' : 'none',
      pointerEvents: 'none',
    }}
  >
    <circle cx="150" cy="150" r="148" fill="#fff" stroke="#333" strokeWidth="2"/>
    {[140, 125, 110, 95, 80, 65, 50, 35, 22].map((r, i) => (
      <circle key={i} cx="150" cy="150" r={r} fill="none" stroke="#555" strokeWidth="0.6"/>
    ))}
    <circle cx="150" cy="150" r="20" fill="#111"/>
    <circle cx="150" cy="150" r="6" fill="#333"/>
    <circle cx="150" cy="150" r="2" fill="#666"/>
  </svg>
)

// ── Waveform bars decoration ───────────────────────────────────
const WaveformDecor = ({ active }: { active: boolean }) => {
  const bars = Array.from({ length: 40 }, (_, i) => ({
    height: Math.random() * 60 + 10,
    delay: i * 0.05,
  }))
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      height: '60px',
      marginBottom: '2rem',
      opacity: 0.35,
    }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            width: '3px',
            height: active ? `${bar.height}%` : '20%',
            background: 'linear-gradient(to top, #e8200c, #ff6b6b)',
            borderRadius: '2px',
            transition: `height ${0.3 + bar.delay}s ease`,
            animation: active ? `wave-pulse ${0.8 + (i % 4) * 0.2}s ease-in-out ${bar.delay}s infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
export default function LatestRelease({ release }: Props) {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [coverLoaded, setCoverLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 } // ✅ FIX: lower threshold so mobile triggers earlier
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (!release) return null

  const availablePlatforms = PLATFORMS.filter(p => release[p.key])
  const year = release.release_date ? new Date(release.release_date).getFullYear() : '2026'

  const marqueeItems = [
    release.title?.toUpperCase() || 'NEW RELEASE',
    '✦',
    'DAKARA',
    '✦',
    release.type === 'single' ? 'SINGLE' : 'ALBUM',
    '✦',
    `OUT NOW ${year}`,
    '✦',
    release.title?.toUpperCase() || 'NEW RELEASE',
    '✦',
    'JAKARTA ROCK COLLECTIVE',
    '✦',
    'STREAM NOW',
    '✦',
  ]

  return (
    <section
      ref={sectionRef}
      id="latest-release"
      style={{
        background: '#080808',
        color: '#fff',
        position: 'relative',
        // ✅ FIX: clip overflow from VinylDecor and bg-text
        overflow: 'hidden',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');

        /* ── MARQUEE ── */
        .lr-marquee-track {
          display: flex;
          width: max-content;
          animation: lr-scroll 20s linear infinite;
          will-change: transform;
        }
        .lr-marquee-track-rev {
          animation: lr-scroll-rev 26s linear infinite;
        }
        @keyframes lr-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes lr-scroll-rev {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .lr-marquee-track:hover,
        .lr-marquee-track-rev:hover {
          animation-play-state: paused;
        }

        /* ── VINYL SPIN ── */
        @keyframes vinyl-spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to   { transform: translateY(-50%) rotate(360deg); }
        }

        /* ── WAVEFORM ── */
        @keyframes wave-pulse {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }

        /* ── COVER GLOW PULSE ── */
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 60px 0px rgba(232,32,12,0.3), 0 30px 80px rgba(0,0,0,0.9); }
          50%       { box-shadow: 0 0 100px 20px rgba(232,32,12,0.15), 0 30px 80px rgba(0,0,0,0.9); }
        }

        /* ── PLATFORM BUTTON ── */
        .lr-platform-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 1.2rem;
          border: 1px solid #222;
          background: #0f0f0f;
          color: #888;
          text-decoration: none;
          border-radius: 6px;
          font-family: 'Barlow', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        .lr-platform-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .lr-platform-btn:hover {
          transform: translateY(-3px);
          border-color: currentColor;
          color: #fff;
        }
        .lr-platform-btn .lr-icon-wrap {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .lr-platform-btn .lr-label {
          position: relative;
          z-index: 1;
        }

        /* ── PRIMARY BUTTON ── */
        .lr-primary-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: #e8200c;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.18em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
          overflow: hidden;
          /* ✅ FIX: prevent button from overflowing on small screens */
          max-width: 100%;
          box-sizing: border-box;
        }
        .lr-primary-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .lr-primary-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(232,32,12,0.4);
        }
        .lr-primary-btn:hover::after { opacity: 1; }

        /* ── FADE-UP ── */
        .lr-fade {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1);
        }
        .lr-fade.lr-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .lr-d1 { transition-delay: 0.05s; }
        .lr-d2 { transition-delay: 0.15s; }
        .lr-d3 { transition-delay: 0.28s; }
        .lr-d4 { transition-delay: 0.42s; }
        .lr-d5 { transition-delay: 0.55s; }
        .lr-d6 { transition-delay: 0.68s; }

        /* ── COVER SLIDE-IN ── */
        .lr-cover-wrap {
          opacity: 0;
          transform: translateX(-60px) rotate(-3deg);
          transition: opacity 1s cubic-bezier(0.23,1,0.32,1), transform 1s cubic-bezier(0.23,1,0.32,1);
          transition-delay: 0.1s;
        }
        .lr-cover-wrap.lr-visible {
          opacity: 1;
          transform: translateX(0) rotate(0deg);
        }

        /* ── GRAIN ── */
        .lr-grain {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 300px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── TYPE BADGE ── */
        .lr-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.9rem;
          border: 1px solid #e8200c;
          color: #e8200c;
          font-family: 'Barlow', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }
        .lr-type-badge::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(232,32,12,0.2), transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          from { left: -100%; }
          to   { left: 200%; }
        }

        /* ── DIVIDER ── */
        .lr-divider {
          height: 1px;
          background: linear-gradient(to right, #e8200c, #333, transparent);
          transform-origin: left;
          animation: lr-grow 1.2s ease-out forwards;
        }
        @keyframes lr-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ── SCROLLING BG TEXT ── */
        .lr-bg-text {
          position: absolute;
          font-family: 'Bebas Neue', sans-serif;
          /* ✅ FIX: constrain size so it doesn't cause horizontal scroll */
          font-size: clamp(5rem, 15vw, 16rem);
          color: rgba(255,255,255,0.02);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          letter-spacing: 0.05em;
          z-index: 0;
          /* ✅ FIX: ensure it doesn't push layout */
          max-width: 100%;
          overflow: hidden;
        }

        /* ── COVER TILT ── */
        .lr-cover-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.23,1,0.32,1);
        }
        .lr-cover-container:hover .lr-cover-img {
          transform: scale(1.04);
        }

        /* ── CORNER ACCENT ── */
        .lr-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: #e8200c;
          border-style: solid;
          z-index: 2;
        }
        .lr-corner-tl { top: -6px; left: -6px; border-width: 2px 0 0 2px; }
        .lr-corner-br { bottom: -6px; right: -6px; border-width: 0 2px 2px 0; }

        /* ══════════════════════════════════════════
           ✅ MOBILE RESPONSIVE FIXES
           ══════════════════════════════════════════ */

        /* Main grid: stack on mobile */
        .lr-main-grid {
          display: grid;
          grid-template-columns: minmax(260px, 340px) 1fr;
          gap: 5rem;
          align-items: center;
        }

        @media (max-width: 768px) {
          .lr-main-grid {
            /* Stack cover above info on mobile */
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          /* Limit cover width on mobile so it doesn't fill full screen */
          .lr-cover-wrap {
            max-width: 280px;
            margin: 0 auto;
            /* Reset the slide-in transform origin to avoid clipping */
            transform: translateY(20px) !important;
          }
          .lr-cover-wrap.lr-visible {
            transform: translateY(0) !important;
          }

          /* Center the cover year label */
          .lr-cover-year {
            text-align: center;
          }

          /* Reduce main padding on mobile */
          .lr-main-content {
            padding: 3rem 1.25rem 2.5rem !important;
          }

          /* Hide waveform on very small screens to save space */
          .lr-waveform-wrap {
            display: none;
          }

          /* Primary button: full width on mobile */
          .lr-primary-btn {
            width: 100%;
            justify-content: center;
          }

          /* Platform buttons: 2 per row on mobile */
          .lr-platforms-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .lr-platform-btn {
            justify-content: center;
          }

          /* Description text slightly smaller */
          .lr-description {
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 480px) {
          /* Single column platform buttons on very small screens */
          .lr-platforms-grid {
            grid-template-columns: 1fr !important;
          }

          .lr-main-content {
            padding: 2.5rem 1rem 2rem !important;
          }
        }
      `}} />

      {/* GRAIN */}
      <div className="lr-grain" />

      {/* SCROLLING BG TEXT */}
      <div className="lr-bg-text">DAKARA</div>

      {/* ── TOP MARQUEE (red) ── */}
      <div style={{
        background: '#e8200c',
        overflow: 'hidden',
        padding: '9px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 2,
      }}>
        <div className="lr-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.88rem',
              letterSpacing: '0.28em',
              color: '#fff',
              padding: '0 1.4rem',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div
        className="lr-main-content"
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '5rem 2rem 4rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="lr-main-grid">

          {/* LEFT: COVER ART */}
          <div className={`lr-cover-wrap ${isVisible ? 'lr-visible' : ''}`}>
            <div
              className="lr-cover-container"
              style={{
                position: 'relative',
                borderRadius: '4px',
                overflow: 'hidden',
                animation: coverLoaded ? 'glow-pulse 4s ease-in-out infinite' : 'none',
                boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
                cursor: 'default',
              }}
            >
              {/* Corner accents */}
              <div className="lr-corner lr-corner-tl" />
              <div className="lr-corner lr-corner-br" />

              {/* COVER IMAGE */}
              {release.cover_url ? (
                <img
                  src={release.cover_url}
                  alt={release.title}
                  className="lr-cover-img"
                  onLoad={() => setCoverLoaded(true)}
                  style={{ aspectRatio: '1', display: 'block', width: '100%' }}
                />
              ) : (
                <div style={{
                  aspectRatio: '1',
                  width: '100%',
                  background: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                }}>
                  🎵
                </div>
              )}

              {/* Red bottom sweep */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '40%',
                background: 'linear-gradient(to top, rgba(232,32,12,0.5) 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />

              {/* Vinyl decoration */}
              <VinylDecor spinning={coverLoaded} />
            </div>

            {/* Year label below cover */}
            <p className="lr-cover-year" style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.85rem',
              letterSpacing: '0.4em',
              color: '#333',
              marginTop: '1.2rem',
              textAlign: 'center',
            }}>
              — {year} —
            </p>
          </div>

          {/* RIGHT: INFO */}
          <div style={{ position: 'relative' }}>

            {/* Eyebrow + badge */}
            <div className={`lr-fade lr-d1 ${isVisible ? 'lr-visible' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <p style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.4em',
                color: '#444',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                Latest Release
              </p>
              <span className="lr-type-badge">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8200c', display: 'inline-block' }} />
                {release.type === 'single' ? 'Single' : 'Album'}
              </span>
            </div>

            {/* BIG TITLE */}
            <h2 className={`lr-fade lr-d2 ${isVisible ? 'lr-visible' : ''}`} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 10vw, 6.5rem)',
              fontWeight: 400,
              lineHeight: 0.92,
              letterSpacing: '0.04em',
              margin: '0 0 1.5rem',
              textTransform: 'uppercase',
              // ✅ FIX: prevent long title from overflowing
              wordBreak: 'break-word',
            }}>
              {release.title}
            </h2>

            {/* Divider */}
            {isVisible && (
              <div className="lr-divider" style={{ marginBottom: '1.5rem', width: '80%' }} />
            )}

            {/* Waveform */}
            <div className="lr-waveform-wrap">
              <WaveformDecor active={isVisible} />
            </div>

            {/* Description */}
            {release.description && (
              <p className={`lr-fade lr-d3 lr-description ${isVisible ? 'lr-visible' : ''}`} style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
                lineHeight: 1.8,
                color: '#666',
                maxWidth: '500px',
                marginBottom: '2.5rem',
                borderLeft: '2px solid #222',
                paddingLeft: '1.2rem',
              }}>
                {release.description}
              </p>
            )}

            {/* PRIMARY LISTEN BUTTON (first available platform) */}
            {availablePlatforms.length > 0 && (() => {
              const PrimaryIcon = availablePlatforms[0].Icon
              return (
                <div className={`lr-fade lr-d4 ${isVisible ? 'lr-visible' : ''}`} style={{ marginBottom: '1.8rem' }}>
                  <a
                    href={release[availablePlatforms[0].key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lr-primary-btn"
                  >
                    <PrimaryIcon />
                    <span>DENGARKAN DI {availablePlatforms[0].label.toUpperCase()}</span>
                    <span style={{ marginLeft: '0.3rem', opacity: 0.7 }}>↗</span>
                  </a>
                </div>
              )
            })()}

            {/* ALL PLATFORMS GRID */}
            {availablePlatforms.length > 1 && (
              <div className={`lr-fade lr-d5 ${isVisible ? 'lr-visible' : ''}`}>
                <p style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '0.68rem',
                  letterSpacing: '0.3em',
                  color: '#333',
                  textTransform: 'uppercase',
                  marginBottom: '0.9rem',
                }}>
                  Tersedia di
                </p>
                <div
                  className="lr-platforms-grid"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.6rem',
                  }}
                >
                  {availablePlatforms.slice(1).map((platform) => {
                    const isHovered = hoveredPlatform === platform.key
                    const PlatformIcon = platform.Icon
                    return (
                      <a
                        key={platform.key}
                        href={release[platform.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lr-platform-btn"
                        style={{
                          color: isHovered ? platform.color : '#555',
                          borderColor: isHovered ? platform.color : '#1f1f1f',
                          background: isHovered ? `${platform.color}15` : '#0f0f0f',
                        }}
                        onMouseEnter={() => setHoveredPlatform(platform.key)}
                        onMouseLeave={() => setHoveredPlatform(null)}
                      >
                        <span className="lr-icon-wrap">
                          <PlatformIcon />
                        </span>
                        <span className="lr-label">{platform.label}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* No platforms message */}
            {availablePlatforms.length === 0 && (
              <p className={`lr-fade lr-d4 ${isVisible ? 'lr-visible' : ''}`}
                style={{ color: '#333', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem' }}>
                Coming soon to all platforms.
              </p>
            )}

          </div>
        </div>
      </div>

      {/* ── BOTTOM MARQUEE (muted, reversed) ── */}
      <div style={{
        overflow: 'hidden',
        padding: '12px 0',
        borderTop: '1px solid #111',
        position: 'relative',
        zIndex: 2,
      }}>
        <div className="lr-marquee-track lr-marquee-track-rev">
          {[...Array(2)].flatMap((_, di) =>
            ['STREAM NOW', '·', 'ALL PLATFORMS', '·', 'DAKARA', '·', 'JAKARTA', '·', 'ROCK', '·', 'COLLECTIVE', '·'].map((item, i) => (
              <span key={`${di}-${i}`} style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.8rem',
                letterSpacing: '0.4em',
                color: '#1e1e1e',
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