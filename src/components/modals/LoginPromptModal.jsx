import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserPlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useUI } from '../../context/UIContext';

/**
 * LoginPromptModal
 *
 * A lightweight, friendly modal that appears when an unauthenticated
 * user tries to perform a protected action (follow, like, join room, etc.).
 *
 * State is driven by UIContext.loginPrompt:
 *   null                    → modal hidden
 *   { action: "follow people" } → modal visible with contextual message
 */
export default function LoginPromptModal() {
  const { loginPrompt, closeLoginPrompt } = useUI();
  const navigate = useNavigate();

  if (!loginPrompt) return null;

  const goTo = (tab) => {
    closeLoginPrompt();
    navigate(`/login?tab=${tab}`);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={e => e.target === e.currentTarget && closeLoginPrompt()}
    >
      <div
        className="modal-box animate-modal-in"
        style={{ maxWidth: 400, textAlign: 'center', padding: '40px 36px' }}
      >
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--primary-dim)',
          border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <LockClosedIcon style={{ width: 26, height: 26, color: 'var(--primary-light)' }} />
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
          color: 'var(--text-primary)', marginBottom: 8,
        }}>
          Sign in to continue
        </h2>

        {/* Contextual reason */}
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
          You need an account to{' '}
          <strong style={{ color: 'var(--primary-light)' }}>{loginPrompt.action}</strong>.
          <br />
          It's free and takes less than a minute.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px 0', fontSize: 14 }}
            onClick={() => goTo('register')}
          >
            <UserPlusIcon style={{ width: 16, height: 16 }} />
            Create Free Account
          </button>

          <button
            className="btn btn-secondary"
            style={{ width: '100%', padding: '11px 0', fontSize: 14 }}
            onClick={() => goTo('login')}
          >
            <ArrowRightIcon style={{ width: 15, height: 15 }} />
            Sign In
          </button>

          <button
            onClick={closeLoginPrompt}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 13, marginTop: 4,
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
