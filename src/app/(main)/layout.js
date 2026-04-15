'use client'

import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import MobileNav from '@/components/MobileNav';

export default function MainLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full" style={{ background: 'radial-gradient(circle at 32% 28%, #c084fc, #7c3aed 45%, #581c87)', animation: 'spherePulse 2s ease-in-out infinite' }} />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      <main className="lg:ml-[260px] lg:mr-[320px] min-h-screen p-5 pb-24 lg:pb-5">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-40 bg-nx-bg/85 backdrop-blur-xl py-3.5 -mx-5 px-5 mb-5 border-b border-nx-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: 'radial-gradient(circle at 32% 28%, #c084fc, #7c3aed 45%, #581c87)' }} />
            <span className="font-display text-lg font-extrabold gradient-text">NYXS Sphere</span>
          </div>
        </div>
        {children}
      </main>
      <RightSidebar />
      <MobileNav />
    </div>
  );
}