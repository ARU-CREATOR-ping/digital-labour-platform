import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { emoji: '🤖', title: 'AI Match Score', desc: 'Smart matching between workers and jobs' },
  { emoji: '📡', title: 'Hyperlocal Radar', desc: 'Find jobs near you in real-time' },
  { emoji: '📸', title: 'Photo Attendance', desc: 'Mark attendance with selfie verification' },
  { emoji: '💳', title: 'Instant Payments', desc: 'UPI, cash, or bank transfer' },
  { emoji: '⭐', title: 'Trust Ratings', desc: 'Two-way ratings build trust' },
  { emoji: '🌐', title: 'Hindi Support', desc: 'Full vernacular accessibility' },
];

const STATS = [
  { num: '50,000+', label: 'Skilled Workers' },
  { num: '12,000+', label: 'Active Clients' },
  { num: '95%', label: 'Success Rate' },
  { num: '₹2Cr+', label: 'Payments Processed' },
];

const HOW_IT_WORKS = [
  { step: '01', emoji: '📝', title: 'Post or Find Jobs', desc: 'Clients post jobs, workers browse & apply' },
  { step: '02', emoji: '🤖', title: 'AI Matches', desc: 'Our AI scores & ranks the best fits' },
  { step: '03', emoji: '🤝', title: 'Hire & Pay', desc: 'Hire workers, track attendance, pay instantly' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', overflow: 'hidden' }}>

      {/* ===== HERO SECTION ===== */}
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        overflow: 'hidden',
      }}>
        {/* Background Video */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
        }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setImgLoaded(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 1.5s ease',
              filter: 'brightness(0.6) saturate(1.3)',
            }}
          >
            <source src="/hero-video-hd.mp4" type="video/mp4" />
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Fallback static image if video doesn't load */}
          <img
            src="/hero-bg.png"
            alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.6) saturate(1.3)',
              zIndex: -1,
            }}
          />
        </div>

        {/* Light gradient overlay — lets video show through clearly */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.25) 70%, rgba(10,10,26,0.9) 100%)',
        }} />

        {/* Floating particles effect */}
        <style>{`
          @keyframes float-up {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-10vh) scale(1); opacity: 0; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(234,88,12,0.3); }
            50% { box-shadow: 0 0 40px rgba(234,88,12,0.6); }
          }
          @keyframes slide-up {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes count-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .hero-particle {
            position: absolute;
            width: 4px; height: 4px;
            background: var(--primary);
            border-radius: 50%;
            opacity: 0;
          }
          .hero-stat:hover {
            transform: translateY(-4px) !important;
            background: rgba(255,255,255,0.12) !important;
          }
          .feature-card:hover {
            transform: translateY(-6px) !important;
            border-color: var(--primary) !important;
            background: rgba(234,88,12,0.08) !important;
          }
          .how-step:hover .step-num {
            background: var(--primary) !important;
            color: #fff !important;
          }
        `}</style>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="hero-particle" style={{
            left: `${8 + Math.random() * 84}%`,
            animation: `float-up ${6 + Math.random() * 8}s linear ${Math.random() * 5}s infinite`,
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            background: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? '#60a5fa' : '#fbbf24',
          }} />
        ))}

        {/* Hero Content */}
        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', maxWidth: 640,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Logo */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 99, padding: '8px 20px 8px 14px',
            marginBottom: 28,
          }}>
            <span style={{ fontSize: 28 }}>⚒️</span>
            <span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>
              Digital Labour Platform
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 7vw, 56px)',
            fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            Building India's Future,{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              One Worker at a Time
            </span>
          </h1>

          <p style={{
            color: '#94a3b8', fontSize: 'clamp(15px, 2.5vw, 18px)',
            lineHeight: 1.7, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px',
          }}>
            AI-powered platform connecting <strong style={{ color: '#e2e8f0' }}>skilled construction workers</strong> with clients.
            Find work or hire instantly with smart matching, verified profiles, and secure payments.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/login')}
              style={{
                fontSize: 17, padding: '16px 48px', borderRadius: 14,
                animation: 'pulse-glow 2.5s ease infinite',
                fontWeight: 800, letterSpacing: '0.02em',
              }}
            >
              🚀 Get Started — It's Free
            </button>

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button
                onClick={() => navigate('/login?role=worker')}
                style={{
                  background: 'rgba(255,255,255,0.08)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12, padding: '12px 24px',
                  cursor: 'pointer', fontWeight: 700, fontSize: 14,
                  backdropFilter: 'blur(8px)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                👷 I'm a Worker
              </button>
              <button
                onClick={() => navigate('/login?role=client')}
                style={{
                  background: 'rgba(255,255,255,0.08)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12, padding: '12px 24px',
                  cursor: 'pointer', fontWeight: 700, fontSize: 14,
                  backdropFilter: 'blur(8px)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                🏢 I'm a Client
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', gap: 'clamp(16px, 4vw, 40px)', marginTop: 56,
          flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.2s ease 0.5s',
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} className="hero-stat" style={{
              textAlign: 'center', padding: '16px 20px', borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              animation: `slide-up 0.6s ease ${0.6 + i * 0.15}s both`,
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 30px)',
                fontWeight: 900, color: 'var(--primary)',
              }}>{s.num}</div>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, textAlign: 'center',
          animation: 'count-pulse 2s ease infinite',
        }}>
          <div style={{ color: '#475569', fontSize: 12, marginBottom: 6 }}>Scroll to explore</div>
          <div style={{ color: '#475569', fontSize: 20 }}>↓</div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #111827 100%)',
        padding: 'clamp(40px, 8vw, 80px) 20px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.25)',
            borderRadius: 99, padding: '6px 16px', fontSize: 13, color: 'var(--primary)', fontWeight: 700,
            marginBottom: 16,
          }}>How It Works</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 36px)',
            color: '#fff', marginBottom: 48, fontWeight: 800,
          }}>
            Three Simple Steps to <span style={{ color: 'var(--primary)' }}>Get Started</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="how-step" style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '32px 20px', textAlign: 'center',
                transition: 'all 0.3s ease', cursor: 'default',
              }}>
                <div className="step-num" style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(234,88,12,0.15)', color: 'var(--primary)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, marginBottom: 16, transition: 'all 0.3s',
                }}>{item.step}</div>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.emoji}</div>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FEATURES GRID ===== */}
      <div style={{
        background: '#111827',
        padding: 'clamp(40px, 8vw, 80px) 20px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)',
            borderRadius: 99, padding: '6px 16px', fontSize: 13, color: '#60a5fa', fontWeight: 700,
            marginBottom: 16,
          }}>Platform Features</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 36px)',
            color: '#fff', marginBottom: 48, fontWeight: 800,
          }}>
            Everything You Need, <span style={{ color: '#60a5fa' }}>Built In</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '24px 20px',
                textAlign: 'left', transition: 'all 0.3s ease', cursor: 'default',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.emoji}</div>
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECOND HERO / CTA ===== */}
      <div style={{
        position: 'relative', padding: 'clamp(60px, 10vw, 100px) 20px',
        overflow: 'hidden',
      }}>
        <img
          src="/hero-bg2.png" alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.25) saturate(1.3)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #111827 0%, transparent 30%, transparent 70%, #0a0a1a 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', maxWidth: 560, margin: '0 auto',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 40px)',
            color: '#fff', marginBottom: 16, fontWeight: 800,
          }}>
            Ready to Transform How India Works?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of workers and clients already using AI-powered matching to build better outcomes.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/login')}
            style={{ fontSize: 17, padding: '16px 48px', borderRadius: 14, fontWeight: 800 }}
          >
            🚀 Start Now — Free Forever
          </button>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{
        background: '#0a0a1a', borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 20px', textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>⚒️</span>
          <span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>
            Digital Labour Platform
          </span>
        </div>
        <p style={{ color: '#475569', fontSize: 13, marginBottom: 8 }}>
          Empowering India's workforce with technology
        </p>
        <p style={{ color: '#334155', fontSize: 12 }}>
          © 2024 Digital Labour Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
