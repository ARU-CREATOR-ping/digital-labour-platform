import React from 'react';
import { scoreColor } from '../services/api';

export default function MatchInsightsModal({ isOpen, onClose, job, worker, score }) {
  if (!isOpen || !job || !worker) return null;

  // Calculate detailed breakdowns safely
  const skillOverlap = job.skills.filter(s =>
    worker.skills.some(ws => ws.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ws.toLowerCase()))
  );
  const missingSkills = job.skills.filter(s =>
    !worker.skills.some(ws => ws.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ws.toLowerCase()))
  );

  const skillMatch = Math.min(skillOverlap.length / Math.max(job.skills.length, 1), 1);
  
  let expVal = 0;
  if (typeof worker.experience === 'number') {
    expVal = worker.experience;
  } else if (typeof worker.experience === 'string') {
    if (worker.experience.includes('< 1')) expVal = 0.5;
    else if (worker.experience.includes('1-2')) expVal = 1.5;
    else if (worker.experience.includes('3-5')) expVal = 4;
    else if (worker.experience.includes('5-10')) expVal = 7.5;
    else if (worker.experience.includes('10+')) expVal = 11;
    else {
      const match = worker.experience.match(/\d+/);
      if (match) expVal = parseInt(match[0]);
    }
  }
  
  const experienceScore = Math.min(expVal / 10, 1);
  const ratingScore = (worker.rating || 5.0) / 5;
  const distanceScore = Math.max(0, 1 - (job.distance || 5) / 20);
  const availabilityScore = worker.availability ? 1 : 0;

  const breakdowns = [
    { label: '🛠 Skill Match (35%)', val: Math.round(skillMatch * 35), max: 35, desc: `${skillOverlap.length} of ${job.skills.length} skills matched` },
    { label: '💼 Experience (25%)', val: Math.round(experienceScore * 25), max: 25, desc: `${expVal} yrs vs job requirements` },
    { label: '⭐ Rating (20%)', val: Math.round(ratingScore * 20), max: 20, desc: `${worker.rating || 5.0}/5 stars feedback` },
    { label: '📍 Hyperlocal Proximity (10%)', val: Math.round(distanceScore * 10), max: 10, desc: `${job.distance || 2.4} km away` },
    { label: '🟢 Real-time Availability (10%)', val: Math.round(availabilityScore * 10), max: 10, desc: worker.availability ? 'Available for work' : 'Busy right now' }
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1001, padding: 16, backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.25s ease'
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: 28,
        maxWidth: 480, width: '100%', boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
        position: 'relative', overflow: 'hidden', animation: 'fadeIn 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', right: 20, top: 20, border: 'none', background: '#f3f4f6',
          width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', transition: 'all 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'} onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}>✕</button>

        {/* Heading */}
        <h2 style={{ fontSize: 22, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--secondary)' }}>
          🤖 AI Matching Insights
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
          Algorithmic breakdown for <strong>{job.title}</strong>
        </p>

        {/* Score Display Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg)', borderRadius: 16, padding: 18, marginBottom: 24 }}>
          <div style={{
            background: scoreColor(score), width: 68, height: 68, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {score}%
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--secondary)' }}>Match Compatibility</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {score >= 75 ? '🔥 High recommendation!' : score >= 50 ? '👍 Suitable fit for this job.' : '⚠️ Matches fewer parameters.'}
            </div>
          </div>
        </div>

        {/* Breakdown Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {breakdowns.map((b, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>
                <span>{b.label}</span>
                <span style={{ color: scoreColor(score) }}>{b.val} / {b.max} pts</span>
              </div>
              <div style={{ background: '#f3f4f6', height: 8, borderRadius: 99, overflow: 'hidden', marginBottom: 2 }}>
                <div style={{ background: scoreColor(score), width: `${(b.val / b.max) * 100}%`, height: '100%', borderRadius: 99, transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{b.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Recommendations */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: 16, fontSize: 13 }}>
          <div style={{ fontWeight: 700, color: '#854d0e', marginBottom: 6 }}>💡 Recommended Adjustments</div>
          <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6, color: '#713f12' }}>
            {missingSkills.length > 0 ? (
              <li>Add <strong>{missingSkills.slice(0, 2).join(', ')}</strong> to skills list to add up to <strong>+{(Math.min(missingSkills.length / job.skills.length, 1) * 35).toFixed(0)} points</strong>.</li>
            ) : (
              <li>Worker already possesses 100% of skills needed for this job!</li>
            )}
            {job.distance > 5 && (
              <li>Proximity is {job.distance} km away. Priority is given to workers within 5 km.</li>
            )}
            {worker.experience < 3 && (
              <li>Years of experience can be enhanced with certification to boost score.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
