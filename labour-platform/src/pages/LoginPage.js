import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sendOTP, verifyOTP } from '../services/api';
import NavigatorHelper from '../components/NavigatorHelper';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const { setUser, setRole, workerProfile } = useApp();
  const navigate = useNavigate();
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const preRole = searchParams.get('role');
    if (preRole) setRole(preRole);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(t => t - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  async function handleSendOTP(e) {
    e.preventDefault();
    if (phone.length !== 10) { setError('Enter valid 10-digit mobile number'); return; }
    setLoading(true); setError('');
    try {
      await sendOTP(phone);
      setStep('otp');
      setTimer(30);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch { setError('Failed to send OTP. Try again.'); }
    finally { setLoading(false); }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 4) { setError('Enter complete 4-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      const res = await verifyOTP(phone, otpStr);
      const userName = (workerProfile && workerProfile.phone === phone) ? workerProfile.name : 'User';
      setUser({ id: res.userId, phone, token: res.token, name: userName });
      if (isNewUser) {
        // New user → go to role select which routes to profile setup
        setRole('worker');
        navigate('/worker/profile-setup');
      } else {
        navigate('/role-select');
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  function handleOtpChange(val, i) {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 3) otpRefs[i + 1].current?.focus();
  }

  function handleOtpKeyDown(e, i) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setImgLoaded(true)}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 1.5s ease',
          filter: 'brightness(0.55) saturate(1.3)',
        }}
      >
        <source src="/hero-video-hd.mp4" type="video/mp4" />
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      {/* Fallback static image */}
      <img
        src="/hero-bg.png"
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.55) saturate(1.3)',
          zIndex: -1,
        }}
      />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 100%)',
      }} />

      {/* Subtle animated particles */}
      <style>{`
        @keyframes login-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${10 + Math.random() * 80}%`,
          bottom: '-20px',
          width: 3 + Math.random() * 4,
          height: 3 + Math.random() * 4,
          background: i % 2 === 0 ? 'var(--primary)' : '#fbbf24',
          borderRadius: '50%',
          animation: `login-float ${8 + Math.random() * 10}s linear ${Math.random() * 6}s infinite`,
          opacity: 0,
        }} />
      ))}

      {/* Login Card — Glassmorphism */}
      <div className="glass-login" style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 420,
        background: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 24,
        padding: 'clamp(24px, 5vw, 36px)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.15)',
        animation: 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        color: '#fff',
      }}>
        <style>{`
          @keyframes slide-up {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .glass-login .form-input,
          .glass-login .form-select,
          .glass-login .form-textarea {
            background: rgba(255,255,255,0.1) !important;
            border: 2px solid rgba(255,255,255,0.2) !important;
            color: #fff !important;
          }
          .glass-login .form-input::placeholder,
          .glass-login .form-textarea::placeholder {
            color: rgba(255,255,255,0.4) !important;
          }
          .glass-login .form-input:focus,
          .glass-login .form-select:focus,
          .glass-login .form-textarea:focus {
            border-color: var(--primary) !important;
            background: rgba(255,255,255,0.15) !important;
          }
          .glass-login .otp-input {
            background: rgba(255,255,255,0.1) !important;
            border: 2px solid rgba(255,255,255,0.25) !important;
            color: #fff !important;
          }
          .glass-login .otp-input:focus {
            border-color: var(--primary) !important;
            background: rgba(255,255,255,0.18) !important;
          }
          .glass-login .form-label {
            color: rgba(255,255,255,0.8) !important;
          }
        `}</style>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--primary), #f59e0b)',
            marginBottom: 12,
            boxShadow: '0 8px 24px rgba(234,88,12,0.3)',
          }}>
            <span style={{ fontSize: 32 }}>⚒️</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', marginBottom: 2 }}>
            Digital Labour Platform
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Login to your account</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            {/* Login / Register Toggle */}
            <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', marginBottom: 24 }}>
              <button type="button" onClick={() => setIsNewUser(false)} style={{
                flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                background: !isNewUser ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: !isNewUser ? '#fff' : 'rgba(255,255,255,0.5)',
                fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
              }}>🔑 Login</button>
              <button type="button" onClick={() => setIsNewUser(true)} style={{
                flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                background: isNewUser ? '#22c55e' : 'rgba(255,255,255,0.05)',
                color: isNewUser ? '#fff' : 'rgba(255,255,255,0.5)',
                fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
              }}>📝 Register</button>
            </div>

            <h2 style={{ fontSize: 18, marginBottom: 4, color: '#fff' }}>
              {isNewUser ? 'Create New Account' : 'Enter Your Mobile Number'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 20 }}>
              {isNewUser ? 'Register with your mobile number to get started' : "We'll send an OTP to verify your number"}
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.8)' }}>📱 Mobile Number</label>
              <NavigatorHelper tip="Enter your 10-digit mobile number without +91. E.g. 9876543210" step={1}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: 'var(--radius-sm)', padding: '13px 12px',
                    fontWeight: 600, fontSize: 15, color: '#fff', flexShrink: 0,
                  }}>
                    🇮🇳 +91
                  </div>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    required
                    autoFocus
                  />
                </div>
              </NavigatorHelper>
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading || phone.length !== 10}
              style={{ borderRadius: 14, fontSize: 16, fontWeight: 700 }}>
              {loading ? '⏳ Sending OTP...' : isNewUser ? 'Register & Send OTP →' : 'Send OTP →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Demo OTP: <strong style={{ color: 'var(--primary)' }}>1234</strong>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <h2 style={{ fontSize: 18, marginBottom: 4, color: '#fff' }}>Verify OTP</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 4 }}>
              OTP sent to +91 {phone}
            </p>
            <button type="button" onClick={() => setStep('phone')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              ✏️ Change number
            </button>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Enter 4-digit OTP</label>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    className="otp-input"
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                  />
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}
              style={{ borderRadius: 14, fontSize: 16, fontWeight: 700 }}>
              {loading ? '⏳ Verifying...' : 'Verify & Login ✓'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 14 }}>
              {timer > 0
                ? <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Resend OTP in {timer}s</span>
                : <button type="button" onClick={handleSendOTP} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                    Resend OTP
                  </button>
              }
            </div>
          </form>
        )}

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
