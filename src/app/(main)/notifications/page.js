'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { notifApi } from '@/lib/api';
import { timeAgo } from '@/lib/utils';

const ICONS = { like: 'fa-heart', comment: 'fa-comment', follow: 'fa-user-plus', save: 'fa-bookmark', message: 'fa-message' };
const COLORS = { like: '#EC4899', comment: '#A855F7', follow: '#7C3AED', save: '#F97316', message: '#06B6D4' };
const TEXTS = { like: 'liked your post', comment: 'commented on your post', follow: 'started following you', save: 'saved your post', message: 'sent you a message' };

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifs = useCallback(async () => {
    try {
      const data = await notifApi.list();
      setNotifs(data);
      await notifApi.readAll();
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  const handleClick = (n) => {
    if (n.type === 'message') router.push('/messages');
    else if (n.type === 'follow' && n.fromUser) router.push(`/profile/${n.fromUser._id}`);
    else if (n.post) router.push('/home');
    else if (n.fromUser) router.push(`/profile/${n.fromUser._id}`);
  };

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-nx-card border border-nx-border animate-pulse" />)}</div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <h1 className="font-display text-[28px] font-black tracking-tight mb-1">Notifications</h1>
      <p className="text-nx-textMuted text-sm mb-6">Stay updated on what matters</p>
      {notifs.length === 0 ? (
        <div className="text-center py-16">
          <i className="fa-solid fa-bell-slash text-5xl text-nx-textMuted mb-4 block" />
          <h3 className="font-display text-xl font-bold mb-2">All caught up</h3>
          <p className="text-nx-textMuted text-sm">No notifications right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {notifs.map((n, i) => (
            <div key={n._id} onClick={() => handleClick(n)} className="flex items-center gap-3 p-3.5 bg-nx-card rounded-2xl border border-nx-border cursor-pointer hover:border-nx-borderLight transition-colors animate-fade-up" style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${COLORS[n.type]}15` }}>
                <i className={`fa-solid ${ICONS[n.type]}`} style={{ color: COLORS[n.type], fontSize: '15px' }} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-nx-purple/20 flex items-center justify-center text-nx-purpleLight font-bold text-xs flex-shrink-0">
                {n.fromUser?.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug"><span className="font-bold">{n.fromUser?.fullName}</span> <span className="text-nx-textMuted">{TEXTS[n.type]}</span></p>
                <p className="text-xs text-nx-textMuted mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-nx-purple flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(124,58,237,0.6)' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}