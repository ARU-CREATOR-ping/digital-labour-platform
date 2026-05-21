import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../services/translations';
import NavigatorHelper, { StepGuide } from '../components/NavigatorHelper';

const SKILL_OPTIONS = ['Painting', 'Electrician', 'Plumbing', 'Carpentry', 'AC Technician', 'Masonry', 'Welding', 'Tiling', 'Gardening', 'Cleaning', 'Driving', 'Security Guard'];
const CATEGORIES = ['Painting', 'Electrician', 'Plumbing', 'Carpentry', 'AC Technician', 'Masonry', 'Welding', 'Tiling', 'Gardening', 'Cleaning', 'Driving', 'Security Guard'];
const STEPS = ['Job Details', 'Requirements', 'Payment', 'Review'];

export default function PostJobPage() {
  const { postJob, user, hindiMode } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    skills: [],
    experience: '',
    duration: '',
    workers: '1',
    pay: '',
    payType: 'daily',
    urgency: 'normal',
    startDate: '',
  });

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function toggleSkill(s) {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s],
    }));
  }

  async function handlePost() {
    setPosting(true);
    await new Promise(r => setTimeout(r, 900));
    postJob({
      ...form,
      clientId: user?.id || 'client1',
      clientName: 'Client',
      clientRating: 4.5,
    });
    setPosting(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: 60, maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>{t('Job Posted!', hindiMode)}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 28 }}>
            Your job "<strong>{form.title}</strong>" is now live. Workers will start applying soon.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/client/applicants')}>
              {t('👥 View Applicants', hindiMode)}
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => { setSuccess(false); setStep(0); setForm({ title:'',category:'',location:'',description:'',skills:[],experience:'',duration:'',workers:'1',pay:'',payType:'daily',urgency:'normal',startDate:'' }); }}>
              {t('➕ Post Another Job', hindiMode)}
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/client/dashboard')}>
              {t('🏠 Back to Dashboard', hindiMode)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24, maxWidth: 600 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>{t('➕ Post a Job', hindiMode)}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{t('Fill in details to find the right worker', hindiMode)}</p>

        <StepGuide steps={STEPS.map(s => t(s, hindiMode))} current={step} />

        <div className="card">
          {/* Step 0: Job Details */}
          {step === 0 && (
            <div className="fade-in">
              <h2 style={{ fontSize: 20, marginBottom: 20 }}>{t('📋 Job Details', hindiMode)}</h2>

              <div className="form-group">
                <label className="form-label">{t('Job Title *', hindiMode)}</label>
                <NavigatorHelper tip="Write a clear, specific title like 'House Painting – 2 BHK' so workers understand the job quickly" step={1}>
                  <input className="form-input" placeholder="e.g. House Painting – 2 BHK" value={form.title} onChange={e => update('title', e.target.value)} />
                </NavigatorHelper>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Category *', hindiMode)}</label>
                <NavigatorHelper tip="Select the main type of work. This helps AI match the right workers." step={2}>
                  <select className="form-select" value={form.category} onChange={e => update('category', e.target.value)}>
                    <option value="">{t('Select Category', hindiMode)}</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </NavigatorHelper>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Work Location *', hindiMode)}</label>
                <NavigatorHelper tip="Enter the exact area where work needs to be done" step={3}>
                  <input className="form-input" placeholder="e.g. Sector 14, Noida" value={form.location} onChange={e => update('location', e.target.value)} />
                </NavigatorHelper>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Job Description *', hindiMode)}</label>
                <NavigatorHelper tip="Describe the work in detail — materials provided, scope, special requirements" step={4} position="bottom">
                  <textarea className="form-textarea" placeholder="Describe what work needs to be done, any special requirements..." value={form.description} onChange={e => update('description', e.target.value)} />
                </NavigatorHelper>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Urgency', hindiMode)}</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['normal', t('🟡 Normal', hindiMode)], ['urgent', t('🔴 Urgent', hindiMode)]].map(([v, l]) => (
                    <button key={v} type="button"
                      onClick={() => update('urgency', v)}
                      style={{
                        flex: 1, padding: '12px', borderRadius: 10,
                        border: form.urgency === v ? '2px solid var(--primary)' : '2px solid var(--border)',
                        background: form.urgency === v ? '#fff0e8' : '#fff',
                        cursor: 'pointer', fontWeight: 600, fontSize: 14,
                      }}
                    >{l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Requirements */}
          {step === 1 && (
            <div className="fade-in">
              <h2 style={{ fontSize: 20, marginBottom: 16 }}>{t('🛠 Required Skills', hindiMode)}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>{t('Select skills needed — these are used for AI matching', hindiMode)}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                {SKILL_OPTIONS.map(s => (
                  <button key={s} type="button" onClick={() => toggleSkill(s)} style={{
                    padding: '10px 14px', borderRadius: 99,
                    border: form.skills.includes(s) ? '2px solid var(--primary)' : '2px solid var(--border)',
                    background: form.skills.includes(s) ? '#fff0e8' : '#fff',
                    color: form.skills.includes(s) ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
                  }}>
                    {form.skills.includes(s) ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">{t('Minimum Experience', hindiMode)}</label>
                <select className="form-select" value={form.experience} onChange={e => update('experience', e.target.value)}>
                  <option value="">{t('Any experience', hindiMode)}</option>
                  {['< 1 year', '1-2 years', '3-5 years', '5+ years'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Number of Workers Needed', hindiMode)}</label>
                <input className="form-input" type="number" min="1" max="50" value={form.workers} onChange={e => update('workers', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">{t('Expected Start Date', hindiMode)}</label>
                <input className="form-input" type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="fade-in">
              <h2 style={{ fontSize: 20, marginBottom: 20 }}>{t('💰 Payment Details', hindiMode)}</h2>

              <div className="form-group">
                <label className="form-label">{t('Pay Amount (₹) *', hindiMode)}</label>
                <NavigatorHelper tip="Enter how much you will pay per day or as a fixed amount for the job" step={1}>
                  <input className="form-input" type="number" placeholder="e.g. 800" value={form.pay} onChange={e => update('pay', e.target.value)} />
                </NavigatorHelper>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Pay Type', hindiMode)}</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['daily', t('📅 Per Day', hindiMode)], ['fixed', t('💵 Fixed Amount', hindiMode)], ['hourly', t('🕐 Per Hour', hindiMode)]].map(([v, l]) => (
                    <button key={v} type="button"
                      onClick={() => update('payType', v)}
                      style={{
                        flex: 1, padding: '12px', borderRadius: 10,
                        border: form.payType === v ? '2px solid var(--primary)' : '2px solid var(--border)',
                        background: form.payType === v ? '#fff0e8' : '#fff',
                        cursor: 'pointer', fontWeight: 600, fontSize: 13,
                      }}
                    >{l}</button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Job Duration', hindiMode)}</label>
                <NavigatorHelper tip="How long will this job take? e.g. 1 day, 3 days, 1 week" step={2}>
                  <input className="form-input" placeholder="e.g. 3 days" value={form.duration} onChange={e => update('duration', e.target.value)} />
                </NavigatorHelper>
              </div>

              {form.pay && form.duration && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 16px', fontSize: 14 }}>
                  💡 Estimated total: <strong>₹{form.pay} × {form.workers} worker(s)</strong> per {form.payType}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="fade-in">
              <h2 style={{ fontSize: 20, marginBottom: 20 }}>{t('✅ Review Job Post', hindiMode)}</h2>
              <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{form.title || '—'}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {form.skills.map(s => <span key={s} className="badge badge-orange">{s}</span>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: 14, color: 'var(--text-muted)' }}>
                  <span>📍 {form.location || '—'}</span>
                  <span>🏷 {form.category || '—'}</span>
                  <span>💰 ₹{form.pay || '—'}/{form.payType}</span>
                  <span>⏱ {form.duration || '—'}</span>
                  <span>👥 {form.workers} worker(s)</span>
                  <span>{form.urgency === 'urgent' ? t('🔴 Urgent', hindiMode) : t('🟡 Normal', hindiMode)}</span>
                </div>
                {form.description && (
                  <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>{form.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {step > 0 && <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>{t('← Back', hindiMode)}</button>}
            {step < 3 ? (
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && (!form.title || !form.category || !form.location)}
              >
                {t('Next →', hindiMode)}
              </button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePost} disabled={posting || !form.pay}>
                {posting ? t('⏳ Posting...', hindiMode) : t('🚀 Post Job', hindiMode)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
