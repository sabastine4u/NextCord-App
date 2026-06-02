import React from 'react';
import { useSocial } from '../context/SocialContext';
import { timeAgo } from '../utils/formatters';
import {
  HeartIcon, UserPlusIcon, ChatBubbleOvalLeftIcon,
  BellAlertIcon, UsersIcon, StarIcon, CheckIcon,
} from '@heroicons/react/24/outline';
import { SectionHeader } from '../components/ui/UIComponents';

const TYPE_CONFIG = {
  follow:  { Icon: UserPlusIcon,              color: 'var(--primary-light)', bg: 'var(--primary-dim)'  },
  like:    { Icon: HeartIcon,                 color: 'var(--red)',           bg: 'var(--red-dim)'      },
  comment: { Icon: ChatBubbleOvalLeftIcon,     color: 'var(--accent)',        bg: 'var(--accent-dim)'   },
  invite:  { Icon: UsersIcon,                 color: 'var(--gold)',          bg: 'var(--gold-dim)'     },
  join:    { Icon: UserPlusIcon,              color: 'var(--green)',         bg: 'var(--green-dim)'    },
  premium: { Icon: StarIcon,                  color: 'var(--gold)',          bg: 'var(--gold-dim)'     },
  system:  { Icon: BellAlertIcon,             color: 'var(--text-secondary)',bg: 'var(--bg-overlay)'   },
};


export default function NotificationsPage() {
  const { notifications, unreadCount, markAllRead, markRead } = useSocial();

  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n =>  n.read);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
        action={
          unreadCount > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead} style={{ gap: 5, color: 'var(--primary-light)' }}>
              <CheckIcon style={{ width: 13, height: 13 }} />
              Mark all read
            </button>
          )
        }
      />

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>No notifications yet.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>When someone follows, likes, or interacts with you, it'll show here.</p>
        </div>
      ) : (
        <>
          {unread.length > 0 && (
            <section>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                New
              </p>
              <div className="card" style={{ overflow: 'hidden' }}>
                {unread.map((notif, i) => (
                  <NotifItem
                    key={notif.id}
                    notif={notif}
                    onRead={() => markRead(notif.id)}
                    isLast={i === unread.length - 1}
                  />
                ))}
              </div>
            </section>
          )}

          {read.length > 0 && (
            <section>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Earlier
              </p>
              <div className="card" style={{ overflow: 'hidden' }}>
                {read.map((notif, i) => (
                  <NotifItem
                    key={notif.id}
                    notif={notif}
                    onRead={() => markRead(notif.id)}
                    isLast={i === read.length - 1}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function NotifItem({ notif, onRead, isLast }) {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
  const { Icon } = cfg;

  return (
    <div
      onClick={onRead}
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        padding: '14px 18px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        background: !notif.read ? 'rgba(99,102,241,0.04)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.15s',
        position: 'relative',
      }}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div style={{
          position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
          width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)',
        }} />
      )}

      {/* Icon or Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {notif.actor?.avatar && notif.actor.avatar !== null ? (
          <img src={notif.actor.avatar} alt={notif.actor.name}
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon style={{ width: 18, height: 18, color: cfg.color }} />
          </div>
        )}
        {/* Type icon badge */}
        {notif.actor?.avatar && notif.actor.avatar !== null && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 18, height: 18, borderRadius: '50%',
            background: cfg.bg, border: '2px solid var(--bg-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon style={{ width: 9, height: 9, color: cfg.color }} />
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>
          <strong style={{ fontWeight: 600 }}>{notif.actor?.name}</strong>{' '}
          <span style={{ color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            {notif.message}
          </span>
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{timeAgo(notif.time)}</p>
      </div>
    </div>
  );
}
