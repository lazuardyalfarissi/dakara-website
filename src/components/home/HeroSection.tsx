'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HeroSection() {
  const [slides, setSlides] = useState<any[]>([])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchHeroData() {
      const { data: bannerData } = await supabase
        .from('hero_settings')
        .select('*')
        .order('order_index', { ascending: true })

      if (bannerData && bannerData.length > 0) {
        setSlides(bannerData)
      } else {
        setSlides([{ background_url: '/images/hero-bg.jpg' }])
      }

      const { data: logoData } = await supabase
        .from('logo_settings')
        .select('logo_url')
        .eq('id', 1)
        .maybeSingle()

      if (logoData?.logo_url) {
        setLogoUrl(logoData.logo_url)
      }
    }
    fetchHeroData()
  }, [supabase])

  return (
    <section
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* =============================================
           LOGO ANIMATION
        ============================================= */
        @keyframes logo-sway-spin {
          0%   { transform: translateY(0px)   rotate(0deg)   scale(1);    }
          5%   { transform: translateY(-5px)  rotate(-12deg) scale(1.02); }
          10%  { transform: translateY(-5px)  rotate(12deg)  scale(1.02); }
          15%  { transform: translateY(-5px)  rotate(-12deg) scale(1.02); }
          20%  { transform: translateY(-5px)  rotate(12deg)  scale(1.02); }
          25%  { transform: translateY(0px)   rotate(0deg)   scale(1);    }
          30%  { transform: translateY(-10px) rotate(-20deg) scale(1.05); }
          55%  { transform: translateY(-20px) rotate(360deg) scale(1.1);  }
          65%  { transform: translateY(5px)   rotate(360deg) scale(0.97); }
          70%  { transform: translateY(-3px)  rotate(360deg) scale(1.02); }
          75%  { transform: translateY(0px)   rotate(360deg) scale(1);    }
          100% { transform: translateY(0px)   rotate(360deg) scale(1);    }
        }

        .hero-logo {
          animation: logo-sway-spin 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          width: clamp(200px, 55vw, 700px);
          filter:
            drop-shadow(0 0 40px rgba(255, 60, 0, 0.35))
            drop-shadow(0 0 80px rgba(255, 30, 0, 0.15))
            drop-shadow(0 4px 20px rgba(0, 0, 0, 0.7));
          pointer-events: none;
          will-change: transform;
          transform-origin: center center;
        }

        
        /* =============================================
           SUBTITLE ENTRANCE
        ============================================= */
        @keyframes subtitle-entrance {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0px);  }
        }

        .hero-subtitle {
          animation: subtitle-entrance 1.5s ease-out 0.5s both;
        }

        /* =============================================
           SCAN LINE
        ============================================= */
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        .hero-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 80, 0, 0.15) 30%,
            rgba(255, 80, 0, 0.3) 50%,
            rgba(255, 80, 0, 0.15) 70%,
            transparent 100%
          );
          animation: scanline 6s linear infinite;
          pointer-events: none;
          z-index: 5;
        }

        /* =============================================
           INSTAGRAM-STYLE PROGRESS BAR
        ============================================= */
        .swiper-pagination-custom {
          position: absolute;
          top: 20px;
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
          transition: background 0.2s;
        }

        .swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.4) !important;
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

        /* =============================================
           SWIPER CLEANUP
        ============================================= */
        .swiper-button-next,
        .swiper-button-prev { display: none !important; }

        .mySwiper {
          width: 100%;
          height: 100%;
          cursor: grab;
        }
        .mySwiper:active {
          cursor: grabbing;
        }

        /* =============================================
           VIGNETTE
        ============================================= */
        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 3;
          pointer-events: none;
        }

        /* =============================================
           NOISE TEXTURE
        ============================================= */
        .hero-noise {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          z-index: 4;
          pointer-events: none;
        }

        /* =============================================
           TAGLINE
        ============================================= */
        @keyframes tagline-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .hero-tagline {
          animation: tagline-fade 2s ease-out 1s both;
        }

        /* =============================================
           SCROLL INDICATOR
        ============================================= */
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0);   opacity: 0.5; }
          50%       { transform: translateY(8px); opacity: 1;   }
        }
        .scroll-indicator {
          animation: scroll-bounce 2s ease-in-out infinite;
        }

        /* =============================================
           MOBILE RESPONSIVE
        ============================================= */
        @media (max-width: 768px) {
          .hero-logo {
            width: clamp(180px, 78vw, 380px) !important;
          }
          .swiper-pagination-custom {
            top: 12px !important;
            padding: 0 14px !important;
            gap: 4px !important;
          }
          .swiper-pagination-bullet {
            height: 2px !important;
          }
          .hero-slide-bg {
            background-position: center top !important;
          }
        }
      `}} />

      {/* SCANLINE */}
      <div className="hero-scanline" />

      {/* BACKGROUND SLIDER */}
      <Swiper
        key={slides.length}
        modules={[Autoplay, Navigation, Pagination]}
        className="mySwiper"
        spaceBetween={0}
        slidesPerView={1}
        grabCursor={true}
        allowTouchMove={true}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={slides.length > 1}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <div
              className="hero-slide-bg"
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url("${slide.background_url}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}
            >
              {/* Cinematic gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                  linear-gradient(
                    to bottom,
                    rgba(0,0,0,0.35) 0%,
                    rgba(0,0,0,0.0)  30%,
                    rgba(0,0,0,0.0)  60%,
                    rgba(0,0,0,0.85) 100%
                  )
                `,
              }} />
            </div>
          </SwiperSlide>
        ))}

        {/* Progress bar */}
        <div className="swiper-pagination-custom" />
      </Swiper>

      {/* VIGNETTE */}
      <div className="hero-vignette" />

      {/* NOISE */}
      <div className="hero-noise" />

      {/* CENTER CONTENT */}
      <div style={{
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
      }}>

        {/* LOGO */}
        {logoUrl ? (
          <img src={logoUrl} alt="DAKARA Logo" className="hero-logo" />
        ) : (
          <h1
            className="hero-logo"
            style={{
              fontSize: 'clamp(3rem, 10vw, 5rem)',
              fontWeight: '900',
              color: '#fff',
              letterSpacing: '0.2em',
              textShadow: '0 0 30px rgba(255,60,0,0.4), 0 0 60px rgba(255,60,0,0.2)',
              fontFamily: 'Impact, "Arial Black", sans-serif',
            }}
          >
            DAKARA
          </h1>
        )}

        {/* TAGLINE */}
        <div className="hero-tagline" style={{ marginTop: '0.5rem' }}>
          <p style={{
            fontSize: 'clamp(0.55rem, 1.4vw, 0.85rem)',
            letterSpacing: '0.75em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            fontWeight: '400',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            margin: 0,
          }}>
            Jakarta Rock Collective
          </p>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        className="scroll-indicator"
        style={{
          position: 'absolute',
          bottom: '32px',
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