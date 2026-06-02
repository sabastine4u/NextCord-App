import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  MOCK_POSTS, MOCK_ROOMS, MOCK_GROUPS,
  MOCK_CHANNELS, INITIAL_NOTIFICATIONS
} from '../data/mockData';

const SocialContext = createContext(null);

export function SocialProvider({ children }) {
  // ── Users ───────────────────────────────────────────────────────────────────
  const [users, setUsers]       = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res  = await fetch('https://dummyjson.com/users?limit=100&skip=0');
        const data = await res.json();
        // Enrich each user with social fields
        const enriched = data.users.map(u => ({
          ...u,
          occupation: u.company?.title || 'Professional',
          interests: pickInterests(u.id),
          bio: `${u.company?.title || 'Professional'} at ${u.company?.name || 'Independent'}. Based in ${u.address?.city}.`,
          followers: Math.floor(Math.random() * 10000) + 100,
          following: Math.floor(Math.random() * 500) + 50,
          posts: Math.floor(Math.random() * 200) + 5,
          isVerified: u.id % 7 === 0,
        }));
        setUsers(enriched);
      } catch (e) {
        console.error(e);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ── Follows ─────────────────────────────────────────────────────────────────
  const [following, setFollowing] = useState(new Set([1, 3, 5, 8])); // ids

  const toggleFollow = useCallback((userId) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
        addNotification({ type: 'system', message: `Unfollowed user` });
      } else {
        next.add(userId);
        addNotification({ type: 'follow', message: `You followed someone new` });
      }
      return next;
    });
  }, []);

  // ── Likes ───────────────────────────────────────────────────────────────────
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likedUsers, setLikedUsers] = useState(new Set());

  const togglePostLike = useCallback((postId) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  }, []);

  const toggleUserLike = useCallback((userId) => {
    setLikedUsers(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }, []);

  // ── Posts ───────────────────────────────────────────────────────────────────
  const [posts, setPosts] = useState(MOCK_POSTS);

  const addPost = useCallback((content, tags = []) => {
    const newPost = {
      id: `post-${Date.now()}`,
      authorId: 999,
      author: {
        name: 'You',
        username: 'current_user',
        avatar: 'https://dummyjson.com/image/avatar/0',
        verified: true,
      },
      content,
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date(),
      tags,
    };
    setPosts(prev => [newPost, ...prev]);
  }, []);

  // ── Rooms ───────────────────────────────────────────────────────────────────
  const [rooms, setRooms]         = useState(MOCK_ROOMS);
  const [joinedRooms, setJoined]  = useState(new Set(['room-1', 'room-3']));

  const createRoom = useCallback((roomData) => {
    const newRoom = {
      id: `room-${Date.now()}`,
      ...roomData,
      host: { name: 'You', username: 'current_user', avatar: 'https://dummyjson.com/image/avatar/0' },
      participants: 1,
      isLive: false,
      memberCount: 1,
    };
    setRooms(prev => [newRoom, ...prev]);
    setJoined(prev => new Set([...prev, newRoom.id]));
    addNotification({ type: 'system', message: `Room "${newRoom.name}" created!` });
  }, []);

  const joinRoom = useCallback((roomId) => {
    setJoined(prev => new Set([...prev, roomId]));
    addNotification({ type: 'join', message: 'You joined a new room' });
  }, []);

  const leaveRoom = useCallback((roomId) => {
    setJoined(prev => { const n = new Set(prev); n.delete(roomId); return n; });
  }, []);

  // ── Groups ──────────────────────────────────────────────────────────────────
  const [groups, setGroups]           = useState(MOCK_GROUPS);
  const [joinedGroups, setJoinedGroups] = useState(new Set(['group-1', 'group-2']));

  const createGroup = useCallback((groupData) => {
    const newGroup = {
      id: `group-${Date.now()}`,
      ...groupData,
      members: 1,
      postsToday: 0,
      role: 'admin',
    };
    setGroups(prev => [newGroup, ...prev]);
    setJoinedGroups(prev => new Set([...prev, newGroup.id]));
    addNotification({ type: 'system', message: `Group "${newGroup.name}" created!` });
  }, []);

  const joinGroup = useCallback((groupId) => {
    setJoinedGroups(prev => new Set([...prev, groupId]));
  }, []);

  const leaveGroup = useCallback((groupId) => {
    setJoinedGroups(prev => { const n = new Set(prev); n.delete(groupId); return n; });
  }, []);

  // ── Channels ─────────────────────────────────────────────────────────────────
  const [channels, setChannels]               = useState(MOCK_CHANNELS);
  const [subscribedChannels, setSubscribed]   = useState(new Set());

  const subscribeChannel = useCallback((channelId) => {
    setSubscribed(prev => new Set([...prev, channelId]));
    addNotification({ type: 'premium', message: 'Channel subscription activated!' });
  }, []);

  const unsubscribeChannel = useCallback((channelId) => {
    setSubscribed(prev => { const n = new Set(prev); n.delete(channelId); return n; });
  }, []);

  // ── Notifications ─────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: `n-${Date.now()}`,
      read: false,
      time: new Date(),
      actor: { name: 'System', avatar: null },
      ...notif,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Invites ──────────────────────────────────────────────────────────────────
  const sendInvite = useCallback((targetUserId, resourceId, resourceType) => {
    addNotification({
      type: 'invite',
      actor: { name: 'You', avatar: 'https://dummyjson.com/image/avatar/0' },
      message: `Invite sent for ${resourceType}`,
    });
  }, [addNotification]);

  return (
    <SocialContext.Provider value={{
      // Users
      users, usersLoading,
      // Follows
      following, toggleFollow,
      // Likes
      likedPosts, likedUsers, togglePostLike, toggleUserLike,
      // Posts
      posts, addPost,
      // Rooms
      rooms, joinedRooms, createRoom, joinRoom, leaveRoom,
      // Groups
      groups, joinedGroups, createGroup, joinGroup, leaveGroup,
      // Channels
      channels, subscribedChannels, subscribeChannel, unsubscribeChannel,
      // Notifications
      notifications, unreadCount, addNotification, markAllRead, markRead,
      // Invites
      sendInvite,
    }}>
      {children}
    </SocialContext.Provider>
  );
}

export const useSocial = () => {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error('useSocial must be used within SocialProvider');
  return ctx;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const INTEREST_POOL = [
  'Technology', 'Design', 'AI/ML', 'Startups', 'Finance', 'Health',
  'Music', 'Gaming', 'Sports', 'Open Source', 'Blockchain', 'Marketing', 'Education',
];
function pickInterests(seed) {
  const count = (seed % 3) + 2;
  const start = seed % INTEREST_POOL.length;
  return Array.from({ length: count }, (_, i) => INTEREST_POOL[(start + i) % INTEREST_POOL.length]);
}
