'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { messageApi, userApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { showToast, timeAgo } from '@/lib/utils';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function MessagesPage() {
  const { user: me } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatFromProfile = searchParams.get('chat');

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(chatFromProfile || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (chatFromProfile) setActiveChat(chatFromProfile);
  }, [chatFromProfile]);

  const fetchConversations = useCallback(async () => {
    try { setConversations(await messageApi.conversations()); } catch {}
  }, []);

  const fetchMessages = useCallback(async (userId) => {
    if (!userId) return;
    try { setMessages(await messageApi.get(userId)); } catch {}
  }, []);

  useEffect(() => { fetchConversations().finally(() => setLoading(false)); }, [fetchConversations]);
  useEffect(() => { if (activeChat) fetchMessages(activeChat); }, [activeChat, fetchMessages]);

  // Socket.io
  useEffect(() => {
    if (!me) return;
    const s = io(SOCKET_URL, { withCredentials: true });
    s.on('connect', () => setSocket(s));
    s.on('new-message', (msg) => {
      if (msg.sender._id === activeChat || msg.receiver._id === activeChat) {
        setMessages(prev => [...prev, msg]);
      }
      fetchConversations();
    });
    s.on('message-sent', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => { s.disconnect(); };
  }, [me, activeChat, fetchConversations]);

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    const content = input.trim();
    setInput('');
    try {
      if (socket?.connected) {
        socket.emit('private-message', { receiverId: activeChat, content });
      } else {
        await messageApi.send({ receiver: activeChat, content });
        fetchMessages(activeChat);
      }
      fetchConversations();
    } catch (err) { showToast(err.message, 'error'); }
  };

  if (loading) return <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 rounded-xl bg-nx-card border border-nx-border animate-pulse" />)}</div>;

  if (activeChat) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="flex items-center gap-3 pb-4 border-b border-nx-border mb-4">
          <button onClick={() => setActiveChat(null)} className="w-9 h-9 rounded-lg border border-nx-border bg-nx-card text-nx-textSec cursor-pointer flex items-center justify-center"><i className="fa-solid fa-arrow-left text-sm" /></button>
          <div className="w-10 h-10 rounded-xl bg-nx-purple/20 flex items-center justify-center text-nx-purpleLight font-bold text-xs">
            {conversations.find(c => c._id === activeChat)?.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2) || '?'}
          </div>
          <div className="flex-1"><p className="font-bold text-sm">{conversations.find(c => c._id === activeChat)?.fullName}</p><p className="text-xs text-nx-textMuted">@{conversations.find(c => c._id === activeChat)?.username}</p></div>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pb-4">
          {messages.length === 0 && <p className="text-center text-nx-textMuted text-sm py-12">Start a conversation.</p>}
          {messages.map(msg => (
            <div key={msg._id} className={msg.sender._id === me._id ? 'ml-auto' : ''} style={{ maxWidth: '75%' }}>
              <div className={`px-4 py-2.5 text-sm leading-relaxed ${msg.sender._id === me._id ? 'text-white rounded-[18px_18px_4px_18px]' : 'bg-nx-card border border-nx-border text-nx-text rounded-[18px_18px_18px_4px]'}`} style={msg.sender._id === me._id ? { background: 'var(--gradient-purple)' } : {}}>
                {msg.content}
              </div>
              <p className="text-[10px] text-nx-textMuted mt-1 opacity-60">{timeAgo(msg.createdAt)}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 items-end">
          <input className="input-field flex-1" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }} />
          <button onClick={sendMessage} className="w-11 h-11 rounded-xl border-none flex items-center justify-center flex-shrink-0 cursor-pointer" style={{ background: 'var(--gradient-purple)' }}>
            <i className="fa-solid fa-paper-plane text-sm text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <h1 className="font-display text-[28px] font-black tracking-tight mb-1">Messages</h1>
      <p className="text-nx-textMuted text-sm mb-6">Connect with people in the Sphere</p>
      {conversations.length === 0 ? (
        <div className="text-center py-16">
          <i className="fa-solid fa-message text-5xl text-nx-textMuted mb-4 block" />
          <h3 className="font-display text-xl font-bold mb-2">No conversations yet</h3>
          <p className="text-nx-textMuted text-sm">Visit someone&apos;s profile and click Message to start chatting.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {conversations.map(c => (
            <div key={c._id} onClick={() => setActiveChat(c._id)} className="flex items-center gap-3 p-3.5 bg-nx-card rounded-2xl border border-nx-border cursor-pointer hover:border-nx-borderLight transition-colors">
              <div className="w-12 h-12 rounded-[14px] bg-nx-purple/20 flex items-center justify-center text-nx-purpleLight font-bold text-sm flex-shrink-0">
                {c.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px]">{c.fullName}</span>
                  {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-nx-purple text-white text-[11px] font-bold flex items-center justify-center">{c.unread}</span>}
                </div>
                <p className="text-xs text-nx-textMuted mt-0.5 truncate">Start chatting</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}