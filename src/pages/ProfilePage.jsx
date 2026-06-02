import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPinIcon, BriefcaseIcon, CalendarIcon,
  ArrowLeftIcon, LinkIcon,
} from '@heroicons/react/24/outline';
import { useAuth }   from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { formatCount, displayName } from '../utils/formatters';
import { VerifiedBadge, TagList, FullPageLoader } from '../components/ui/UIComponents';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { users, usersLoading, following, toggleFollow, likedUsers, toggleUserLike } = useSocial();

  const isOwn = !id || id === String(currentUser?.id);
  const profileUser = isOwn
    ? {
        ...currentUser,
        followers: currentUser.followers || 824,
        following: currentUser.following || 312,
        posts: 47,
        interests: currentUser.interests || [],
        occupation: currentUser.occupation || 'Software Engineer',
        bio: currentUser.bio || '',
        isVerified: true,
      }
    : users.find(u => String(u.id) === String(id));

  if (!isOwn && usersLoading) return <FullPageLoader message="Loading profile..." />;
  if (!profileUser) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Profile not found.</p>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/explore')}>
        Back to Explore
      </button>
    </div>
  );

  const isFollowing = following.has(profileUser.id);
  const isLiked     = likedUsers.has(profileUser.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Back button (non-own profile) */}
      {!isOwn && (
        <button
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
          style={{ alignSelf: 'flex-start', gap: 6, marginBottom: 12 }}
        >
          <ArrowLeftIcon style={{ width: 16, height: 16 }} /> Back
        </button>
      )}

      {/* Cover banner */}
      <div style={{
        height: 140,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: -40 }} />
        <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -40, left: 40 }} />
      </div>

      {/* Profile card */}
      <div className="card" style={{
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        borderTop: 'none', padding: '0 24px 24px',
      }}>
        {/* Avatar + action row */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginTop: -40, marginBottom: 16,
        }}>
          <img
            src={profileUser.image}
            alt={displayName(profileUser)}
            style={{
              width: 84, height: 84, borderRadius: '50%', objectFit: 'cover',
              border: '4px solid var(--bg-surface)',
            }}
            className={isFollowing ? 'avatar-ring-primary' : ''}
          />
          {!isOwn && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn ${isLiked ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                onClick={() => toggleUserLike(profileUser.id)}
              >
                {isLiked ? '❤️ Liked' : '🤍 Like'}
              </button>
              <button
                className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                onClick={() => toggleFollow(profileUser.id)}
              >
                {isFollowing ? 'Following ✓' : '+ Follow'}
              </button>
            </div>
          )}
          {isOwn && (
            <button className="btn btn-secondary btn-sm">Edit Profile</button>
          )}
        </div>

        {/* Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            {displayName(profileUser)}
          </h1>
          {profileUser.isVerified && <VerifiedBadge size={18} />}
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>@{profileUser.username}</p>

        {/* Bio */}
        {profileUser.bio && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
            {profileUser.bio}
          </p>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          {profileUser.address?.city && (
            <MetaItem icon={<MapPinIcon style={{ width: 14, height: 14 }} />} text={profileUser.address.city} />
          )}
          {profileUser.occupation && (
            <MetaItem icon={<BriefcaseIcon style={{ width: 14, height: 14 }} />} text={profileUser.occupation} />
          )}
          <MetaItem icon={<CalendarIcon style={{ width: 14, height: 14 }} />} text="Joined 2024" />
        </div>

        {/* Interests */}
        {profileUser.interests?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <TagList tags={profileUser.interests} max={6} />
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0, borderTop: '1px solid var(--border-subtle)', paddingTop: 16,
        }}>
          {[
            { label: 'Followers', value: profileUser.followers },
            { label: 'Following', value: profileUser.following },
            { label: 'Posts',     value: profileUser.posts },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              textAlign: 'center',
              borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {formatCount(stat.value)}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity placeholder */}
      <div className="card" style={{ marginTop: 16, padding: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          {isOwn ? 'Your Activity' : `${profileUser.firstName}'s Posts`}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Just shipped a new feature at work. Feeling good! 🚀',
            'Reading "Clean Architecture" by Uncle Bob. Highly recommend.',
            'Morning run done ✅ 5km in 24 min. Getting faster!',
          ].map((text, i) => (
            <div key={i} style={{
              padding: '12px 0',
              borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{text}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{i + 1} day{i !== 0 ? 's' : ''} ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, text }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
      {icon}{text}
    </span>
  );
}
