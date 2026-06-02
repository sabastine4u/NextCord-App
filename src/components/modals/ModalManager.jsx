import  { useState } from 'react';
import { Modal, TagList, RatingStars } from '../ui/UIComponents';
import { useUI }     from '../../context/UIContext';
import LoginPromptModal from './LoginPromptModal';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { formatCount } from '../../utils/formatters';
import { LockClosedIcon, GlobeAltIcon, StarIcon, CheckIcon } from '@heroicons/react/24/outline';

// ── CreateRoomModal ────────────────────────────────────────────────────────────
export function CreateRoomModal() {
  const { activeModal, closeModal, promptLogin } = useUI();
  const { createRoom } = useSocial();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: '', description: '', category: 'Technology',
    maxParticipants: 200, isPremium: false, color: 'from-indigo-600 to-purple-700',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (!isAuthenticated) {
      closeModal();
      promptLogin('create rooms');
      return;
    }
    createRoom({ ...form, tags: [form.category] });
    closeModal();
    setForm({ name: '', description: '', category: 'Technology', maxParticipants: 200, isPremium: false, color: 'from-indigo-600 to-purple-700' });
  };

  return (
    <Modal isOpen={activeModal === 'createRoom'} onClose={closeModal} title="Create a Room">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Room Name *</label>
          <input className="input-base" placeholder="e.g. Weekly Tech Talk" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea className="input-base" rows={3} placeholder="What's this room about?" value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select className="input-base" value={form.category} onChange={e => set('category', e.target.value)}>
              {['Technology', 'Business', 'Design', 'Finance', 'Education', 'Entertainment'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Max Participants</label>
            <input className="input-base" type="number" min={10} max={5000} value={form.maxParticipants} onChange={e => set('maxParticipants', +e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Room Color</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {ROOM_COLORS.map(c => (
              <button key={c.value} onClick={() => set('color', c.value)} style={{
                width: 32, height: 32, borderRadius: 'var(--radius-sm)', border: form.color === c.value ? '2px solid white' : '2px solid transparent',
                background: c.preview, cursor: 'pointer', transition: 'border 0.15s',
              }} />
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.isPremium} onChange={e => set('isPremium', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--gold)' }} />
          <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>
            💰 Make this a <strong>premium room</strong> (paid access)
          </span>
        </label>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.name.trim()}>Create Room</button>
        </div>
      </div>
    </Modal>
  );
}

// ── CreateGroupModal ───────────────────────────────────────────────────────────
export function CreateGroupModal() {
  const { activeModal, closeModal, promptLogin } = useUI();
  const { createGroup } = useSocial();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: '', description: '', category: 'Technology', isPrivate: false, tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t) && form.tags.length < 5) {
      set('tags', [...form.tags, t]);
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (!isAuthenticated) {
      closeModal();
      promptLogin('create groups');
      return;
    }
    createGroup(form);
    closeModal();
    setForm({ name: '', description: '', category: 'Technology', isPrivate: false, tags: [] });
  };

  return (
    <Modal isOpen={activeModal === 'createGroup'} onClose={closeModal} title="Create a Group">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Group Name *</label>
          <input className="input-base" placeholder="e.g. React Developers NG" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea className="input-base" rows={3} placeholder="Describe your group's purpose..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select className="input-base" value={form.category} onChange={e => set('category', e.target.value)}>
            {['Technology', 'Business', 'Design', 'Finance', 'Education', 'Health', 'Entertainment'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Tags (up to 5)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input-base" placeholder="e.g. React" value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              style={{ flex: 1 }} />
            <button className="btn btn-secondary" onClick={addTag}>Add</button>
          </div>
          {form.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {form.tags.map(t => (
                <span key={t} className="badge badge-primary" style={{ cursor: 'pointer' }}
                  onClick={() => set('tags', form.tags.filter(x => x !== t))}>
                  #{t} ×
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {form.isPrivate ? <LockClosedIcon style={{ width: 18, height: 18, color: 'var(--gold)' }} /> : <GlobeAltIcon style={{ width: 18, height: 18, color: 'var(--green)' }} />}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{form.isPrivate ? 'Private Group' : 'Public Group'}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{form.isPrivate ? 'Invite only' : 'Anyone can join'}</p>
            </div>
          </div>
          <button
            onClick={() => set('isPrivate', !form.isPrivate)}
            style={{
              width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
              background: form.isPrivate ? 'var(--gold)' : 'var(--bg-hover)',
              position: 'relative', transition: 'background 0.2s',
            }}
          >
            <span style={{
              position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff',
              top: 3, transition: 'left 0.2s',
              left: form.isPrivate ? 23 : 3,
            }} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.name.trim()}>Create Group</button>
        </div>
      </div>
    </Modal>
  );
}

// ── SubscribeModal ─────────────────────────────────────────────────────────────
export function SubscribeModal() {
  const { activeModal, modalData, closeModal } = useUI();
  const { subscribeChannel, subscribedChannels } = useSocial();
  const [confirmed, setConfirmed] = useState(false);

  const channel = modalData;
  const isAlreadySub = channel && subscribedChannels.has(channel.id);

  const handleSubscribe = () => {
    subscribeChannel(channel.id);
    setConfirmed(true);
    setTimeout(() => { closeModal(); setConfirmed(false); }, 1800);
  };

  if (!channel) return null;

  return (
    <Modal isOpen={activeModal === 'subscribe'} onClose={closeModal} title="Subscribe to Channel">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {confirmed ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>
              Subscribed!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>You now have access to {channel.name}</p>
          </div>
        ) : (
          <>
            {/* Channel info */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <img src={channel.creator.avatar} alt={channel.creator.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{channel.name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>by {channel.creator.name}</p>
                <RatingStars rating={channel.rating} />
              </div>
            </div>

            {/* Price */}
            <div style={{
              background: 'var(--gold-dim)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 'var(--radius-md)', padding: '16px 20px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)' }} className="gradient-text-gold">
                ${channel.price}<span style={{ fontSize: 16, fontWeight: 400 }}>/{channel.period}</span>
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Cancel anytime</p>
            </div>

            {/* Perks */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>What's included:</p>
              {channel.perks.map(perk => (
                <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <CheckIcon style={{ width: 16, height: 16, color: 'var(--green)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{perk}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              {isAlreadySub ? (
                <button className="btn btn-secondary" disabled>Already Subscribed ✓</button>
              ) : (
                <button className="btn btn-gold" onClick={handleSubscribe}>
                  Subscribe · ${channel.price}/{channel.period}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// ── CreatePostModal ────────────────────────────────────────────────────────────
export function CreatePostModal() {
  const { activeModal, closeModal, promptLogin } = useUI();
  const { addPost } = useSocial();
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) { setTags(p => [...p, t]); setTagInput(''); }
  };

  const handlePost = () => {
    if (!content.trim()) return;
    if (!isAuthenticated) {
      closeModal();
      promptLogin('create posts');
      return;
    }
    addPost(content, tags);
    closeModal();
    setContent(''); setTags([]); setTagInput('');
  };

  const remaining = 280 - content.length;

  return (
    <Modal isOpen={activeModal === 'post'} onClose={closeModal} title="Create Post">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <textarea
          className="input-base"
          rows={5}
          placeholder="What's on your mind? Share with the community..."
          value={content}
          onChange={e => content.length < 281 && setContent(e.target.value)}
          style={{ resize: 'none', fontSize: 15, lineHeight: 1.6 }}
          autoFocus
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 12, color: remaining < 50 ? 'var(--red)' : 'var(--text-muted)' }}>
            {remaining} chars remaining
          </span>
        </div>
        <div>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input-base" placeholder="Add a tag..." value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()} style={{ flex: 1 }} />
            <button className="btn btn-secondary" onClick={addTag}>+</button>
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {tags.map(t => (
                <span key={t} className="badge badge-primary" style={{ cursor: 'pointer' }}
                  onClick={() => setTags(tags.filter(x => x !== t))}>#{t} ×</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={handlePost} disabled={!content.trim()}>Publish</button>
        </div>
      </div>
    </Modal>
  );
}

// ── ModalManager ───────────────────────────────────────────────────────────────
export default function ModalManager() {
  return (
    <>
      <CreateRoomModal />
      <CreateGroupModal />
      <SubscribeModal />
      <CreatePostModal />
      <LoginPromptModal />
    </>
  );
}

// Shared
const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
  marginBottom: 6, letterSpacing: '0.02em',
};

const ROOM_COLORS = [
  { value: 'from-indigo-600 to-purple-700', preview: 'linear-gradient(135deg,#4f46e5,#7c3aed)' },
  { value: 'from-cyan-500 to-teal-600',     preview: 'linear-gradient(135deg,#06b6d4,#0d9488)' },
  { value: 'from-amber-500 to-orange-600',  preview: 'linear-gradient(135deg,#f59e0b,#ea580c)' },
  { value: 'from-pink-500 to-rose-600',     preview: 'linear-gradient(135deg,#ec4899,#e11d48)' },
  { value: 'from-green-500 to-emerald-600', preview: 'linear-gradient(135deg,#22c55e,#059669)' },
];
