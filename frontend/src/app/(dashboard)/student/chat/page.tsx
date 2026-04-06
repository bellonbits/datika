'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import { aiApi } from '@/lib/api/ai.api';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages?: { content: string }[];
}

const SUGGESTED = [
  'Explain gradient descent with a simple example',
  'What is the difference between supervised and unsupervised learning?',
  'How do I handle missing values in pandas?',
  'Write a Python function to calculate RMSE',
];

const WELCOME: Message = {
  id: 'welcome',
  role: 'ai',
  text: "Hi! I'm your Datika AI Tutor powered by Groq Llama 4 Scout. I know your course content inside out — ask me anything about Machine Learning, Python, SQL, or any topic you're studying. What can I help you with?",
  time: 'just now',
};

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  if (d === 1) return 'Yesterday';
  return `${d} days ago`;
}

export default function AITutorPage() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: sessionsData, refetch: refetchSessions } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => aiApi.getChatSessions() as Promise<{ data: ChatSession[] }>,
  });

  const sessions: ChatSession[] = (sessionsData as unknown as { data: ChatSession[] })?.data ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async (sid: string) => {
    setActiveSessionId(sid);
    setSessionId(sid);
    try {
      const res = await aiApi.getChatSession(sid) as unknown as {
        data: { messages: { role: string; content: string; createdAt: string }[] }
      };
      const loaded: Message[] = (res?.data?.messages ?? []).map((m, i) => ({
        id: `${sid}-${i}`,
        role: m.role === 'USER' ? 'user' : 'ai',
        text: m.content,
        time: new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }));
      setMessages(loaded.length > 0 ? loaded : [WELCOME]);
    } catch {
      setMessages([WELCOME]);
    }
  };

  const startNew = () => {
    setMessages([WELCOME]);
    setSessionId(undefined);
    setActiveSessionId(undefined);
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), time: formatTime() };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiApi.sendMessage({ message: text.trim(), sessionId }) as unknown as {
        data: { reply: string; sessionId: string }
      };
      const reply = res?.data?.reply ?? 'Sorry, I could not generate a response. Please try again.';
      const newSessionId = res?.data?.sessionId;
      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
        setActiveSessionId(newSessionId);
        refetchSessions();
      }
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: reply, time: formatTime() };
      setMessages((p) => [...p, aiMsg]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const errMsg = axiosErr?.response?.data?.message ?? 'Something went wrong. Please try again.';
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: errMsg,
        time: formatTime(),
      };
      setMessages((p) => [...p, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div className="flex h-full text-white overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Sidebar: sessions ──────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button className="w-full h-9 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg,#00d4ff22,#0d6efd22)', border: '1px solid rgba(0,212,255,0.25)' }}
            onClick={startNew}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#00d4ff" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span style={{ color: '#00d4ff' }}>New conversation</span>
          </button>
        </div>

        <div className="p-3 flex-1 overflow-auto">
          <p className="text-white/25 text-xs font-semibold uppercase tracking-wider px-2 mb-2">Recent</p>
          {sessions.length === 0 && (
            <p className="text-white/20 text-xs px-2 mt-4">No conversations yet. Start one above!</p>
          )}
          <div className="space-y-1">
            {sessions.map((s) => (
              <button key={s.id} onClick={() => loadSession(s.id)}
                className="w-full text-left p-3 rounded-xl transition-all"
                style={activeSessionId === s.id
                  ? { background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }
                  : { background: 'transparent', border: '1px solid transparent' }}
                onMouseEnter={(e) => { if (activeSessionId !== s.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { if (activeSessionId !== s.id) e.currentTarget.style.background = 'transparent'; }}>
                <p className="text-white/75 text-xs font-medium leading-tight truncate">{s.title || 'Conversation'}</p>
                <p className="text-white/20 text-xs mt-1">{timeAgo(s.updatedAt)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <p className="text-white/60 text-xs font-semibold mb-0.5">AI Tutor</p>
            <p className="text-white/35 text-xs">Powered by Groq Llama 4 Scout</p>
          </div>
        </div>
      </aside>

      {/* ── Main chat ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        <div className="px-6 py-4 flex items-center gap-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#00d4ff" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Datika AI Tutor</p>
            <p className="text-xs" style={{ color: '#10b981' }}>● Online · Groq Llama 4 Scout</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={msg.role === 'ai'
                    ? { background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }
                    : { background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316' }}>
                  {msg.role === 'ai' ? '✦' : user?.name?.[0] ?? 'U'}
                </div>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={msg.role === 'ai'
                      ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }
                      : { background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', color: 'rgba(255,255,255,0.85)' }}>
                    {msg.text}
                  </div>
                  <span className="text-white/20 text-xs px-1">{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>✦</div>
              <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'rgba(0,212,255,0.6)' }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </motion.div>
          )}

          {messages.length === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-2 mt-4">
              {SUGGESTED.map((q) => (
                <button key={q} onClick={() => send(q)}
                  className="p-3 rounded-xl text-left text-xs text-white/50 hover:text-white/80 transition-all leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; e.currentTarget.style.background = 'rgba(0,212,255,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about your course..."
                rows={1}
                className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder:text-white/20 outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: 120, lineHeight: '1.5' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>
            <button onClick={() => send(input)} disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg,#00d4ff,#0d6efd)', boxShadow: input.trim() ? '0 0 20px rgba(0,212,255,0.25)' : 'none' }}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
          <p className="text-white/20 text-xs mt-2 text-center">Press Enter to send · Shift+Enter for new line · AI may make mistakes</p>
        </div>
      </div>
    </div>
  );
}
