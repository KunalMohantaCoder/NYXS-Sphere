'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { href: '/home', icon: 'fa-house', label: 'Home' },
  { href: '/explore', icon: 'fa-compass', label: 'Explore' },
  { href: '/create', icon: 'fa-plus', label: 'Create', special: true },
  { href: '/messages', icon: 'fa-message', label: 'Chat' },
  { href: '/profile', icon: 'fa-user', label: 'Profile', dynamic: true },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-nx-bg border-t border-nx-border flex items-center justify-around z-50">
      {NAV.map(item => {
        const href = item.dynamic ? `/profile/${user?._id}` : item.href;
        const active = pathname === href || (item.dynamic && pathname.startsWith('/profile'));
        return (
          <Link key={item.href} href={href} className={`flex flex-col items-center gap-1 py-3.5 px-4 text-center flex-1 transition-colors no-underline ${active ? 'text-nx-purple' : 'text-nx-textMuted'}`}>
            <i className={`fa-solid ${item.icon} text-xl`} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}