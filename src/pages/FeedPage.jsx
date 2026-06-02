import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }      from '../context/AuthContext';
import { useSocial }    from '../context/SocialContext';
import { useUI }        from '../context/UIContext';
import { useAuthGuard } from '../hooks/useAuthGuard';
import PostCard         from '../components/social/PostCard';
import { EmptyState }   from '../components/ui/UIComponents';
import {
  PencilSquareIcon, PhotoIcon, VideoCameraIcon,
  LockClosedIcon, UserPlusIcon,
} from '@heroicons/react/24/outline';

export default function FeedPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const { posts }    = useSocial();
  const { openModal } = useUI();
  const guard        = useAuthGuard();
  const navigate     = useNavigate();

  const handleOpenPost = guard(() => openModal('post'), 'create posts');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Compose box */}
      {isAuthenticated ? (
        /* ── Logged-in compose box ── */
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <img
              src={currentUser?.image}
              alt={currentUser?.firstName}
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <button
              onClick={handleOpenPost}
              style={{
                flex: 1, textAlign: 'left',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-full)',
                padding: '10px 18px',
                color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: 14,
                transition: 'border-color 0.2s',
              }}
            >
              What's on your mind, {currentUser?.firstName}?
            </button>
          </div>
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            {[
              { icon: <PhotoIcon style={{ width: 18, height: 18 }} />,        label: 'Photo' },
              { icon: <VideoCameraIcon style={{ width: 18, height: 18 }} />,   label: 'Video' },
              { icon: <PencilSquareIcon style={{ width: 18, height: 18 }} />,  label: 'Write' },
            ].map(({ icon, label }) => (
              <button
                key={label}
                onClick={handleOpenPost}
                className="btn btn-ghost"
                style={{ flex: 1, gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Guest banner — invite to join ── */
        <div className="card" style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, var(--primary-dim) 0%, var(--accent-dim) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--primary-dim)', border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <LockClosedIcon style={{ width: 20, height: 20, color: 'var(--primary-light)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                Join the conversation
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Create an account to post, follow people, like, and much more.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/login?tab=register')}
              >
                <UserPlusIcon style={{ width: 14, height: 14 }} />
                Sign Up Free
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed posts — visible to everyone */}
      {posts.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No posts yet"
          description="Be the first to share something with the community."
          action={
            isAuthenticated
              ? <button className="btn btn-primary" onClick={handleOpenPost}>Create Post</button>
              : <button className="btn btn-primary" onClick={() => navigate('/login?tab=register')}>Join to Post</button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} delay={i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}
