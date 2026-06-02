import { useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth }   from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { useUI }     from '../../context/UIContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';


const PAGE_TITLES = {
  '/':             'Feed',
  '/explore':      'Explore People',
  '/rooms':        'Rooms & Live',
  '/groups':       'Groups',
  '/channels':     'Premium Channels',
  '/notifications':'Notifications',
  '/profile':      'My Profile',
};

const CREATE_MAP = {
  '/rooms':   'createRoom',
  '/groups':  'createGroup',
  '/channels': null,
};

export default function Topbar() {
  const { currentUser }  = useAuth();
  const { unreadCount }  = useSocial();
  const { toggleSidebar, openModal } = useUI();
  const guard = useAuthGuard();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const title      = PAGE_TITLES[pathname] || 'Nextcord';
  const createModal = CREATE_MAP[pathname];

  return (
    <header style={{
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      gap: 12,
    }}>
      {/* Left: hamburger + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleSidebar}
          style={{ display: 'none' }} // visible via media query in layout
          aria-label="Open menu"
        >
          <Bars3Icon style={{ width: 22, height: 22 }} />
        </button>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>{title}</h1>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {createModal && (
          <button
            className="btn btn-primary btn-sm"
            onClick={guard(() => openModal(createModal), createModal === 'createRoom' ? 'create rooms' : 'create groups')}
            style={{ gap: 5 }}
          >
            <PlusIcon style={{ width: 14, height: 14 }} />
            Create
          </button>
        )}
        {pathname === '/' && (
          <button className="btn btn-primary btn-sm" onClick={guard(() => openModal('post'), 'create posts')}>
            <PlusIcon style={{ width: 14, height: 14 }} />
            Post
          </button>
        )}

        <button
          className="btn btn-ghost btn-icon"
          onClick={() => navigate('/notifications')}
          style={{ position: 'relative' }}
          aria-label="Notifications"
        >
          <BellIcon style={{ width: 22, height: 22 }} />
          {unreadCount > 0 && (
            <span className="notif-count" style={{
              position: 'absolute', top: 2, right: 2,
              minWidth: 16, height: 16, fontSize: 9, padding: '0 4px',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {currentUser ? (
          <button
            onClick={() => navigate('/profile')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
          >
            <img
              src={currentUser.image}
              alt={currentUser.firstName}
              style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              className="avatar-ring-primary"
            />
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')} style={{ fontSize: 13 }}>
              Sign In
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login?tab=register')} style={{ fontSize: 13 }}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
