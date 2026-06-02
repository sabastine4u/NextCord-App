import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid }              from '@heroicons/react/24/solid';
import { useSocial }    from '../../context/SocialContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { formatCount, displayName } from '../../utils/formatters';
import { VerifiedBadge, TagList }   from '../ui/UIComponents';

export default function ProfileCard({ user, delay = 0 }) {
  const { following, toggleFollow, likedUsers, toggleUserLike } = useSocial();
  const guard    = useAuthGuard();
  const navigate = useNavigate();

  const isFollowing = following.has(user.id);
  const isLiked     = likedUsers.has(user.id);
  const goToProfile = () => navigate(`/profile/${user.id}`);

  // Guard-wrapped handlers
  const handleFollow = guard(() => toggleFollow(user.id),     'follow people');
  const handleLike   = guard(() => toggleUserLike(user.id),   'like profiles');

  return (
    <div
      className="card animate-fade-up"
      style={{ padding: 20, animationDelay: `${delay}ms`, cursor: 'default' }}
    >
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <img
          src={user.image}
          alt={displayName(user)}
          onClick={goToProfile}
          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', flexShrink: 0 }}
          className={isFollowing ? 'avatar-ring-primary' : ''}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <h3
              onClick={goToProfile}
              style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {displayName(user)}
            </h3>
            {user.isVerified && <VerifiedBadge size={14} />}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>@{user.username}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
              <MapPinIcon style={{ width: 12, height: 12 }} />
              {user.address?.city || 'Unknown'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
              <BriefcaseIcon style={{ width: 12, height: 12 }} />
              {user.occupation}
            </span>
          </div>
        </div>
      </div>

      {user.bio && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.55 }}>
          {user.bio.length > 100 ? user.bio.slice(0, 100) + '…' : user.bio}
        </p>
      )}

      {user.interests?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <TagList tags={user.interests} max={3} />
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'flex', gap: 0,
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 0', marginBottom: 14,
      }}>
        {[
          { label: 'Followers', value: user.followers },
          { label: 'Following', value: user.following },
          { label: 'Posts',     value: user.posts },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            flex: 1, textAlign: 'center',
            borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <p style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {formatCount(stat.value)}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
          style={{ flex: 1, fontSize: 13 }}
          onClick={handleFollow}
        >
          {isFollowing ? 'Following ✓' : '+ Follow'}
        </button>
        <button
          className="btn btn-ghost btn-icon"
          onClick={handleLike}
          style={{ color: isLiked ? 'var(--red)' : 'var(--text-secondary)' }}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked
            ? <HeartSolid style={{ width: 20, height: 20 }} />
            : <HeartIcon  style={{ width: 20, height: 20 }} />}
        </button>
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={goToProfile}>
          View
        </button>
      </div>
    </div>
  );
}
