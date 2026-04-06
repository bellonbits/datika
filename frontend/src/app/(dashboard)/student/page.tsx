'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { 
  Flame, 
  Bot, 
  Send, 
  Play, 
  Pause, 
  Clock, 
  Layers, 
  Activity,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

/* ─── Shared dark design tokens ─────────────────────────── */
const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };
const cardHover = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' };

const CHAT_MESSAGES = [
  { id: 1, name: 'Sarah K.', color: '#00d4ff', time: '2m ago', text: 'This gradient descent explanation is so clear!' },
  { id: 2, name: 'David M.', color: '#f97316', time: '1m ago', text: 'Can you explain the learning rate again?' },
  { id: 3, name: 'Amina T.', color: '#a855f7', time: 'just now', text: 'Love the visualizations', icon: <Flame size={14} className="text-orange-500 inline ml-1" /> },
];

const MY_COURSES = [
  { id: '1', title: 'Introduction to Machine Learning', instructor: 'Dr. James Omondi', lessons: 12, progress: 58, accent: '#00d4ff', gradient: 'from-cyan-500/20 to-blue-600/20' },
  { id: '2', title: 'Python for Data Science', instructor: 'Prof. Aisha Mwangi', lessons: 8, progress: 32, accent: '#f97316', gradient: 'from-orange-500/20 to-red-600/20' },
];

const REMINDERS = [
  { id: 1, text: 'Complete coding challenge', sub: 'Due in 2 hours', color: '#f97316', done: false },
  { id: 2, text: 'Review ML project notes', sub: 'Before next session', color: '#00d4ff', done: false },
  { id: 3, text: 'Watch Lesson 4', sub: 'Neural Networks', color: '#a855f7', done: true },
];

function CourseThumbnail({ gradient, accent, tag }: { gradient: string; accent: string; tag: string }) {
  return (
    <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${gradient} relative overflow-hidden flex-shrink-0`}
      style={{ border: `1px solid ${accent}30` }}>
      <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full" style={{ background: `${accent}15` }} />
      <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full" style={{ background: `${accent}10` }} />
      <span className="absolute bottom-2 right-3 font-black text-2xl" style={{ color: `${accent}30` }}>{tag}</span>
    </div>
  );
}

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [reminders, setReminders] = useState(REMINDERS);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), name: user?.name?.split(' ')[0] ?? 'You', color: '#00d4ff', time: 'just now', text: chatInput.trim() }]);
    setChatInput('');
  };

  return (
    <div className="flex h-full p-4 gap-4 overflow-hidden text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══ MAIN AREA ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-auto">

        {/* Video player */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden flex-shrink-0"
          style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #070b16 0%, #0d1421 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Background grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,212,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.15) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />

          {/* Lesson content indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white/10 text-xs font-mono mb-3 uppercase tracking-widest">Lesson 3 — Gradient Descent</div>
              <div className="flex gap-6 items-end justify-center">
                {[60,80,45,90,55,70,40,85].map((h,i) => (
                  <div key={i} className="w-4 rounded-t-sm" style={{ height: h * 0.6, background: `rgba(0,212,255,${0.1 + i * 0.04})` }} />
                ))}
              </div>
              <div className="mt-3 text-white/10 text-xs tracking-wider">Loss curve visualisation</div>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span className="flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1 rounded-lg" style={{ background: '#ef4444' }}>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />LIVE
            </span>
            <span className="text-white text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>4K</span>
          </div>

          {/* Viewer count */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-lg px-3 py-1" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-white/70 text-xs">847 watching</span>
          </div>

          {/* Play button */}
          <button className="absolute inset-0 flex items-center justify-center z-10 group" onClick={() => setPlaying(!playing)}>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', backdropFilter: 'blur(8px)' }}>
              {playing
                ? <Pause size={24} fill="white" />
                : <Play size={24} fill="white" className="ml-1" />
              }
            </div>
          </button>

          {/* Subtitle */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
            <div className="text-white/80 text-sm px-4 py-1.5 rounded-lg max-w-sm text-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
              "The gradient points in the direction of steepest ascent..."
            </div>
          </div>

          {/* Scrubber */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-xs font-mono">24:15</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full w-[38%]" style={{ background: '#00d4ff' }} />
              </div>
              <span className="text-white/40 text-xs font-mono">58:42</span>
            </div>
          </div>
        </motion.div>

        {/* Speaker row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #00d4ff33, #0d6efd33)', border: '1px solid rgba(0,212,255,0.3)' }}>JO</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white/90 text-sm">Dr. James Omondi</p>
            <p className="text-white/40 text-xs">Episode 3 · Introduction to Machine Learning</p>
          </div>
          <button className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
            style={{ border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            Following
          </button>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg font-bold text-white/90">Gradient Descent &amp; Optimization — Live Session</h2>
          <p className="text-white/35 text-sm mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </motion.div>

        {/* Live chat */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col overflow-hidden min-h-0"
          style={{ ...card, minHeight: 180 }}
        >
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white/80 text-sm">Live Chat</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
                {messages.length + 124} online
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                  style={{ background: `${msg.color}33`, border: `1px solid ${msg.color}44`, color: msg.color }}>
                  {msg.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-white/70">{msg.name}</span>
                    <span className="text-xs text-white/25">{msg.time}</span>
                  </div>
                  <p className="text-sm text-white/55 leading-snug">
                    {msg.text}
                    {msg.icon}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                {user?.name?.[0] ?? 'U'}
              </div>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                placeholder="Say something..."
                className="flex-1 text-sm text-white placeholder:text-white/20 outline-none h-9 px-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
              <button onClick={sendMessage} disabled={!chatInput.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════ */}
      <div className="w-[288px] flex-shrink-0 flex flex-col gap-4 overflow-auto">

        {/* My courses */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={card} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white/80 text-sm">My courses</span>
              <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
                {MY_COURSES.length}
              </span>
            </div>
            <button onClick={() => router.push('/student/courses')} className="text-xs text-white/30 hover:text-white/60 transition-colors">All →</button>
          </div>

          <div className="space-y-4">
            {MY_COURSES.map((course, i) => (
              <motion.div key={course.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="cursor-pointer group"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <CourseThumbnail gradient={course.gradient} accent={course.accent} tag={course.title.split(' ')[0].slice(0,2).toUpperCase()} />
                <div className="mt-2.5">
                  <p className="text-sm font-semibold text-white/80 leading-snug line-clamp-2 group-hover:text-white transition-colors">{course.title}</p>
                  <div className="flex items-center justify-between mt-1 mb-1.5">
                    <span className="text-xs text-white/30">{course.instructor}</span>
                    <span className="text-xs text-white/30">{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${course.progress}%`, background: course.accent }} />
                    </div>
                    <span className="text-xs font-semibold flex-shrink-0" style={{ color: course.accent }}>{course.progress}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reminders */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={card} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-white/80 text-sm">Reminders</span>
          </div>
          <div className="space-y-1.5">
            {reminders.map((r) => (
              <div key={r.id}
                className="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.02)' }}
                onClick={() => setReminders((p) => p.map((x) => x.id === r.id ? { ...x, done: !x.done } : x))}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              >
                <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: r.color, minHeight: 28 }} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight transition-all ${r.done ? 'line-through text-white/25' : 'text-white/75'}`}>{r.text}</p>
                  <p className="text-xs text-white/25 mt-0.5">{r.sub}</p>
                </div>
                {r.done && <span className="text-green-400 text-xs flex-shrink-0 mt-0.5">✓</span>}
              </div>
            ))}
          </div>
          <button className="mt-3 w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all text-white/30 hover:text-white/60"
            style={{ border: '1px dashed rgba(255,255,255,0.12)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.color = '#00d4ff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}>
            + Add new
          </button>
        </motion.div>

        {/* AI Tutor CTA */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 rounded-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(13,110,253,0.15) 100%)', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(13,110,253,0.1) 0%, transparent 70%)' }} />
          <p className="text-sm font-bold text-white mb-1 relative">AI Tutor</p>
          <p className="text-xs text-white/40 mb-3 relative leading-relaxed">Ask questions, get code help, deepen your understanding.</p>
          <button
            onClick={() => router.push('/student/chat')}
            className="w-full h-8 text-xs font-semibold rounded-xl transition-all relative"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.15)'; }}
          >
            Start a session →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
