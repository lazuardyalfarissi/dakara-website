'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

export default function HeroSection() {
  const [slides, setSlides] = useState<any[]>([])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoReady, setLogoReady] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchHeroData() {
      const { data: logoData } = await supabase
        .from('logo_settings')
        .select('logo_url')
        .eq('id', 1)
        .maybeSingle()

      if (logoData?.logo_url) {
        const img = new Image()
        img.onload = () => {
          setLogoUrl(logoData.logo_url)
          setLogoReady(true)
        }
        img.onerror = () => setLogoReady(true)
        img.src = logoData.logo_url
      } else {
        setLogoReady(true)
      }

      const { data: bannerData } = await supabase
        .from('hero_settings')
        .select('*')
        .order('order_index', { ascending: true })

      if (bannerData && bannerData.length > 0) {
        setSlides(bannerData)
      } else {
        setSlides([{ background_url: '/images/hero-bg.jpg' }])
      }
    }
    fetchHeroData()
  }, [supabase])

  return (
    <section className="hero-section">
      <style dangerouslySetInnerHTML={{ __html: `

        /* ── Layout utama ── */
        .hero-section {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #000;
          box-sizing: border-box;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        /* ── Logo appear ── */
        @keyframes logo-appear {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── 3D Swing: depan → kiri → belakang → kanan → depan ── */
        @keyframes logo-3d-swing {
          0%   { transform: rotateY(0deg);    }
          25%  { transform: rotateY(-60deg);  }
          50%  { transform: rotateY(-180deg); }
          75%  { transform: rotateY(-300deg); }
          100% { transform: rotateY(-360deg); }
        }

        /* ── Float naik turun halus (pada wrapper) ── */
        @keyframes logo-float {
          0%,  100% { transform: translateY(0px);   }
          50%        { transform: translateY(-10px); }
        }

        /* ── Wrapper: gabung appear + float ── */
        .hero-logo-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: clamp(140px, 45vw, 600px);
          max-width: 85vw;
          perspective: 900px;
          animation: logo-appear 0.8s ease forwards, logo-float 4s ease-in-out 0.8s infinite;
          opacity: 0;
        }

        @media (max-width: 768px) {
          .hero-logo-wrapper {
            width: clamp(140px, 60vw, 300px) !important;
            max-width: 80vw !important;
          }
        }

        /* ── Glow shadow di bawah logo ── */
        .hero-logo-wrapper::after {
          content: '';
          position: absolute;
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          width: 55%;
          height: 16px;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 80, 0, 0.3) 0%,
            transparent 70%
          );
          filter: blur(5px);
          pointer-events: none;
          z-index: 1;
        }

        /* ── Logo image: 3D swing ── */
        .hero-logo {
          position: relative;
          z-index: 2;
          width: 100%;
          filter:
            drop-shadow(0 0 40px rgba(255, 60, 0, 0.45))
            drop-shadow(0 4px 24px rgba(0, 0, 0, 0.85));
          pointer-events: none;
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: visible;
          animation: logo-3d-swing 6s linear 0.8s infinite;
        }

        /* ── Logo text fallback: 3D swing ── */
        .hero-logo-text {
          position: relative;
          z-index: 2;
          width: 100%;
          font-size: clamp(3rem, 10vw, 5rem);
          font-weight: 900;
          color: #fff;
          letter-spacing: 0.2em;
          text-shadow: 0 0 30px rgba(255, 60, 0, 0.4);
          font-family: Impact, "Arial Black", sans-serif;
          margin: 0;
          text-align: center;
          pointer-events: none;
          will-change: transform;
          transform-style: preserve-3d;
          animation: logo-3d-swing 6s linear 0.8s infinite;
        }

        /* ── Subtitle ── */
        @keyframes subtitle-entrance {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0px);  }
        }

        .hero-subtitle {
          animation: subtitle-entrance 1s ease-out 0.9s both;
        }

        /* ── Scanline ── */
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100%);  }
        }

        .hero-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 80, 0, 0.18) 50%,
            transparent 100%
          );
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 5;
          will-change: transform;
        }

        @media (hover: none) {
          .hero-scanline { display: none; }
        }

        /* ── Swiper & Pagination ── */
        .mySwiper {
          width: 100%;
          height: 100%;
          cursor: grab;
        }
        .mySwiper:active { cursor: grabbing; }

        .swiper-button-next,
        .swiper-button-prev { display: none !important; }

        .swiper-pagination-custom {
          position: absolute;
          top: calc(20px + env(safe-area-inset-top, 0px));
          left: 0;
          right: 0;
          display: flex;
          gap: 6px;
          padding: 0 20px;
          z-index: 50;
        }

        .swiper-pagination-bullet {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 2px !important;
          margin: 0 !important;
          opacity: 1 !important;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          pointer-events: auto;
        }

        .swiper-pagination-bullet-active::after {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 100%;
          background: linear-gradient(to right, #ff4500, #ff8c00);
          transform-origin: left;
          animation: slideProgress 5s linear forwards;
        }

        @keyframes slideProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        @media (max-width: 768px) {
          .swiper-pagination-custom {
            top: calc(12px + env(safe-area-inset-top, 0px)) !important;
            padding: 0 14px !important;
            gap: 4px !important;
          }
          .swiper-pagination-bullet { height: 2px !important; }
        }

        /* ── Vignette ── */
        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0, 0, 0, 0.55) 100%
          );
          z-index: 3;
          pointer-events: none;
        }

        /* ── Scroll indicator ── */
        @keyframes scroll-bounce {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
          50%       { opacity: 0.9; transform: translateX(-50%) translateY(8px); }
        }

        .scroll-indicator {
          animation: scroll-bounce 2.5s ease-in-out infinite;
        }

      `}} />

      {/* Scanline */}
      <div className="hero-scanline" />

      {/* Swiper background */}
      {slides.length > 0 && (
        <Swiper
          key={slides.length}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
          spaceBetween={0}
          slidesPerView={1}
          grabCursor={true}
          allowTouchMove={true}
          pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={slides.length > 1}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id || index}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url("${slide.background_url}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(
                    to bottom,
                    rgba(0,0,0,0.35) 0%,
                    rgba(0,0,0,0.0)  30%,
                    rgba(0,0,0,0.0)  60%,
                    rgba(0,0,0,0.85) 100%
                  )`,
                }} />
              </div>
            </SwiperSlide>
          ))}

          <div className="swiper-pagination-custom" />
        </Swiper>
      )}

      {/* Vignette overlay */}
      <div className="hero-vignette" />

      {/* Logo + subtitle */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
          gap: '0.5rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          boxSizing: 'border-box',
        }}
      >
        {logoReady && (
          <>
            <div className="hero-logo-wrapper">
              {logoUrl ? (
                <img src={logoUrl} alt="DAKARA Logo" className="hero-logo" />
              ) : (
                <h1 className="hero-logo-text">DAKARA</h1>
              )}
            </div>

            <div className="hero-subtitle" style={{ marginTop: '0.5rem' }}>
              <p style={{
                fontSize: 'clamp(0.55rem, 1.4vw, 0.85rem)',
                letterSpacing: '0.75em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                fontWeight: '400',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                margin: 0,
              }}>
                Jakarta Rock Collective
              </p>
            </div>
          </>
        )}
      </div>

      {/* Scroll indicator */}
      <div
        className="scroll-indicator"
        style={{
          position: 'absolute',
          bottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))',
        }} />
        <div style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.5)',
        }} />
      </div>
    </section>
  )
}