import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../services/translations';
import NavigatorHelper, { StepGuide } from '../components/NavigatorHelper';

const SKILL_OPTIONS = ['Painting', 'Electrician', 'Plumbing', 'Carpentry', 'AC Technician', 'Masonry', 'Welding', 'Tiling', 'Gardening', 'Cleaning', 'Driving', 'Security Guard'];
const STEPS = ['Basic Info', 'Skills', 'Work Prefs', 'Review'];

export default function WorkerProfileSetup() {
  const navigate = useNavigate();
  const { setUser, updateWorkerProfile, hindiMode } = useApp();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', location: '', pincode: '',
    skills: [], experience: '', dailyRate: '', availability: 'available',
    bio: '',
  });

  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function toggleSkill(s) {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s],
    }));
  }

  async function handleFinish() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    updateWorkerProfile({
      name: form.name,
      phone: form.phone,
      location: form.location,
      skills: form.skills,
      experience: form.experience,
      availability: form.availability === 'available',
      rating: 5.0,
      jobsDone: 0,
    });
    setUser(prev => ({
      ...prev,
      name: form.name,
      phone: form.phone,
    }));
    setSaving(false);
    navigate('/worker/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>{t('Create Your Worker Profile', hindiMode)}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('Fill all details to get better job matches', hindiMode)}</p>
        </div>

        <StepGuide steps={STEPS.map(s => t(s, hindiMode))} current={step} />

        <div className="card">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="fade-in">
              <h2 style={{ fontSize: 20, marginBottom: 20 }}>{t('👤 Basic Information', hindiMode)}</h2>
              <div className="form-group">
                <label className="form-label">{t('Full Name *', hindiMode)}</label>
                <NavigatorHelper tip="Enter your full name as it appears on Aadhaar card" step={1}>
                  <input className="form-input" placeholder="e.g. Raju Mistri" value={form.name} onChange={e => update('name', e.target.value)} />
                </NavigatorHelper>
              </div>
              <div className="form-group">
                <label className="form-label">{t('Mobile Number *', hindiMode)}</label>
                <NavigatorHelper tip="Your registered mobile number for job alerts and payments" step={2}>
                  <input className="form-input" type="tel" placeholder="10-digit mobile" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g,'').slice(0,10))} />
                </NavigatorHelper>
              </div>
              <div className="form-group">
                <label className="form-label">{t('Your Location / Area *', hindiMode)}</label>
                <NavigatorHelper tip="Enter your area name so we can show nearby jobs" step={3}>
                  <input className="form-input" placeholder="e.g. Sector 62, Noida" value={form.location} onChange={e => update('location', e.target.value)} />
                </NavigatorHelper>
              </div>
              <div className="form-group">
                <label className="form-label">{t('PIN Code', hindiMode)}</label>
                <NavigatorHelper tip="Your PIN code helps us find the closest job opportunities" step={4} position="bottom">
                  <input className="form-input" placeholder="e.g. 201301" maxLength={6} value={form.pincode} onChange={e => update('pincode', e.target.value.replace(/\D/g,'').slice(0,6))} />
                </NavigatorHelper>
              </div>
            </div>
          )}

          {/* Step 1: Skills */}
          {step === 1 && (
            <div className="fade-in">
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>{t('🛠 Your Skills', hindiMode)}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>{t('Select all skills you have', hindiMode)}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {SKILL_OPTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 99,
                      border: form.skills.includes(s) ? '2px solid var(--primary)' : '2px solid var(--border)',
                      background: form.skills.includes(s) ? '#fff0e8' : '#fff',
                      color: form.skills.includes(s) ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14,
                      transition: 'all 0.15s',
                    }}
                  >
                    {form.skills.includes(s) ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>
              {form.skills.length === 0 && (
                <div className="alert alert-info" style={{ marginTop: 16 }}>
                  💡 {t('Select at least one skill to get job recommendations', hindiMode)}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Work Preferences */}
          {step === 2 && (
            <div className="fade-in">
              <h2 style={{ fontSize: 20, marginBottom: 20 }}>{t('⚙️ Work Preferences', hindiMode)}</h2>
              <div className="form-group">
                <label className="form-label">{t('Years of Experience *', hindiMode)}</label>
                <NavigatorHelper tip="How many years have you been doing this work? More experience = higher match score" step={1}>
                  <select className="form-select" value={form.experience} onChange={e => update('experience', e.target.value)}>
                    <option value="">{t('Select experience', hindiMode)}</option>
                    {['< 1 year', '1-2 years', '3-5 years', '5-10 years', '10+ years'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </NavigatorHelper>
              </div>
              <div className="form-group">
                <label className="form-label">{t('Expected Daily Rate (₹)', hindiMode)}</label>
                <NavigatorHelper tip="How much do you charge per day? Clients will see this when reviewing your profile" step={2}>
                  <input className="form-input" type="number" placeholder="e.g. 800" value={form.dailyRate} onChange={e => update('dailyRate', e.target.value)} />
                </NavigatorHelper>
              </div>
              <div className="form-group">
                <label className="form-label">{t('Current Availability', hindiMode)}</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[['available', t('🟢 Available Now', hindiMode)], ['busy', t('🔴 Currently Busy', hindiMode)]].map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update('availability', v)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 10,
                        border: form.availability === v ? '2px solid var(--primary)' : '2px solid var(--border)',
                        background: form.availability === v ? '#fff0e8' : '#fff',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('About Yourself (optional)', hindiMode)}</label>
                <textarea className="form-textarea" placeholder="Describe your work experience, specialties..." value={form.bio} onChange={e => update('bio', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="fade-in">
              <h2 style={{ fontSize: 20, marginBottom: 20 }}>{t('✅ Review Your Profile', hindiMode)}</h2>
              <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                  <div className="avatar" style={{ width: 56, height: 56, fontSize: 22 }}>
                    {form.name ? form.name[0] : '?'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18 }}>{form.name || '—'}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>📱 {form.phone || '—'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>📍 {form.location || '—'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {form.skills.map(s => <span key={s} className="badge badge-orange">{s}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14, color: 'var(--text-muted)' }}>
                  <span>🛠 {form.experience || '—'}</span>
                  <span>💰 ₹{form.dailyRate || '—'}/day</span>
                  <span>🟢 {form.availability === 'available' ? t('Available', hindiMode) : t('Busy', hindiMode)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {step > 0 && (
              <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>{t('← Back', hindiMode)}</button>
            )}
            {step < 3 ? (
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && (!form.name || !form.phone || !form.location)}
              >
                {t('Next →', hindiMode)}
              </button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleFinish} disabled={saving}>
                {saving ? t('⏳ Saving...', hindiMode) : t('🚀 Complete Setup', hindiMode)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
