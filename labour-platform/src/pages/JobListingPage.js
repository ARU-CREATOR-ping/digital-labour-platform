import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../services/translations';
import { calculateMatchScore, scoreColor } from '../services/api';
import JobCard from '../components/JobCard';
import NavigatorHelper from '../components/NavigatorHelper';
import VoiceAssistant from '../components/VoiceAssistant';
import MatchInsightsModal from '../components/MatchInsightsModal';

const CATEGORIES = ['All', 'Painting', 'Electrician', 'Plumbing', 'Carpentry', 'AC Technician', 'Masonry'];

export default function JobListingPage() {
  const { jobs, applications, applyToJob, workerProfile, hindiMode } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [applying, setApplying] = useState(null);
  const [toast, setToast] = useState('');
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [radarView, setRadarView] = useState(false);

  const appliedJobIds = applications.map(a => a.jobId);

  const scored = jobs.map(j => ({
    ...j,
    matchScore: calculateMatchScore({ job: j, worker: workerProfile }),
  }));

  const filtered = scored.filter(j => {
    const matchSearch = search === '' ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'All' || j.category === category;
    return matchSearch && matchCat;
  }).sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'pay') return b.pay - a.pay;
    if (sortBy === 'distance') return a.distance - b.distance;
    return 0;
  });

  async function handleApply(job) {
    setApplying(job.id);
    await new Promise(r => setTimeout(r, 800));
    applyToJob(job.id, workerProfile);
    setApplying(null);
    setToast(`✅ Applied to "${job.title}" successfully!`);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 24 }}>

        {/* Header */}
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>{t('🔍 Find Jobs', hindiMode)}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{filtered.length} {t('jobs available near you', hindiMode)}</p>
          </div>
          <button 
            onClick={() => setRadarView(!radarView)}
            className="btn btn-sm btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, borderRadius: 12 }}
          >
            {radarView ? t('📋 View List Mode', hindiMode) : t('📡 Toggle Radar Map', hindiMode)}
          </button>
        </div>

        {/* Toast */}
        {toast && <div className="alert alert-success">{toast}</div>}

        {/* Search */}
        <div className="form-group">
          <NavigatorHelper tip="Search by job title, skill, or location name" step={1}>
            <input
              className="form-input"
              placeholder={t('🔍 Search jobs, skills, location...', hindiMode)}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </NavigatorHelper>
        </div>

        {/* Radar View Panel */}
        {radarView && (
          <div className="card fade-in" style={{
            background: 'linear-gradient(135deg, #0b0f19 0%, #1e293b 100%)',
            border: '2px solid var(--primary)', borderRadius: 20, padding: 24, textAlign: 'center', color: '#fff',
            marginBottom: 24, minHeight: 340, position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 4 }}>{t('📡 Hyperlocal Job Radar', hindiMode)}</h3>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>Interactive map of active openings around {workerProfile.location}</p>
            
            {/* Radar Sweep Container */}
            <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto', border: '2px solid rgba(232,93,4,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Radar Rings */}
              <div style={{ position: 'absolute', width: 160, height: 160, border: '1px solid rgba(232,93,4,0.12)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', width: 90, height: 90, border: '1px solid rgba(232,93,4,0.08)', borderRadius: '50%' }} />
              
              {/* Sweep Line */}
              <div style={{
                position: 'absolute', width: '50%', height: '50%', left: '50%', top: '50%',
                background: 'linear-gradient(45deg, rgba(232,93,4,0.18) 0%, transparent 100%)',
                transformOrigin: '0% 0%',
                animation: 'pulse 3.5s linear infinite',
                borderLeft: '1px dashed rgba(232,93,4,0.4)',
                borderRadius: '0 0 100% 0',
                pointerEvents: 'none'
              }} />

              {/* Center Dot (You) */}
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', border: '3px solid var(--primary)', zIndex: 5, boxShadow: '0 0 12px var(--primary)' }} />
              <div style={{ position: 'absolute', fontSize: 10, fontWeight: 800, color: 'var(--primary)', marginTop: 32, letterSpacing: '1px' }}>YOU</div>

              {/* Gigs Pins */}
              {filtered.map((j, idx) => {
                const angles = [35, 120, 215, 305, 75, 170];
                const angle = angles[idx % angles.length] * (Math.PI / 180);
                const distanceRatio = Math.min((j.distance || 5) / 15, 0.85);
                const radiusVal = 100 * distanceRatio;
                const x = Math.cos(angle) * radiusVal;
                const y = Math.sin(angle) * radiusVal;
                
                return (
                  <div 
                    key={j.id}
                    onClick={() => setSelectedInsight({ job: j, score: j.matchScore })}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${x}px - 8px)`,
                      top: `calc(50% + ${y}px - 8px)`,
                      width: 18, height: 18, borderRadius: '50%',
                      background: scoreColor(j.matchScore),
                      cursor: 'pointer', zIndex: 10,
                      boxShadow: `0 0 12px ${scoreColor(j.matchScore)}`,
                      border: '2px solid #fff',
                      animation: 'pulse 1.8s infinite',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title={`Click to inspect ${j.title} (${j.matchScore}%)`}
                  >
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#fff' }}>⚙️</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 24, fontSize: 12, color: '#94a3b8' }}>
              💡 Tap any pulsing gig dot <span style={{ color: 'var(--primary)', fontWeight: 800 }}>⚙️</span> to open instant AI compatibility diagnostics.
            </div>
          </div>
        )}

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '8px 16px',
                borderRadius: 99,
                border: category === c ? '2px solid var(--primary)' : '2px solid var(--border)',
                background: category === c ? 'var(--primary)' : '#fff',
                color: category === c ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{t('Sort by:', hindiMode)}</span>
          {[['match', t('🤖 Best Match', hindiMode)], ['pay', t('💰 Highest Pay', hindiMode)], ['distance', t('📍 Nearest', hindiMode)]].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setSortBy(v)}
              className={`btn btn-sm ${sortBy === v ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: 12 }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* AI match explanation */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13 }}>
          🤖 <strong>AI Match Score</strong> = Skills (35%) + Experience (25%) + Rating (20%) + Distance (10%) + Availability (10%)
        </div>

        {/* Job list */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">😔</div>
            <h3>{t('No jobs found', hindiMode)}</h3>
            <p>{t('Try changing your search or category filter', hindiMode)}</p>
          </div>
        ) : (
          filtered.map(job => (
            <div key={job.id} style={{ position: 'relative' }}>
              {applying === job.id && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
                  borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10, fontSize: 18, fontWeight: 700, color: 'var(--primary)',
                }}>
                  ⏳ Applying...
                </div>
              )}
              <JobCard
                job={job}
                matchScore={job.matchScore}
                showApply={true}
                applied={appliedJobIds.includes(job.id)}
                onApply={handleApply}
                onScoreClick={() => setSelectedInsight({ job: job, score: job.matchScore })}
              />
            </div>
          ))
        )}
      </div>
      <VoiceAssistant />
      
      {/* AI Insights Modal */}
      <MatchInsightsModal 
        isOpen={!!selectedInsight}
        onClose={() => setSelectedInsight(null)}
        job={selectedInsight?.job}
        worker={workerProfile}
        score={selectedInsight?.score}
      />
    </div>
  );
}
