import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon, MagnifyingGlassIcon, UsersIcon, SpeakerWaveIcon,
  BellIcon, UserCircleIcon, Squares2X2Icon, CurrencyDollarIcon,
  ArrowRightOnRectangleIcon, XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid, BellIcon as BellSolid,
} from '@heroicons/react/24/solid';
import { useAuth }   from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { useUI }     from '../../context/UIContext';
import { formatCount } from '../../utils/formatters';

const NAV_LINKS = [
  { to: '/',            label: 'Feed',         Icon: HomeIcon,             ActiveIcon: HomeSolid },
  { to: '/explore',     label: 'Explore',      Icon: MagnifyingGlassIcon,  ActiveIcon: MagnifyingGlassIcon },
  { to: '/rooms',       label: 'Rooms',        Icon: SpeakerWaveIcon,      ActiveIcon: SpeakerWaveIcon },
  { to: '/groups',      label: 'Groups',       Icon: UsersIcon,            ActiveIcon: UsersIcon },
  { to: '/channels',    label: 'Channels',     Icon: CurrencyDollarIcon,   ActiveIcon: CurrencyDollarIcon },
  { to: '/notifications', label: 'Notifications', Icon: BellIcon,          ActiveIcon: BellSolid, badge: true },
  { to: '/profile',     label: 'My Profile',   Icon: UserCircleIcon,       ActiveIcon: UserCircleIcon },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { unreadCount }         = useSocial();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)', zIndex: 40,
            display: 'none',
          }}
          className="mobile-backdrop"
        />
      )}

      <aside style={{
        width: 240,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        overflowY: 'auto',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: '#fff',
              fontFamily: 'var(--font-display)',
              boxShadow: 'var(--shadow-glow-primary)',
            }}>N</div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
              background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Nextcord</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '12px 12px' }}>
          {NAV_LINKS.map(({ to, label, Icon, ActiveIcon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  marginBottom: 2,
                  background: isActive ? 'var(--primary-dim)' : 'transparent',
                  color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
                  transition: 'all 0.18s',
                  cursor: 'pointer',
                  position: 'relative',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                }}>
                  {isActive
                    ? <ActiveIcon style={{ width: 20, height: 20, flexShrink: 0 }} />
                    : <Icon style={{ width: 20, height: 20, flexShrink: 0 }} />
                  }
                  {label}
                  {badge && unreadCount > 0 && (
                    <span className="notif-count" style={{ marginLeft: 'auto' }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        {currentUser ? (
          <div style={{ padding: '12px 16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={currentUser.image}
                alt={currentUser.firstName}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                className="avatar-ring-primary"
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{currentUser.username}</p>
              </div>
              <button
                className="btn btn-ghost btn-icon"
                onClick={logout}
                title="Sign out"
                style={{ padding: '6px', opacity: 0.7 }}
              >
                <ArrowRightOnRectangleIcon style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        ) : (
          /* Guest footer — prompt to join */
          <div style={{ padding: '12px 16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textAlign: 'center' }}>
              Join to unlock all features
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: 8, fontSize: 13 }}
              onClick={() => navigate('/login?tab=register')}
            >
              Sign Up Free
            </button>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: 13 }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
