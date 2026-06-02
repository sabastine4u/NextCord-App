import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { useUI }     from '../context/UIContext';
import {
  CheckIcon, StarIcon, UsersIcon,
  DocumentTextIcon, CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { formatCount } from '../utils/formatters';
import { SectionHeader, FilterChips, RatingStars, TagList, EmptyState } from '../components/ui/UIComponents';

const TIER_CONFIG = {
  silver:   { label: 'Silver',   color: '#94a3b8', gradient: 'linear-gradient(135deg,#64748b,#475569)' },
  gold:     { label: 'Gold',     color: 'var(--gold)', gradient: 'linear-gradient(135deg,var(--gold),#fb923c)' },
  platinum: { label: 'Platinum', color: 'var(--accent)', gradient: 'linear-gradient(135deg,var(--accent),var(--primary))' },
};

const FILTER_OPTIONS = [
  { value: 'all',       label: 'All Channels' },
  { value: 'subscribed', label: '✓ Subscribed' },
  { value: 'platinum',  label: '💎 Platinum' },
  { value: 'gold',      label: '🥇 Gold' },
  { value: 'silver',    label: '🥈 Silver' },
];

export default function ChannelsPage() {
  const { channels, subscribedChannels } = useSocial();
  const { openModal } = useUI();
  const [filter, setFilter] = useState('all');

  const shown = channels.filter(ch => {
    if (filter === 'subscribed') return subscribedChannels.has(ch.id);
    if (filter === 'all') return true;
    return ch.tier === filter;
  });

  // Sort: subscribed first, then by subscribers
  const sorted = [...shown].sort((a, b) => {
    const aSub = subscribedChannels.has(a.id) ? 1 : 0;
    const bSub = subscribedChannels.has(b.id) ? 1 : 0;
    if (aSub !== bSub) return bSub - aSub;
    return b.subscribers - a.subscribers;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader
        title="Premium Channels"
        subtitle="Subscribe to exclusive content from top creators"
      />

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        borderRadius: 'var(--radius-lg)', padding: '24px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -60, right: -40 }} />
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>Premium Access</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Unlock expert knowledge.<br />Grow faster.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', maxWidth: 400 }}>
            Paid channels give you direct access to curated insights, exclusive live sessions, and private communities.
          </p>
        </div>
      </div>

      <FilterChips options={FILTER_OPTIONS} value={filter} onChange={setFilter} />

      {/* Subscribed count */}
      {subscribedChannels.size > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
          background: 'var(--green-dim)', borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}>
          <CheckIcon style={{ width: 16, height: 16, color: 'var(--green)' }} />
          <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
            {subscribedChannels.size} active subscription{subscribedChannels.size !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState icon="📡" title="No channels found" description="Try a different filter." action={<button className="btn btn-secondary" onClick={() => setFilter('all')}>Clear filter</button>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sorted.map((ch, i) => (
            <ChannelCard key={ch.id} channel={ch} delay={i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChannelCard({ channel, delay }) {
  const { subscribedChannels } = useSocial();
  const { openModal } = useUI();
  const isSubbed = subscribedChannels.has(channel.id);
  const tier     = TIER_CONFIG[channel.tier] || TIER_CONFIG.silver;

  return (
    <div
      className="card animate-fade-up"
      style={{
        padding: 22, animationDelay: `${delay}ms`,
        borderColor: isSubbed ? 'var(--green)' : undefined,
        boxShadow: isSubbed ? '0 0 0 1px var(--green-dim)' : undefined,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={channel.creator.avatar} alt={channel.creator.name}
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
          {/* Tier badge */}
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 18, height: 18, borderRadius: '50%',
            background: tier.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-elevated)',
          }}>
            <StarIcon style={{ width: 9, height: 9, color: '#fff' }} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              {channel.name}
            </h3>
            {isSubbed && <CheckBadgeIcon style={{ width: 16, height: 16, color: 'var(--green)' }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>by {channel.creator.name}</span>
            {channel.creator.verified && <CheckBadgeIcon style={{ width: 12, height: 12, color: 'var(--accent)' }} />}
          </div>
          <RatingStars rating={channel.rating} />
        </div>

        {/* Price badge */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }} className="gradient-text-gold">
            ${channel.price}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>/{channel.period}</p>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
        {channel.description}
      </p>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <StatChip icon={<UsersIcon style={{ width: 12, height: 12 }} />} text={`${formatCount(channel.subscribers)} subscribers`} />
        <StatChip icon={<DocumentTextIcon style={{ width: 12, height: 12 }} />} text={`${channel.posts} posts`} />
        <span style={{ background: tier.gradient, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, color: '#fff' }}>
          {tier.label}
        </span>
      </div>

      {/* Perks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
        {channel.perks.slice(0, 3).map(perk => (
          <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <CheckIcon style={{ width: 13, height: 13, color: 'var(--green)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{perk}</span>
          </div>
        ))}
        {channel.perks.length > 3 && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 20 }}>+{channel.perks.length - 3} more perks</span>
        )}
      </div>

      <TagList tags={channel.tags} max={4} />

      {/* CTA */}
      <div style={{ marginTop: 16 }}>
        {isSubbed ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--radius-md)', padding: '9px 18px',
              fontSize: 14, fontWeight: 600, color: 'var(--green)',
            }}>
              <CheckIcon style={{ width: 15, height: 15 }} /> Subscribed
            </div>
            <button className="btn btn-secondary btn-sm">View Content</button>
          </div>
        ) : (
          <button
            className="btn btn-gold"
            style={{ width: '100%' }}
            onClick={() => openModal('subscribe', channel)}
          >
            <CurrencyDollarIcon style={{ width: 16, height: 16 }} />
            Subscribe · ${channel.price}/{channel.period}
          </button>
        )}
      </div>
    </div>
  );
}

function StatChip({ icon, text }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
      {icon}{text}
    </span>
  );
}
