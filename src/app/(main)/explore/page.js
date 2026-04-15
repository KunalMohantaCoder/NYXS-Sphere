'use client'
import { useState, useEffect, useCallback } from 'react';
import { postApi, userApi } from '@/lib/api';
import { showToast } from '@/lib/utils';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const TAGS = ['buildinpublic','startup','coding','ideas','design','ml','collaborate','growth','devops','product','open-source','ux'];

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchExplore = useCallback(async () => {
    setLoading(true);
    try {
      const params = tagFilter ? `tag=${tagFilter}` : (search ? `search=${search}` : '');
      const [postData, userData] = await Promise.all([
        postApi.feed(params),
        userApi.suggestions()
      ]);
      setPosts(postData.posts);
      setUsers(userData);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  }, [tagFilter, search]);

  useEffect(() => { fetchExplore(); }, [fetchExplore]);

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

  const handleFollow = async (userId) => {
    try {
      const data = await userApi.follow(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      showToast(data.following ? 'Following!' : 'Unfollowed', data.following ? 'success' : 'info');
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-[28px] font-black tracking-tight mb-1">Explore</h1>
      <p className="text-nx-textMuted text-sm mb-6">Discover ideas, people, and trends</p>

      <div className="relative mb-7">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-nx-textMuted text-base" />
        <input className="input-field pl-12 py-4 text-[15px]" placeholder="Search posts, people, or tags..." value={search} onChange={e => { setSearch(e.target.value); setTagFilter(''); }} />
      </div>

      <div className="mb-7">
        <h3 className="font-display text-base font-bold mb-3.5">Trending Topics</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TAGS.map(t => (
            <button key={t} onClick={() => { setTagFilter(t); setSearch(''); }}
              className={`tag-pill ${t === 'buildinpublic' ? 'bip' : ''} whitespace-nowrap flex-shrink-0 ${tagFilter === t ? '!bg-nx-purple/25 !text-white' : ''}`}>
              #{t}
            </button>
          ))}
        </div>
      </div>

      {tagFilter && (
        <div className="flex items-center gap-3 mb-5">
          <button className="btn-ghost !py-1.5 !px-3.5 text-xs" onClick={() => setTagFilter('')}><i className="fa-solid fa-arrow-left mr-1.5" /> Back</button>
          <span className="font-bold text-nx-purpleLight text-sm">#{tagFilter}</span>
          <span className="text-nx-textMuted text-xs">{posts.length} posts</span>
        </div>
      )}

      {!tagFilter && !search && users.length > 0 && (
        <div className="mb-7">
          <h3 className="font-display text-base font-bold mb-3.5">Suggested People</h3>
          <div className="space-y-2">
            {users.map(u => (
              <div key={u._id} className="flex items-center gap-3 p-3 bg-nx-card rounded-xl border border-nx-border cursor-pointer hover:border-nx-borderLight transition-colors">
                <div className="w-10 h-10 rounded-xl bg-nx-purple/20 flex items-center justify-center text-nx-purpleLight font-bold text-xs flex-shrink-0 cursor-pointer" onClick={() => router.push(`/profile/${u._id}`)}>
                  {u.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => router.push(`/profile/${u._id}`)}>
                  <p className="font-semibold text-sm truncate">{u.fullName}</p>
                  <p className="text-xs text-nx-textMuted">@{u.username}</p>
                </div>
                <button className="follow-btn not-following !text-xs !px-3.5 !py-1.5" onClick={() => handleFollow(u._id)}>Follow</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="font-display text-base font-bold mb-3.5">{tagFilter || search ? 'Results' : 'Top Posts'}</h3>
      {loading ? (
        <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-64 rounded-2xl bg-nx-card border border-nx-border animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <p className="text-nx-textMuted text-center py-12 text-sm">No posts found.</p>
      ) : (
        posts.map((post, i) => <PostCard key={post._id} post={post} index={i} onLike={handleLike} onSave={handleSave} />)
      )}
    </div>
  );
}