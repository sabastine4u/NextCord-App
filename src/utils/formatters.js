/**
 * Format large numbers: 1400 → 1.4K, 2100000 → 2.1M
 */
export function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * Relative time: "5 min ago", "2 hrs ago", "3 days ago"
 */
export function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get user's display name
 */
export function displayName(user) {
  if (!user) return 'Unknown';
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  return user.name || user.username || 'User';
}

/**
 * Generate avatar initials
 */
export function initials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

/**
 * Clamp text to N chars
 */
export function clamp(text, max = 120) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

