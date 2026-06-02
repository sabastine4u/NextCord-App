import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  EnvelopeIcon, LockClosedIcon, UserIcon,
  EyeIcon, EyeSlashIcon, ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
  const { authView, setAuthView, login, register, isAuthenticated } = useAuth();
  const navigate        = useNavigate();
  const [params]        = useSearchParams();

  // If they land on /login?tab=register, open registration immediately
  useEffect(() => {
    if (params.get('tab') === 'register') setAuthView('register');
  }, [params]);

  // Redirect already-logged-in users away from /login
  useEffect(() => {
    if (isAuthenticated) navigate(params.get('from') || '/', { replace: true });
  }, [isAuthenticated]);

  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '',
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.email.trim())    return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.password)        return 'Password is required.';
    if (authView === 'register' && form.password.length < 6)
      return 'Password must be at least 6 characters.';
    return null;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError(''); setSuccess('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate network latency

    let result;
    if (authView === 'register') {
      result = register({
        email:     form.email,
        password:  form.password,
        firstName: form.firstName,
        lastName:  form.lastName,
      });
    } else {
      result = login({ email: form.email, password: form.password });
    }

    setLoading(false);

    if (!result.success) {
      setError(result.error);
    } else if (authView === 'register') {
      setSuccess('Account created! Redirecting…');
    }
    // Navigation handled by the isAuthenticated useEffect above
  };

  const switchView = (v) => {
    setAuthView(v); setError(''); setSuccess('');
    setForm({ email: '', password: '', firstName: '', lastName: '' });
  };

  const isRegister = authView === 'register';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(99,102,241,0.13) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(6,182,212,0.10) 0%, transparent 70%)',
      }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 40px 40px',
        position: 'relative',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        animation: 'fadeUp 0.35s ease forwards',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff',
            fontFamily: 'var(--font-display)',
            margin: '0 auto 14px',
            boxShadow: 'var(--shadow-glow-primary)',
          }}>N</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 5,
          }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {isRegister
              ? 'Join the Nextcord community today.'
              : 'Sign in to access your account.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 26,
          background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)', padding: 4,
        }}>
          {['login', 'register'].map(v => (
            <button
              key={v}
              onClick={() => switchView(v)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s',
                background: authView === v ? 'var(--bg-elevated)' : 'transparent',
                color: authView === v ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: authView === v ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {v === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Name fields — register only */}
          {isRegister && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field
                label="First Name" placeholder="Alex" value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                Icon={UserIcon}
              />
              <Field
                label="Last Name" placeholder="Johnson" value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                Icon={UserIcon}
              />
            </div>
          )}

          <Field
            label="Email Address" placeholder="you@example.com"
            type="email" value={form.email}
            onChange={e => set('email', e.target.value)}
            Icon={EnvelopeIcon}
            onEnter={handleSubmit}
          />

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <LockClosedIcon style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 15, height: 15, color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input
                className="input-base"
                type={showPw ? 'text' : 'password'}
                placeholder={isRegister ? 'Min. 6 characters' : '••••••••'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ paddingLeft: 38, paddingRight: 42 }}
              />
              <button
                onClick={() => setShowPw(s => !s)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 4,
                }}
                tabIndex={-1}
                title={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw
                  ? <EyeSlashIcon style={{ width: 15, height: 15 }} />
                  : <EyeIcon      style={{ width: 15, height: 15 }} />}
              </button>
            </div>
            {isRegister && (
              <PasswordStrength password={form.password} />
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px',
              fontSize: 13, color: 'var(--red)',
            }}>
              <ExclamationCircleIcon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px',
              fontSize: 13, color: 'var(--green)',
            }}>
              <CheckBadgeIcon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '12px 0', fontSize: 14, marginTop: 4 }}
          >
            {loading
              ? <Spinner />
              : isRegister ? 'Create Account' : 'Sign In'
            }
          </button>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 20, padding: '11px 14px',
          background: 'var(--accent-dim)', border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--accent-light)',
          textAlign: 'center', lineHeight: 1.55,
        }}>
          <strong>Demo app</strong> — no real payment or verification required.<br />
          Register with any email and a password of 6+ characters.
        </div>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => switchView(isRegister ? 'login' : 'register')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-light)', fontWeight: 600, fontSize: 13 }}
          >
            {isRegister ? 'Sign in' : 'Create one free'}
          </button>
        </p>

        {/* Continue without account */}
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, textDecoration: 'underline' }}
          >
            Continue browsing without an account →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, placeholder, type = 'text', value, onChange, Icon, onEnter }) {
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            width: 15, height: 15, color: 'var(--text-muted)', pointerEvents: 'none',
          }} />
        )}
        <input
          className="input-base"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onEnter ? e => e.key === 'Enter' && onEnter() : undefined}
          style={{ paddingLeft: Icon ? 38 : 14 }}
        />
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  const score = !password ? 0
    : password.length < 6   ? 1
    : password.length < 10  ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
    : 3;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'var(--red)', 'var(--gold)', 'var(--accent)', 'var(--green)'];

  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i <= score ? colors[score] : 'var(--border-default)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
      <span style={{
        width: 14, height: 14,
        border: '2px solid rgba(255,255,255,0.35)',
        borderTop: '2px solid #fff',
        borderRadius: '50%', display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }} />
      Processing…
    </span>
  );
}

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.03em',
};
