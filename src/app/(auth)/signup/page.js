'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/lib/utils';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signup(form);
      showToast('Welcome to Sphere!');
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
      <p className="text-center text-nx-textMuted text-sm mb-8">Create your account</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
          { key: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username' },
          { key: 'email', label: 'Email', type: 'email', placeholder: 'you@university.edu' },
          { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', min: 6 },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-nx-textSec mb-1.5">{f.label}</label>
            <input type={f.type} className="input-field" placeholder={f.placeholder} value={form[f.key]} onChange={e => update(f.key, e.target.value)} required minLength={f.min} />
          </div>
        ))}
        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 text-[15px] disabled:opacity-50">
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-nx-textMuted mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-nx-purpleLight font-semibold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}