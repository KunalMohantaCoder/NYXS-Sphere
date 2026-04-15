'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { href: '/home', icon: 'fa-house', label: 'Home Feed' },
  { href: '/explore', icon: 'fa-compass', label: 'Explore' },
  { href: '/create', icon: 'fa-pen-to-square', label: 'Create Post' },
  { href: '/messages', icon: 'fa-message', label: 'Messages' },
  { href: '/notifications', icon: 'fa-bell', label: 'Notifications' },
  { href: `/profile/${null}`, icon: 'fa-user', label: 'Profile', dynamic: true },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] bg-nx-bg border-r border-nx-border flex-col z-50 overflow-y-auto p-6">
      <Link href="/home" className="flex items-center gap-3 px-2 mb-8">
        <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: 'radial-gradient(circle at 32% 28%, #c084fc, #7c3aed 45%, #581c87 75%, #1e0a3c)', boxShadow: '0 0 24px rgba(124,58,237,0.4)', animation: 'spherePulse 4s ease-in-out infinite' }} />
        <span className="font-display text-xl font-extrabold gradient-text tracking-tight">NYXS Sphere</span>
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(item => {
          const href = item.dynamic ? `/profile/${user._id}` : item.href;
          const active = pathname === href || (item.dynamic && pathname.startsWith('/profile'));
          return (
            <Link key={item.href} href={href} className={`flex items-center gap-3.5 py-3 px-4 rounded-xl transition-all text-[15px] font-medium no-underline relative ${active ? 'text-nx-text bg-nx-purple/12' : 'text-nx-textMuted hover:text-nx-textSec hover:bg-nx-purple/5'}`}>
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-sm" style={{ background: 'var(--gradient-brand)' }} />}
              <i className={`fa-solid ${item.icon} w-[22px] text-center text-lg`} />
              {item.label}
            </Link>
          );
        })}
        <div className="mt-4 px-2"><div className="h-px bg-nx-border mb-4" /><p className="text-[11px] font-bold text-nx-textMuted uppercase tracking-widest mb-2.5">Founder Tools</p></div>
        <Link href="/explore" onClick={() => setTimeout(() => { const btn = document.querySelector('[data-tag="buildinpublic"]'); btn?.click(); }, 100)} className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-nx-textMuted hover:text-nx-textSec hover:bg-nx-purple/5 transition-all no-underline text-[15px] font-medium">
          <i className="fa-solid fa-rocket w-[22px] text-center text-lg text-nx-orange" /> Build in Public
        </Link>
        <Link href="/explore" onClick={() => setTimeout(() => { const btn = document.querySelector('[data-tag="collaborate"]'); btn?.click(); }, 100)} className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-nx-textMuted hover:text-nx-textSec hover:bg-nx-purple/5 transition-all no-underline text-[15px] font-medium">
          <i className="fa-solid fa-handshake w-[22px] text-center text-lg text-nx-pink" /> Find Collaborators
        </Link>
      </nav>
      <div className="pt-3 px-2 border-t border-nx-border mt-3">
        <Link href={`/profile/${user._id}`} className="flex items-center gap-2.5 py-2.5 cursor-pointer no-underline">
          <div className="w-9 h-9 rounded-xl bg-nx-purple/20 flex items-center justify-center text-nx-purpleLight font-bold text-xs flex-shrink-0">{user.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
          <div className="min-w-0"><p className="font-semibold text-sm truncate">{user.fullName}</p><p className="text-xs text-nx-textMuted">@{user.username}</p></div>
        </Link>
        <button onClick={logout} className="flex items-center gap-2.5 py-2.5 px-2 rounded-lg border-none bg-transparent text-nx-textMuted cursor-pointer font-body text-[13px] w-full transition-all hover:text-red-300 hover:bg-red-500/5 mt-0.5">
          <i className="fa-solid fa-right-from-bracket w-[22px] text-center" /> Sign Out
        </button>
      </div>
    </aside>
  );
}