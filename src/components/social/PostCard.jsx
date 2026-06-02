import React, { useState } from 'react';
import {
  HeartIcon, ChatBubbleOvalLeftIcon, ArrowPathIcon,
  BookmarkIcon, EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useSocial }     from '../../context/SocialContext';
import { useAuthGuard }  from '../../hooks/useAuthGuard';
import { timeAgo, formatCount } from '../../utils/formatters';
import { VerifiedBadge, TagList } from '../ui/UIComponents';


export default function PostCard({ post, delay = 0 }) {
  const { likedPosts, togglePostLike } = useSocial();
  const guard   = useAuthGuard();
  const [saved, setSaved]     = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isLiked    = likedPosts.has(post.id);
  const likeCount  = post.likes + (isLiked ? 1 : 0);
  const longContent = post.content.length > 200;
  const displayContent = longContent && !expanded
    ? post.content.slice(0, 200) + '…'
    : post.content;

  // Guard-wrapped handlers — show login prompt if not authenticated
  const handleLike    = guard(() => togglePostLike(post.id), 'like posts');
  const handleSave    = guard(() => setSaved(s => !s),       'save posts');
  const handleComment = guard(() => {},                       'comment on posts');
  const handleShare   = guard(() => {},                       'share posts');

  return (
    <article
      className="card animate-fade-up"
      style={{ padding: '20px', animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <img
            src={post.author.avatar}
            alt={post.author.name}
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                {post.author.name}
              </span>
              {post.author.verified && <VerifiedBadge size={13} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{post.author.username}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(post.timestamp)}</span>
            </div>
          </div>
        </div>
        <button className="btn btn-ghost btn-icon" style={{ padding: 4 }}>
          <EllipsisHorizontalIcon style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Content */}
      <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-primary)', marginBottom: 12 }}>
        {displayContent}
        {longContent && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-light)', fontSize: 14, marginLeft: 6 }}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <TagList tags={post.tags} max={4} />
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex', alignItems: 'center',
        borderTop: '1px solid var(--border-subtle)', paddingTop: 12, gap: 0,
      }}>
        <ActionBtn
          icon={isLiked ? <HeartSolid style={{ width: 18, height: 18 }} /> : <HeartIcon style={{ width: 18, height: 18 }} />}
          count={likeCount} active={isLiked} activeColor="var(--red)"
          onClick={handleLike} label="Like"
        />
        <ActionBtn
          icon={<ChatBubbleOvalLeftIcon style={{ width: 18, height: 18 }} />}
          count={post.comments} label="Comment" onClick={handleComment}
        />
        <ActionBtn
          icon={<ArrowPathIcon style={{ width: 18, height: 18 }} />}
          count={post.shares} label="Share" onClick={handleShare}
        />
        <button
          onClick={handleSave}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
            color: saved ? 'var(--primary-light)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', padding: '6px 8px',
            borderRadius: 'var(--radius-sm)', transition: 'all 0.15s',
          }}
        >
          {saved ? <BookmarkSolid style={{ width: 18, height: 18 }} /> : <BookmarkIcon style={{ width: 18, height: 18 }} />}
        </button>
      </div>
    </article>
  );
}

function ActionBtn({ icon, count, active, activeColor, onClick, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
        background: 'none', border: 'none', cursor: 'pointer',
        borderRadius: 'var(--radius-sm)', transition: 'all 0.15s',
        color: active ? activeColor : 'var(--text-muted)',
        fontSize: 13, fontWeight: 500,
      }}
    >
      {icon}
      <span>{formatCount(count)}</span>
    </button>
  );
}
