import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { useUI }     from '../context/UIContext';
import {
  SpeakerWaveIcon, UsersIcon, LockClosedIcon,
  PlayIcon, PlusIcon, StarIcon,
} from '@heroicons/react/24/outline';
import { formatCount } from '../utils/formatters';
import { SectionHeader, FilterChips, TagList, EmptyState } from '../components/ui/UIComponents';

const CATEGORY_FILTERS = [
  { value: 'all', label: 'All Rooms' },
  { value: 'Technology', label: '💻 Tech' },
  { value: 'Business',   label: '💼 Business' },
  { value: 'Design',     label: '🎨 Design' },
  { value: 'Finance',    label: '📈 Finance' },
];

export default function RoomsPage() {
  const { rooms, joinedRooms, joinRoom, leaveRoom } = useSocial();
  const { openModal } = useUI();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? rooms : rooms.filter(r => r.category === filter);
  const liveRooms   = filtered.filter(r => r.isLive);
  const upcomingRooms = filtered.filter(r => !r.isLive);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader
        title="Rooms & Live"
        subtitle="Join live conversations or create your own room"
        action={
          <button className="btn btn-primary" onClick={() => openModal('createRoom')}>
            <PlusIcon style={{ width: 15, height: 15 }} /> Create Room
          </button>
        }
      />

      <FilterChips options={CATEGORY_FILTERS} value={filter} onChange={setFilter} />

      {/* Live Now */}
      {liveRooms.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className="live-badge"><div className="live-dot" />LIVE NOW</div>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{liveRooms.length} room{liveRooms.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {liveRooms.map((room, i) => (
              <RoomCard key={room.id} room={room} joined={joinedRooms.has(room.id)} onJoin={() => joinRoom(room.id)} onLeave={() => leaveRoom(room.id)} delay={i * 60} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingRooms.length > 0 && (
        <section>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>
            Scheduled
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcomingRooms.map((room, i) => (
              <RoomCard key={room.id} room={room} joined={joinedRooms.has(room.id)} onJoin={() => joinRoom(room.id)} onLeave={() => leaveRoom(room.id)} delay={i * 60} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <EmptyState icon="🎙️" title="No rooms found" description="Create the first room in this category!" action={<button className="btn btn-primary" onClick={() => openModal('createRoom')}>Create Room</button>} />
      )}
    </div>
  );
}

function RoomCard({ room, joined, onJoin, onLeave, delay }) {
  const pct = Math.round((room.participants / room.maxParticipants) * 100);

  return (
    <div className="card animate-fade-up" style={{ padding: 20, animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Color indicator */}
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)', flexShrink: 0,
          background: `linear-gradient(135deg, ${gradientColors(room.color)[0]}, ${gradientColors(room.color)[1]})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SpeakerWaveIcon style={{ width: 22, height: 22, color: '#fff' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{room.name}</h3>
                {room.isPremium && <span className="badge badge-gold">💰 Premium</span>}
                {room.isLive && <div className="live-badge"><div className="live-dot" />Live</div>}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{room.description}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              <UsersIcon style={{ width: 13, height: 13 }} />
              {room.isLive ? `${formatCount(room.participants)} live` : `${formatCount(room.memberCount)} members`}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {room.host.name}</span>
            <TagList tags={room.tags} max={2} />
          </div>

          {/* Progress bar (capacity) */}
          {room.isLive && (
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 3, background: 'var(--bg-overlay)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? 'var(--red)' : 'var(--green)', borderRadius: 99, transition: 'width 0.5s' }} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{room.participants}/{room.maxParticipants} capacity</p>
            </div>
          )}

          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            {joined ? (
              <>
                <button className="btn btn-accent btn-sm" style={{ gap: 5 }}>
                  <PlayIcon style={{ width: 13, height: 13 }} /> Join Room
                </button>
                <button className="btn btn-danger btn-sm" onClick={onLeave}>Leave</button>
              </>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={onJoin} style={{ gap: 5 }}>
                <PlusIcon style={{ width: 13, height: 13 }} /> Join Room
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Convert tailwind class names to rough hex colors for inline use
function gradientColors(cls) {
  if (!cls) return ['#6366f1', '#8b5cf6'];
  if (cls.includes('cyan'))   return ['#06b6d4', '#0d9488'];
  if (cls.includes('amber'))  return ['#f59e0b', '#ea580c'];
  if (cls.includes('pink'))   return ['#ec4899', '#e11d48'];
  if (cls.includes('green'))  return ['#22c55e', '#059669'];
  return ['#4f46e5', '#7c3aed'];
}
