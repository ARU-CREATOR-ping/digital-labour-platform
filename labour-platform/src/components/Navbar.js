import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../services/translations';

export default function Navbar() {
  const { user, role, setUser, setRole, workerProfile, hindiMode, setHindiMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessMode, setAccessMode] = useState(false);
  const [showAccessPanel, setShowAccessPanel] = useState(false);

  useEffect(() => {
    if (accessMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [accessMode]);

  function handleLogout() {
    setUser(null);
    setRole(null);
    navigate('/');
    setMenuOpen(false);
  }

  const workerLinks = [
    { to: '/worker/dashboard', label: '🏠 Home' },
    { to: '/worker/jobs', label: '🔍 Find Jobs' },
    { to: '/worker/applications', label: '📋 My Applications' },
    { to: '/worker/attendance', label: '📸 Attendance' },
    { to: '/worker/analytics', label: '📊 Analytics' },
  ];
  const clientLinks = [
    { to: '/client/dashboard', label: '🏠 Home' },
    { to: '/client/post-job', label: '➕ Post Job' },
    { to: '/client/applicants', label: '👥 Applicants' },
    { to: '/client/payment', label: '💳 Payment' },
    { to: '/client/analytics', label: '📊 Analytics' },
  ];

  const links = role === 'worker' ? workerLinks : role === 'client' ? clientLinks : [];

  function getLabel(label) {
    return t(label, hindiMode);
  }

  if (!user) return null;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'var(--card)', borderBottom: '1px solid var(--border)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      transition: 'background 0.3s, color 0.3s',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to={role === 'worker' ? '/worker/dashboard' : '/client/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>⚒️</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: 'var(--primary)' }}>
            Digital Labour
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} className="desktop-nav">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: location.pathname === link.to ? 'var(--primary)' : 'var(--text-muted)',
                background: location.pathname === link.to ? '#fff0e8' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {getLabel(link.label)}
            </Link>
          ))}
        </div>

        {/* Right: accessibility + user info + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Accessibility Toggle */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccessPanel(p => !p)}
              title="Accessibility & Language"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                border: accessMode || hindiMode ? '2px solid var(--primary)' : '2px solid var(--border)',
                background: accessMode || hindiMode ? 'var(--primary)' : 'var(--bg)',
                color: accessMode || hindiMode ? '#fff' : 'var(--text)',
                cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s ease',
                boxShadow: showAccessPanel ? '0 0 0 3px rgba(232,93,4,0.25)' : 'none',
              }}
            >
              ♿
            </button>

            {/* Accessibility Panel Dropdown */}
            {showAccessPanel && (
              <div style={{
                position: 'absolute', top: 44, right: 0,
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: 18, width: 260,
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                animation: 'fadeIn 0.2s ease', zIndex: 300,
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ♿ Accessibility Assist
                </div>

                {/* High Contrast Toggle */}
                <button
                  onClick={() => setAccessMode(m => !m)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
                    background: accessMode ? '#1a1a2e' : 'var(--bg)', cursor: 'pointer',
                    marginBottom: 10, transition: 'all 0.2s',
                    color: accessMode ? '#fff' : 'var(--text)',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    🌗 High Contrast Mode
                  </span>
                  <span style={{
                    width: 40, height: 22, borderRadius: 99, position: 'relative',
                    background: accessMode ? 'var(--success)' : '#d1d5db',
                    display: 'inline-block', transition: 'background 0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, left: accessMode ? 20 : 2,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </span>
                </button>

                {/* Hindi Toggle */}
                <button
                  onClick={() => setHindiMode(m => !m)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
                    background: hindiMode ? '#fff7ed' : 'var(--bg)', cursor: 'pointer',
                    marginBottom: 10, transition: 'all 0.2s',
                    color: 'var(--text)',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    🌐 हिंदी / Hindi Labels
                  </span>
                  <span style={{
                    width: 40, height: 22, borderRadius: 99, position: 'relative',
                    background: hindiMode ? 'var(--primary)' : '#d1d5db',
                    display: 'inline-block', transition: 'background 0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, left: hindiMode ? 20 : 2,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </span>
                </button>

                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                  💡 Designed for construction workers who prefer larger text, high contrast, and vernacular navigation.
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 15 }}>
              {(workerProfile?.name || user?.name || 'U')[0]}
            </div>
            <div style={{ display: 'none' }} className="user-name-desktop">
              <div style={{ fontSize: 13, fontWeight: 600 }}>{role === 'worker' ? workerProfile?.name : user?.name || 'Client'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{role}</div>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: 'var(--secondary)' }}
            className="hamburger"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ display: 'none' }} id="logout-desktop">
            {hindiMode ? 'लॉगआउट' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: 'var(--card)', borderTop: '1px solid var(--border)',
          padding: '12px 20px 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        }}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                fontWeight: 600, fontSize: 16,
                color: location.pathname === link.to ? 'var(--primary)' : 'var(--text)',
              }}
            >
              {getLabel(link.label)}
            </Link>
          ))}
          <button onClick={handleLogout} className="btn btn-outline btn-full" style={{ marginTop: 16 }}>
            🚪 {hindiMode ? 'लॉगआउट' : 'Logout'}
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hamburger { display: none !important; }
          #logout-desktop { display: inline-flex !important; }
          .user-name-desktop { display: block !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
