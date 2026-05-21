import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../services/translations';
import { submitReviewAPI } from '../services/api';
import NavigatorHelper from '../components/NavigatorHelper';
import VoiceAssistant from '../components/VoiceAssistant';



function StarSelect({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          style={{
            fontSize: 34,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            filter: s <= value ? 'none' : 'grayscale(1) opacity(0.35)',
            transition: 'transform 0.1s',
            transform: s <= value ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
const QUICK_TAGS = ['On Time', 'Good Quality', 'Professional', 'Clean Work', 'Cooperative', 'Paid Promptly', 'Would Recommend'];

export default function ReviewPage() {
  const { reviews, submitReview, role, hindiMode, user, workerProfile } = useApp();
  const [tab, setTab] = useState('leave');
  const [form, setForm] = useState({ rating: 0, comment: '', targetName: '', jobTitle: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const myName = role === 'worker'
    ? (workerProfile?.name || user?.name || 'Worker')
    : (user?.name || 'Client');

  // Generate personalized mock reviews based on logged-in user
  const MOCK_REVIEWS = role === 'worker' ? [
    { id: 1, reviewer: 'Ramesh Gupta', target: myName, rating: 5, comment: `Excellent work by ${myName}! Very professional and completed the job on time.`, date: '2024-01-15', type: 'client-to-worker' },
    { id: 2, reviewer: myName, target: 'Ramesh Gupta', rating: 4, comment: 'Good client. Paid on time and was cooperative.', date: '2024-01-15', type: 'worker-to-client' },
    { id: 3, reviewer: 'Sunita Sharma', target: myName, rating: 5, comment: `${myName} did amazing work. Will hire again!`, date: '2024-01-10', type: 'client-to-worker' },
  ] : [
    { id: 1, reviewer: myName, target: 'Raju Mistri', rating: 5, comment: 'Excellent painter! Did a fantastic job on our house.', date: '2024-01-15', type: 'client-to-worker' },
    { id: 2, reviewer: 'Suresh Kumar', target: myName, rating: 4, comment: `${myName} is a great client. Pays on time.`, date: '2024-01-12', type: 'worker-to-client' },
    { id: 3, reviewer: myName, target: 'Amit Yadav', rating: 5, comment: 'Best AC technician. Very skilled and punctual.', date: '2024-01-08', type: 'client-to-worker' },
  ];

  const allReviews = [...MOCK_REVIEWS, ...reviews];

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.rating === 0) { setToast('❌ Please select a star rating'); setTimeout(() => setToast(''), 3000); return; }
    setSubmitting(true);
    await submitReviewAPI(form);
    submitReview({ ...form, reviewer: myName, date: new Date().toISOString().split('T')[0] });
    setForm({ rating: 0, comment: '', targetName: '', jobTitle: '' });
    setToast('✅ Review submitted! Thank you.');
    setTab('all');
    setTimeout(() => setToast(''), 3000);
    setSubmitting(false);
  }

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 24, maxWidth: 600 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>{t('⭐ Ratings & Reviews', hindiMode)}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>{t('Build trust in the community', hindiMode)}</p>

        {toast && <div className={`alert ${toast.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{toast}</div>}

        <div className="tabs">
          <button className={`tab ${tab === 'leave' ? 'active' : ''}`} onClick={() => setTab('leave')}>{t('✍️ Leave Review', hindiMode)}</button>
          <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>{t('📋 All Reviews', hindiMode)} ({allReviews.length})</button>
        </div>

        {tab === 'leave' && (
          <div className="card fade-in">
            <h3 style={{ fontSize: 18, marginBottom: 20 }}>
              {role === 'worker' ? t('📝 Rate the Client', hindiMode) : t('📝 Rate the Worker', hindiMode)}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  {role === 'worker' ? t('Client Name', hindiMode) : t('Worker Name', hindiMode)} *
                </label>
                <NavigatorHelper tip="Enter the name of the person you worked with" step={1}>
                  <input
                    className="form-input"
                    placeholder={role === 'worker' ? 'e.g. Ramesh Gupta' : 'e.g. Raju Mistri'}
                    value={form.targetName}
                    onChange={e => setForm(f => ({ ...f, targetName: e.target.value }))}
                    required
                  />
                </NavigatorHelper>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Job / Work Done *', hindiMode)}</label>
                <NavigatorHelper tip="Name of the job you completed together" step={2}>
                  <input
                    className="form-input"
                    placeholder="e.g. House Painting"
                    value={form.jobTitle}
                    onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                    required
                  />
                </NavigatorHelper>
              </div>

              <div className="form-group">
                <label className="form-label">{t('Your Rating *', hindiMode)}</label>
                <StarSelect value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                {form.rating > 0 && (
                  <div style={{ marginTop: 6, fontSize: 14, color: 'var(--primary)', fontWeight: 700 }}>
                    {t(RATING_LABELS[form.rating], hindiMode)}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{t('Your Review', hindiMode)}</label>
                <NavigatorHelper tip="Describe your experience honestly. Your review helps others make better decisions." step={3} position="bottom">
                  <textarea
                    className="form-textarea"
                    placeholder="Share your honest experience about the work quality, behaviour, punctuality..."
                    value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    style={{ minHeight: 120 }}
                  />
                </NavigatorHelper>
              </div>

              {/* Quick tags */}
              <div className="form-group">
                <label className="form-label">{t('Quick Tags (optional)', hindiMode)}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {QUICK_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, comment: f.comment ? `${f.comment}, ${tag}` : tag }))}
                      style={{
                        padding: '6px 12px', borderRadius: 99, fontSize: 13,
                        border: '1px solid var(--border)', background: '#fff',
                        cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600,
                      }}
                    >
                      + {t(tag, hindiMode)}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={submitting}>
                {submitting ? t('⏳ Submitting...', hindiMode) : t('⭐ Submit Review', hindiMode)}
              </button>
            </form>
          </div>
        )}

        {tab === 'all' && (
          <div className="fade-in">
            {/* Summary stats */}
            <div style={{ background: '#fff0e8', border: '1px solid var(--primary)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>
                {(allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length || 0).toFixed(1)}
              </div>
              <div className="stars" style={{ fontSize: 22, margin: '6px 0' }}>⭐⭐⭐⭐⭐</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{allReviews.length} {t('reviews', hindiMode)}</div>
            </div>

            {allReviews.length === 0 ? (
              <div className="empty-state">
                <div className="emoji">💬</div>
                <h3>{t('No Reviews Yet', hindiMode)}</h3>
              </div>
            ) : (
              allReviews.map(r => (
                <div key={r.id} className="card fade-in" style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="avatar" style={{ width: 40, height: 40, fontSize: 15 }}>
                        {(r.reviewer || 'U')[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{r.reviewer}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>→ {r.target}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="stars">{'⭐'.repeat(r.rating)}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</div>
                    </div>
                  </div>
                  {r.comment && (
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{r.comment}"
                    </p>
                  )}
                  {r.jobTitle && (
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      <span className="badge badge-orange">💼 {r.jobTitle}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <VoiceAssistant />
    </div>
  );
}
