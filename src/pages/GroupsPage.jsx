import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { useUI }     from '../context/UIContext';
import {
  UsersIcon, LockClosedIcon, GlobeAltIcon, PlusIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { formatCount } from '../utils/formatters';
import { SectionHeader, FilterChips, TagList, EmptyState } from '../components/ui/UIComponents';

const TABS = [
  { value: 'all',  label: 'Discover' },
  { value: 'mine', label: 'My Groups' },
];


export default function GroupsPage() {
  const { groups, joinedGroups, joinGroup, leaveGroup } = useSocial();
  const { openModal } = useUI();
  const [tab, setTab] = useState('all');

  const shown = tab === 'mine'
    ? groups.filter(g => joinedGroups.has(g.id))
    : groups;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader
        title="Groups"
        subtitle="Find your community or start your own"
        action={
          <button className="btn btn-primary" onClick={() => openModal('createGroup')}>
            <PlusIcon style={{ width: 15, height: 15 }} /> Create Group
          </button>
        }
      />

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.value} className={`tab-item ${tab === t.value ? 'active' : ''}`} onClick={() => setTab(t.value)}>
            {t.label}
            {t.value === 'mine' && joinedGroups.size > 0 && (
              <span className="badge badge-primary" style={{ marginLeft: 8 }}>{joinedGroups.size}</span>
            )}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon="👥"
          title={tab === 'mine' ? "You haven't joined any groups yet" : "No groups found"}
          description={tab === 'mine' ? "Discover and join groups to connect with like-minded people." : "Create the first group!"}
          action={tab === 'mine'
            ? <button className="btn btn-primary" onClick={() => setTab('all')}>Discover Groups</button>
            : <button className="btn btn-primary" onClick={() => openModal('createGroup')}>Create Group</button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shown.map((group, i) => (
            <GroupCard
              key={group.id}
              group={group}
              joined={joinedGroups.has(group.id)}
              onJoin={() => joinGroup(group.id)}
              onLeave={() => leaveGroup(group.id)}
              delay={i * 60}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({ group, joined, onJoin, onLeave, delay }) {
  return (
    <div className="card animate-fade-up" style={{ padding: 20, animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: 52, height: 52, borderRadius: 'var(--radius-md)',
          background: 'var(--primary-dim)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 22, flexShrink: 0,
          border: '1px solid var(--primary)',
        }}>
          <UsersIcon style={{ width: 24, height: 24, color: 'var(--primary-light)' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              {group.name}
            </h3>
            {group.isPrivate
              ? <span className="badge badge-gold"><LockClosedIcon style={{ width: 10, height: 10 }} /> Private</span>
              : <span className="badge badge-green"><GlobeAltIcon style={{ width: 10, height: 10 }} /> Public</span>
            }
            {group.role === 'admin' && (
              <span className="badge badge-accent"><ShieldCheckIcon style={{ width: 10, height: 10 }} /> Admin</span>
            )}
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
            {group.description}
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              <UsersIcon style={{ width: 12, height: 12 }} />
              {formatCount(group.members)} members
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {group.postsToday} posts today
            </span>
            <span className="badge" style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)', fontSize: 11 }}>
              {group.category}
            </span>
          </div>

          <TagList tags={group.tags} max={4} />

          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            {joined ? (
              <>
                <button className="btn btn-secondary btn-sm">View Group</button>
                {group.role !== 'admin' && (
                  <button className="btn btn-danger btn-sm" onClick={onLeave}>Leave</button>
                )}
              </>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={onJoin}>
                {group.isPrivate ? '🔒 Request to Join' : '+ Join Group'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
