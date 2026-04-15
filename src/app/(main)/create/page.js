'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { postApi, uploadApi } from '@/lib/api';
import { showToast } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const AVAILABLE_TAGS = ['startup','ideas','coding','design','ml','buildinpublic','collaborate','growth','devops','product','open-source','ux','creativity','research'];

export default function CreatePage() {
  const [type, setType] = useState('blog');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState([]);
  const [bip, setBip] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();
  const { refresh } = useAuth();
  const router = useRouter();

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadApi(file);
      setImage(data.url);
      showToast('Image uploaded');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) { showToast('Write some content', 'error'); return; }
    if (type === 'blog' && !title) { showToast('Blog posts need a title', 'error'); return; }
    setSubmitting(true);
    try {
      const finalTags = [...tags];
      if (bip && !finalTags.includes('buildinpublic')) finalTags.push('buildinpublic');
      await postApi.create({ title: type === 'blog' ? title : '', content, image, tags: finalTags, type });
      showToast('Post published!');
      router.push('/home');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <h1 className="font-display text-[28px] font-black tracking-tight mb-1">Create Post</h1>
      <p className="text-nx-textMuted text-sm mb-7">Share your ideas with the Sphere community</p>

      <div className="flex gap-3 mb-6">
        {['blog', 'quick'].map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`flex-1 p-3.5 rounded-2xl border-2 cursor-pointer text-center transition-all font-body ${type === t ? 'border-nx-purple bg-nx-purple/8' : 'border-nx-border bg-nx-card'}`}>
            <i className={`fa-solid ${t === 'blog' ? 'fa-file-lines' : 'fa-bolt'} text-xl block mb-1.5 ${type === t ? 'text-nx-purple' : 'text-nx-textMuted'}`} />
            <span className={`font-semibold text-sm ${type === t ? 'text-nx-text' : 'text-nx-textSec'}`}>{t === 'blog' ? 'Blog Post' : 'Quick Post'}</span>
            <p className="text-[11px] text-nx-textMuted mt-0.5">{t === 'blog' ? 'Long-form with title' : 'Short thought or idea'}</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-nx-card rounded-2xl p-6 border border-nx-border">
        {type === 'blog' && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-nx-textSec mb-1.5">Title</label>
            <input className="input-field !text-base !font-semibold" placeholder="Give your post a compelling title..." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-nx-textSec mb-1.5">Content</label>
          <textarea className="input-field !leading-relaxed" rows={8} placeholder="Write your thoughts, ideas, or insights..." value={content} onChange={e => setContent(e.target.value)} style={{ resize: 'vertical' }} />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-nx-textSec mb-1.5">Image</label>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleImage} className="hidden" />
          <div className="flex gap-3">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost !py-2.5 !text-xs"><i className="fa-solid fa-image mr-2" /> Choose File</button>
            {image && <span className="text-xs text-nx-textMuted self-center">Image selected</span>}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-xs font-semibold text-nx-textSec mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map(t => (
              <button type="button" key={t} onClick={() => toggleTag(t)}
                className={`tag-pill ${t === 'buildinpublic' ? 'bip' : ''} ${tags.includes(t) ? '!bg-nx-purple/30 !text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]' : ''}`}>
                #{t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between p-3.5 bg-nx-surface rounded-xl border border-nx-border mb-5">
          <div className="flex items-center gap-2.5">
            <i className="fa-solid fa-fire text-nx-orange" />
            <div><p className="font-semibold text-sm">Build in Public</p><p className="text-xs text-nx-textMuted">Tag as part of your building journey</p></div>
          </div>
          <button type="button" onClick={() => setBip(!bip)} className={`w-11 h-6 rounded-full relative transition-colors ${bip ? 'bg-nx-purple' : 'bg-nx-border'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform block ${bip ? 'translate-x-5' : ''}`} />
          </button>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full !py-3.5 !text-[15px] disabled:opacity-50">
          <i className="fa-solid fa-paper-plane mr-2" /> {submitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}