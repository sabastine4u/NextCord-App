import { useNavigate } from 'react-router-dom';
import { FireIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useSocial }  from '../../context/SocialContext';
import { formatCount } from '../../utils/formatters';
import { VerifiedBadge } from '../ui/UIComponents';

const TRENDING = [
  { tag: 'OpenSource',    posts: 2841 },
  { tag: 'ReactJS',       posts: 1920 },
  { tag: 'AIFirst',       posts: 4120 },
  { tag: 'SystemDesign',  posts: 890  },
  { tag: 'NaijaTech',     posts: 640  },
];

export default function RightPanel() {
  const { users, following, toggleFollow } = useSocial();
  const navigate = useNavigate();

  // Suggest users not yet followed
  const suggestions = users
    .filter(u => !following.has(u.id) && u.id !== 999)
    .slice(0, 4);

  return (
    <aside style={{
      width: 280,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: '20px 16px',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 60px)',
      position: 'sticky',
      top: 60,
    }}>
      {/* Trending */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <FireIcon style={{ width: 16, height: 16, color: 'var(--gold)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>Trending</span>
        </div>
        {TRENDING.map((t, i) => (
          <div
            key={t.tag}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '7px 0',
              borderBottom: i < TRENDING.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              cursor: 'pointer',
            }}
          >
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>#{t.tag}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatCount(t.posts)} posts</p>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>#{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <SparklesIcon style={{ width: 16, height: 16, color: 'var(--primary-light)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>Suggested</span>
          </div>
          {suggestions.map(user => (
            <div key={user.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            }}>
              <img
                src={user.image}
                alt={user.firstName}
                onClick={() => navigate(`/profile/${user.id}`)}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <p
                    onClick={() => navigate(`/profile/${user.id}`)}
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {user.firstName} {user.lastName}
                  </p>
                  {user.isVerified && <VerifiedBadge size={12} />}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.occupation}</p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => toggleFollow(user.id)}
                style={{ padding: '4px 10px', fontSize: 11 }}
              >
                Follow
              </button>
            </div>
          ))}
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/explore')}
            style={{ width: '100%', fontSize: 13, marginTop: 4 }}
          >
            See more →
          </button>
        </div>
      )}

      {/* Footer */}
      <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, padding: '0 4px' }}>
        © 2025 Nextcord · Privacy · Terms · About
      </p>
    </aside>
  );
}
