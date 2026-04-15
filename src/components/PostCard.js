'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { timeAgo } from '@/lib/utils';

export default function PostCard({ post, index, onLike, onSave }) {
  const router = useRouter();
  const { user } = useAuth();
  const isLiked = post.likes?.includes(user?._id);
  const isSaved = post.saves?.includes(user?._id);

  return (
    <div className="glass rounded-2xl p-4 mb-4 border border-nx-border/60 animate-fade-up" style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-nx-purple/20 flex items-center justify-center text-nx-purpleLight font-bold text-xs flex-shrink-0 cursor-pointer" onClick={() => router.push(`/profile/${post.author?._id}`)}>
          {post.author?.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm cursor-pointer hover:text-nx-purpleLight" onClick={() => router.push(`/profile/${post.author?._id}`)}>{post.author?.fullName}</span>
            <span className="text-xs text-nx-textMuted">@{post.author?.username}</span>
            {post.author?.isFounder && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-nx-orange/15 text-nx-orange">FOUNDER</span>}
          </div>
          <p className="text-[11px] text-nx-textMuted">{timeAgo(post.createdAt)}</p>
        </div>
      </div>
      {post.title && <h3 className="font-display font-bold text-lg mb-2">{post.title}</h3>}
      <p className="text-[15px] leading-relaxed text-nx-textSec mb-3">{post.content}</p>
      {post.image && <img src={post.image} alt="post" className="w-full h-48 object-cover rounded-xl mb-3" />}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map(t => (
            <button key={t} onClick={() => router.push(`/explore?tag=${t}`)} className={`tag-pill ${t === 'buildinpublic' ? 'bip' : ''} !text-[11px]`}>#{t}</button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-nx-textMuted pt-3 border-t border-nx-border/40">
        <button onClick={() => onLike(post._id)} className={`flex items-center gap-1.5 cursor-pointer transition-colors ${isLiked ? 'text-nx-pink' : 'hover:text-nx-pink'}`}>
          <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`} /> {post.likes?.length || 0}
        </button>
        <button onClick={() => router.push(`/home`)} className="flex items-center gap-1.5 cursor-pointer hover:text-nx-purpleLight transition-colors">
          <i className="fa-regular fa-comment" /> {post.comments?.length || 0}
        </button>
        <button onClick={() => onSave(post._id)} className={`flex items-center gap-1.5 cursor-pointer transition-colors ${isSaved ? 'text-nx-orange' : 'hover:text-nx-orange'}`}>
          <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`} /> {post.saves?.length || 0}
        </button>
      </div>
    </div>
  );
}
