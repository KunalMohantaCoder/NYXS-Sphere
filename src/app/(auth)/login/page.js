'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/lib/utils';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email, password });
      showToast('Welcome back!');
      router.push('/home');
    } catch (err) {
      showToast(err.message, 'error');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="glass rounded-3xl p-10 max-w-md w-full animate-fade-up">
      <div className="flex items-center justify-center gap-3.5 mb-2">
        <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: 'radial-gradient(circle at 32% 28%, #c084fc, #7c3aed 45%, #581c87 75%, #1e0a3c)', boxShadow: '0 0 24px rgba(124,58,237,0.4)', animation: 'spherePulse 4s ease-in-out infinite' }} />
        <span className="font-display text-[28px] font-extrabold gradient-text tracking-tight">NYXS Sphere</span>
      </div>
      <p className="text-center text-nx-textMuted text-sm mb-8">Where students build the future</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-nx-textSec mb-1.5">Email</label>
          <input type="email" className="input-field" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-nx-textSec mb-1.5">Password</label>
          <input type="password" className="input-field" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 text-[15px] disabled:opacity-50">
          {submitting ? 'Signing in...' : 'Sign In to Sphere'}
        </button>
      </form>
      <p className="text-center text-sm text-nx-textMuted mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-nx-purpleLight font-semibold hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}