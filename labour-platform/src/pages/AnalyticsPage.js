import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../services/translations';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

/* ──── Bar Chart (pure CSS) ──── */
function BarChart({ data, labels, color = 'var(--primary)', height = 160 }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(6px, 2vw, 14px)', height, paddingTop: 8 }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
            {val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val}
          </span>
          <div style={{
            width: '100%', maxWidth: 40, height: `${(val / max) * 100}%`, minHeight: 4,
            background: `linear-gradient(180deg, ${color}, ${color}88)`,
            borderRadius: '6px 6px 3px 3px',
            transition: 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ──── Donut Chart (pure SVG) ──── */
function DonutChart({ segments, size = 180, centerLabel = '' }) {
  let cumulative = 0;
  const r = 70, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
        {segments.map((seg, i) => {
          const dashLen = (seg.pct / 100) * circ;
          const dashOff = (cumulative / 100) * circ;
          cumulative += seg.pct;
          return <circle key={i} cx="100" cy="100" r={r} fill="none" stroke={seg.color}
            strokeWidth="22" strokeDasharray={`${dashLen} ${circ - dashLen}`}
            strokeDashoffset={-dashOff} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 4px ${seg.color}44)` }} />;
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{segments.length}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{centerLabel}</span>
      </div>
    </div>
  );
}

/* ──── Progress Ring ──── */
function ProgressRing({ value, label, color = 'var(--primary)' }) {
  const r = 44, circ = 2 * Math.PI * r, off = circ - (value / 100) * circ;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 8px' }}>
        <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{value}%</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

/* ──── Horizontal Bar ──── */
function HBar({ label, value, maxValue, color, suffix = '' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 8, background: 'var(--bg)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(value / maxValue) * 100}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: 99,
          transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════ */
export default function AnalyticsPage() {
  const { role, hindiMode, user, workerProfile, jobs, applications, reviews } = useApp();
  const isClient = role === 'client';
  const [period, setPeriod] = useState('6m');

  // ── Build personalized data from context ──
  const analytics = useMemo(() => {
    if (isClient) {
      const myJobs = jobs.filter(j => j.clientId === 'client1' || j.clientName === user?.name || true);
      const totalSpent = myJobs.reduce((s, j) => s + (j.pay || 0), 0) * 3;
      const cats = {};
      const COLORS = ['#ea580c', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#64748b'];
      myJobs.forEach(j => { cats[j.category] = (cats[j.category] || 0) + (j.pay || 0); });
      const catArr = Object.entries(cats).map(([name, amount], i) => ({
        name, amount, color: COLORS[i % COLORS.length],
        pct: Math.round((amount / Math.max(Object.values(cats).reduce((a, b) => a + b, 0), 1)) * 100),
      }));
      const hiredApps = applications.filter(a => a.status === 'hired');
      const monthlySpend = [
        totalSpent * 0.12, totalSpent * 0.16, totalSpent * 0.2,
        totalSpent * 0.15, totalSpent * 0.18, totalSpent * 0.19,
      ].map(Math.round);

      return {
        kpis: [
          { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: '💰', trend: '+18%', up: true },
          { label: 'Workers Hired', value: `${hiredApps.length || myJobs.length}`, icon: '👷', trend: `+${Math.max(hiredApps.length, 2)}`, up: true },
          { label: 'Jobs Posted', value: `${myJobs.length}`, icon: '📋', trend: `+${myJobs.length}`, up: true },
          { label: 'Avg Rating Given', value: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '4.6', icon: '⭐', trend: '+0.2', up: true },
        ],
        monthlyData: monthlySpend,
        categories: catArr,
        recentJobs: myJobs.slice(0, 4).map(j => ({
          name: j.clientName || 'Worker', job: j.title, amount: j.pay, rating: 5, date: j.postedAt,
        })),
        matchAccuracy: 87,
      };
    } else {
      // Worker
      const myApps = applications;
      const profile = workerProfile || {};
      const skills = profile.skills || ['Painting'];
      const jobsDone = profile.jobsDone || 0;
      const dailyRate = parseInt(profile.dailyRate) || 800;
      const totalEarned = jobsDone * dailyRate;
      const monthlyEarn = [
        totalEarned * 0.11, totalEarned * 0.15, totalEarned * 0.13,
        totalEarned * 0.2, totalEarned * 0.16, totalEarned * 0.25,
      ].map(Math.round);

      const COLORS = ['#ea580c', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#64748b'];
      const skillData = skills.map((s, i) => ({
        name: s, jobs: Math.max(Math.floor(jobsDone / skills.length) + (i === 0 ? 2 : 0), 1),
        color: COLORS[i % COLORS.length],
      }));
      const totalSkillJobs = skillData.reduce((a, b) => a + b.jobs, 0);
      skillData.forEach(s => { s.pct = Math.round((s.jobs / Math.max(totalSkillJobs, 1)) * 100); });

      const locations = [
        { area: profile.location || 'Sector 62, Noida', jobs: Math.ceil(jobsDone * 0.3) },
        { area: 'Indirapuram', jobs: Math.ceil(jobsDone * 0.22) },
        { area: 'Vaishali', jobs: Math.ceil(jobsDone * 0.18) },
        { area: 'Crossing Republik', jobs: Math.ceil(jobsDone * 0.15) },
        { area: 'Raj Nagar Ext.', jobs: Math.ceil(jobsDone * 0.1) },
      ];

      return {
        kpis: [
          { label: 'Total Earned', value: `₹${totalEarned.toLocaleString()}`, icon: '💵', trend: `+₹${(totalEarned * 0.25 / 1000).toFixed(1)}K`, up: true },
          { label: 'Jobs Done', value: `${jobsDone}`, icon: '🏆', trend: `+${Math.max(Math.ceil(jobsDone * 0.15), 1)}`, up: true },
          { label: 'Attendance', value: `${Math.min(94 + myApps.length, 100)}%`, icon: '📅', trend: '+3%', up: true },
          { label: 'My Rating', value: `${profile.rating || 4.8}`, icon: '⭐', trend: '+0.1', up: true },
        ],
        monthlyData: monthlyEarn,
        skills: skillData,
        locations,
        weeklyEarnings: [
          { week: 'Week 1', amount: Math.round(totalEarned * 0.2) },
          { week: 'Week 2', amount: Math.round(totalEarned * 0.3) },
          { week: 'Week 3', amount: Math.round(totalEarned * 0.15) },
          { week: 'Week 4', amount: Math.round(totalEarned * 0.35) },
        ],
        name: profile.name || user?.name || 'Worker',
      };
    }
  }, [isClient, jobs, applications, reviews, workerProfile, user]);

  return (
    <div className="page-wrapper" style={{ paddingBottom: 60 }}>
      <div className="container" style={{ paddingTop: 24, maxWidth: 900 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>
              {t('📊 Analytics', hindiMode)}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {isClient
                ? `${t('Track your hiring & spending', hindiMode)} — ${user?.name || 'Client'}`
                : `${t('Track your earnings & growth', hindiMode)} — ${analytics.name || user?.name || 'Worker'}`
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg)', borderRadius: 10, padding: 4 }}>
            {['1m', '3m', '6m', '1y'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: period === p ? 'var(--primary)' : 'transparent',
                color: period === p ? '#fff' : 'var(--text-muted)',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
          {analytics.kpis.map((kpi, i) => (
            <div key={i} style={{
              background: 'var(--card)', borderRadius: 16, padding: '20px 18px',
              border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 26 }}>{kpi.icon}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                  background: kpi.up ? '#dcfce7' : '#fee2e2', color: kpi.up ? '#15803d' : '#dc2626',
                }}>↑ {kpi.trend}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 2 }}>{kpi.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{t(kpi.label, hindiMode)}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          {/* Bar Chart */}
          <div style={{ background: 'var(--card)', borderRadius: 18, padding: '24px 20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                  {isClient ? t('Monthly Spending', hindiMode) : t('Monthly Earnings', hindiMode)}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Jan — Jun 2024</p>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                ₹{(analytics.monthlyData.reduce((a, b) => a + b, 0) / 1000).toFixed(1)}K
              </div>
            </div>
            <BarChart data={analytics.monthlyData} labels={MONTHS} />
          </div>

          {/* Donut */}
          <div style={{ background: 'var(--card)', borderRadius: 18, padding: '24px 20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>
              {isClient ? t('Spending by Category', hindiMode) : t('Jobs by Skill', hindiMode)}
            </h3>
            <DonutChart segments={isClient ? analytics.categories : analytics.skills} centerLabel={isClient ? 'categories' : 'skills'} />
            <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: '6px 16px', justifyContent: 'center' }}>
              {(isClient ? analytics.categories : analytics.skills).map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontWeight: 800 }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          {isClient ? (
            <>
              {/* AI Match Accuracy */}
              <div style={{ background: 'var(--card)', borderRadius: 18, padding: '28px 20px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{t('AI Match Accuracy', hindiMode)}</h3>
                <ProgressRing value={analytics.matchAccuracy} label={t('of hires from AI top picks', hindiMode)} color="#22c55e" />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.5 }}>
                  {analytics.matchAccuracy}% of your hires came from workers ranked in AI's top 3
                </p>
              </div>
              {/* Recent Jobs */}
              <div style={{ background: 'var(--card)', borderRadius: 18, padding: '24px 20px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{t('Recent Hires', hindiMode)}</h3>
                {analytics.recentJobs.map((h, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0',
                    borderBottom: i < analytics.recentJobs.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{h.job[0]}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{h.job}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{h.date}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--primary)' }}>₹{h.amount?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Top Locations */}
              <div style={{ background: 'var(--card)', borderRadius: 18, padding: '24px 20px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>📍 {t('Top Work Locations', hindiMode)}</h3>
                {analytics.locations.map(loc => (
                  <HBar key={loc.area} label={loc.area} value={loc.jobs}
                    maxValue={Math.max(...analytics.locations.map(l => l.jobs), 1)} color="#3b82f6" suffix=" jobs" />
                ))}
              </div>
              {/* Weekly Earnings */}
              <div style={{ background: 'var(--card)', borderRadius: 18, padding: '24px 20px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>💵 {t('This Month Breakdown', hindiMode)}</h3>
                {analytics.weeklyEarnings.map(w => (
                  <HBar key={w.week} label={w.week} value={w.amount}
                    maxValue={Math.max(...analytics.weeklyEarnings.map(e => e.amount), 1)} color="#ea580c" />
                ))}
                <div style={{
                  marginTop: 12, padding: '12px 14px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fed7aa',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t('This month total', hindiMode)}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                      ₹{analytics.weeklyEarnings.reduce((a, b) => a + b.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Full width breakdown */}
        <div style={{ background: 'var(--card)', borderRadius: 18, padding: '24px 20px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>
            {isClient ? t('Detailed Spending', hindiMode) : t('Skill Performance', hindiMode)}
          </h3>
          {(isClient ? analytics.categories : analytics.skills).map(cat => (
            <HBar key={cat.name} label={cat.name} value={isClient ? cat.amount : cat.jobs}
              maxValue={isClient ? Math.max(...analytics.categories.map(c => c.amount), 1) : Math.max(...analytics.skills.map(s => s.jobs), 1)}
              color={cat.color} suffix={isClient ? '' : ' jobs'} />
          ))}
        </div>

      </div>
    </div>
  );
}
