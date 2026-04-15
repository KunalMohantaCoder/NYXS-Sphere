'use client';
import { useState, useEffect, useCallback } from 'react';
import { userApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

const TAGS = ['buildinpublic','startup','coding','ideas','design','ml','collaborate','growth','devops','product'];
const INTERESTS = [
  { name: 'Startup Life', icon: 'fa-rocket', color: '#F97316', tag: 'startup' },
  { name: 'Code & Build', icon: 'fa-code', color: '#7C3AED', tag: 'coding' },
  { name: 'Design & UX', icon: 'fa-palette', color: '#EC4899', tag: 'design' },
  { name: 'AI & Research', icon: 'fa-brain', color: '#06B6D4', tag: 'ml' },
];

export default function RightSidebar() {
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  const fetchSuggestions = useCallback(async () => {
    try { setSuggestions(await userApi.suggestions()); } catch {}
  }, []);

  useEffect(() => { fetchSuggestions(); }, [fetchSuggestions]);

  const handleFollow = async (userId) => {
    try {
      await userApi.follow(userId);
      setSuggestions(prev => prev.filter(u => u._id !== userId));
    } catch {}
  };

  return (
    <aside className="hidden lg:flex fixed right-0 top-0 bottom-0 w-[320px] bg-nx-bg border-l border-nx-border flex-col z-50 overflow-y-auto p-5">
      <div className="mb-6">
        <h3 className="font-display text-base font-bold mb-4 text-nx-text">People to Follow</h3>
        <div className="flex flex-col gap-2.5">
          {suggestions.map(u => (
            <div key={u._id} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-nx-purple/20 flex items-center justify-center text-nx-purpleLight font-bold text-[11px] flex-shrink-0 cursor-pointer" onClick={() => router.push(`/profile/${u._id}`)}>
                {u.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => router.push(`/profile/${u._id}`)}>
                <p className="font-semibold text-[13px] truncate">{u.fullName}</p>
                <p className="text-[11px] text-nx-textMuted">@{u.username}</p>
              </div>
              <button onClick={() => handleFollow(u._id)} className="follow-btn not-following !text-[11px] !px-3 !py-1">Follow</button>
            </div>
          ))}
          {suggestions.length === 0 && <p className="text-xs text-nx-textMuted text-center py-3">No suggestions yet.</p>}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-display text-base font-bold mb-4 text-nx-text">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(t => (
            <button key={t} data-tag={t} onClick={() => router.push(`/explore?tag=${t}`)} className="tag-pill">#{t}</button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display text-base font-bold mb-4 text-nx-text">Explore Interests</h3>
        <div className="flex flex-col gap-2">
          {INTERESTS.map(m => (
            <div key={m.name} onClick={() => router.push(`/explore?tag=${m.tag}`)} className="flex items-center gap-3 p-3 bg-nx-card rounded-xl border border-nx-border cursor-pointer transition-colors hover:border-nx-borderLight">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}15` }}>
                <i className={`fa-solid ${m.icon}`} style={{ color: m.color, fontSize: '14px' }} />
              </div>
              <span className="font-semibold text-[13px]">{m.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}