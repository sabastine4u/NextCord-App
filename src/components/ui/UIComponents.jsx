import React from 'react';
import { XMarkIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

// ── Modal ──────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = 'default' }) {
  if (!isOpen) return null;
  const maxW = { sm: '380px', default: '520px', lg: '680px', xl: '800px' }[size];
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: maxW }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ padding: '6px' }}>
            <XMarkIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>
        <div className="divider" />
        <div style={{ padding: '20px 24px 24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────────────────────────
export function Spinner({ size = 32, color = 'var(--primary)' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid var(--border-default)`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}

// Add spin keyframe inline
if (typeof document !== 'undefined' && !document.getElementById('spin-style')) {
  const s = document.createElement('style');
  s.id = 'spin-style';
  s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
}

// ── FullPageLoader ─────────────────────────────────────────────────────────────
export function FullPageLoader({ message = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 60 }}>
      <Spinner size={40} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{message}</p>
    </div>
  );
}

// ── VerifiedBadge ──────────────────────────────────────────────────────────────
export function VerifiedBadge({ size = 16 }) {
  return <CheckBadgeIcon style={{ width: size, height: size, color: 'var(--accent)', flexShrink: 0 }} />;
}

// ── SearchBar ──────────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search...', style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <MagnifyingGlassIcon style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        width: 16, height: 16, color: 'var(--text-muted)', pointerEvents: 'none',
      }} />
      <input
        className="input-base"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ paddingLeft: 38 }}
      />
    </div>
  );
}

// ── FilterChips ────────────────────────────────────────────────────────────────
export function FilterChips({ options, value, onChange, style }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', ...style }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.18s',
            background: value === opt.value ? 'var(--primary)' : 'var(--bg-elevated)',
            color: value === opt.value ? '#fff' : 'var(--text-secondary)',
            boxShadow: value === opt.value ? 'var(--shadow-glow-primary)' : 'none',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={onPrev}
        disabled={page === 1}
        style={{ minWidth: 72 }}
      >
        ← Prev
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onGoTo(p)}
          style={{
            width: 32, height: 32,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            background: page === p ? 'var(--primary)' : 'var(--bg-elevated)',
            color: page === p ? '#fff' : 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}
        >
          {p}
        </button>
      ))}
      {totalPages > 7 && <span style={{ color: 'var(--text-muted)' }}>…{totalPages}</span>}
      <button
        className="btn btn-secondary btn-sm"
        onClick={onNext}
        disabled={page === totalPages}
        style={{ minWidth: 72 }}
      >
        Next →
      </button>
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', textAlign: 'center', gap: 12,
    }}>
      {icon && <div style={{ fontSize: 40, marginBottom: 4 }}>{icon}</div>}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>{description}</p>
      )}
      {action}
    </div>
  );
}

// ── TagList ────────────────────────────────────────────────────────────────────
export function TagList({ tags = [], max = 3 }) {
  const shown = tags.slice(0, max);
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {shown.map(t => (
        <span key={t} className="badge badge-primary" style={{ fontSize: 11 }}>#{t}</span>
      ))}
    </div>
  );
}

// ── RatingStars ────────────────────────────────────────────────────────────────
export function RatingStars({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? 'var(--gold)' : 'var(--text-muted)' }}>★</span>
      ))}
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 3 }}>{rating}</span>
    </div>
  );
}

// ── SectionHeader ──────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{title}</h2>
        {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
