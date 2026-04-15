'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { postApi } from '@/lib/api';
import { showToast } from '@/lib/utils';
import PostCard from '@/components/PostCard';

const FILTERS = [
  { key: 'all', label: 'All Posts' },
  { key: 'following', label: 'Following' },
  { key: 'buildinpublic', label: 'Build in Public', bip: true },
  { key: 'collaborate', label: 'Collaborate' },
];

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `filter=${filter}` : '';
      const data = await postApi.feed(params);
      setPosts(data.posts);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleLike = async (postId) => {
    try {
      const data = await postApi.like(postId);
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: data.liked ? [...p.likes, user._id] : p.likes.filter(id => id !== user._id) } : p));
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleSave = async (postId) => {
    try {
      const data = await postApi.save(postId);
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, saves: data.saved ? [...p.saves, user._id] : p.saves.filter(id => id !== user._id) } : p));
      showToast(data.saved ? 'Post saved' : 'Removed from saved', data.saved ? 'success' : 'info');
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <div className="animate-fade-up">
      {/* Composer */}
      <div className="glass rounded-2xl p-4 mb-6 border border-nx-border/60 cursor-pointer" onClick={() => router.push('/create')}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-nx-purple/20 flex items-center justify-center text-nx-purpleLight font-bold text-sm flex-shrink-0">
            {user?.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 bg-nx-surface rounded-xl px-4 py-3 text-nx-textMuted text-sm border border-nx-border">
            Share an idea, write a blog, or post a quick thought...
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`tag-pill ${f.bip ? 'bip' : ''} ${filter === f.key ? '!bg-nx-purple/25 !text-white' : ''}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-64 rounded-2xl bg-nx-card border border-nx-border animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <i className="fa-solid fa-seedling text-5xl text-nx-textMuted mb-4 block" />
          <h3 className="font-display text-xl font-bold mb-2">Your feed is empty</h3>
          <p className="text-nx-textMuted text-sm mb-5">Follow people or explore tags to see posts here.</p>
          <button className="btn-primary" onClick={() => router.push('/explore')}>Explore Sphere</button>
        </div>
      ) : (
        posts.map((post, i) => (
          <PostCard key={post._id} post={post} index={i} onLike={handleLike} onSave={handleSave} />
        ))
      )}
    </div>
  );
}