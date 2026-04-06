'use client';

import { motion } from 'framer-motion';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const WEEKLY_ACTIVITY = [
  { day: 'Mon', minutes: 45, lessons: 2 },
  { day: 'Tue', minutes: 90, lessons: 4 },
  { day: 'Wed', minutes: 20, lessons: 1 },
  { day: 'Thu', minutes: 120, lessons: 5 },
  { day: 'Fri', minutes: 60, lessons: 3 },
  { day: 'Sat', minutes: 30, lessons: 1 },
  { day: 'Sun', minutes: 0, lessons: 0 },
];

const COURSES_PROGRESS = [
  { title: 'Introduction to Machine Learning', progress: 58, completedLessons: 7, totalLessons: 12, accent: '#00d4ff', timeSpent: '14h 20m', quizAvg: 82 },
  { title: 'Python for Data Science', progress: 32, completedLessons: 3, totalLessons: 8, accent: '#f97316', timeSpent: '6h 45m', quizAvg: 76 },
  { title: 'SQL for Data Analysis', progress: 100, completedLessons: 10, totalLessons: 10, accent: '#10b981', timeSpent: '22h 10m', quizAvg: 91 },
  { title: 'Data Visualisation with Power BI', progress: 0, completedLessons: 0, totalLessons: 6, accent: '#a855f7', timeSpent: '0m', quizAvg: 0 },
];

const ACHIEVEMENTS = [
  { title: 'First Lesson', desc: 'Completed your first lesson', earned: true, accent: '#10b981', icon: '🎯' },
  { title: 'Week Streak', desc: '7 days learning in a row', earned: true, accent: '#00d4ff', icon: '🔥' },
  { title: 'Quiz Ace', desc: 'Scored 90%+ on a quiz', earned: true, accent: '#f97316', icon: '🏆' },
  { title: 'Course Graduate', desc: 'Completed a full course', earned: true, accent: '#10b981', icon: '🎓' },
  { title: 'Night Owl', desc: 'Study session after midnight', earned: false, accent: '#a855f7', icon: '🦉' },
  { title: 'Century Club', desc: 'Log 100 hours of learning', earned: false, accent: '#f59e0b', icon: '💯' },
];

const RECENT_ACTIVITY = [
  { action: 'Completed lesson', detail: 'Gradient Descent & Optimization', time: '2h ago', accent: '#10b981' },
  { action: 'Scored 84%', detail: 'ML Fundamentals Quiz #3', time: '3h ago', accent: '#00d4ff' },
  { action: 'Completed lesson', detail: 'Pandas GroupBy & Aggregations', time: 'Yesterday', accent: '#10b981' },
  { action: 'Started course', detail: 'Data Visualisation with Power BI', time: '2 days ago', accent: '#a855f7' },
  { action: 'Earned certificate', detail: 'SQL for Data Analysis', time: '5 days ago', accent: '#f97316' },
];

const maxMinutes = Math.max(...WEEKLY_ACTIVITY.map((d) => d.minutes));

export default function ProgressPage() {
  const totalMinutes = WEEKLY_ACTIVITY.reduce((a, d) => a + d.minutes, 0);
  const totalLessons = WEEKLY_ACTIVITY.reduce((a, d) => a + d.lessons, 0);
  const overallProgress = Math.round(COURSES_PROGRESS.reduce((a, c) => a + c.progress, 0) / COURSES_PROGRESS.length);

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">My Progress</h1>
        <p className="text-white/40 text-sm">Track your learning activity and achievements</p>
      </motion.div>

      {/* Top stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Overall Progress', value: `${overallProgress}%`, accent: '#00d4ff' },
          { label: 'This Week', value: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m`, accent: '#f97316' },
          { label: 'Lessons This Week', value: totalLessons, accent: '#a855f7' },
          { label: 'Certificates Earned', value: 1, accent: '#10b981' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-4 rounded-2xl" style={card}>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-4">

        {/* Weekly activity chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="col-span-2 p-5 rounded-2xl" style={card}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Weekly Activity</h2>
              <p className="text-white/35 text-xs mt-0.5">Minutes studied per day</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#00d4ff' }} />
              <span className="text-xs text-white/35">This week</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {WEEKLY_ACTIVITY.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: maxMinutes > 0 ? `${(d.minutes / maxMinutes) * 100}%` : '4px' }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-lg relative"
                  style={{ background: d.minutes > 0 ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.05)', minHeight: 4 }}>
                  {d.minutes > 0 && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-white/50 whitespace-nowrap">{d.minutes}m</div>
                  )}
                </motion.div>
                <span className="text-xs text-white/30">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="p-5 rounded-2xl overflow-hidden" style={card}>
          <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.accent }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-xs font-medium leading-tight">{a.action}</p>
                  <p className="text-white/35 text-xs leading-tight mt-0.5 truncate">{a.detail}</p>
                </div>
                <span className="text-white/20 text-xs flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Course-by-course breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="p-5 rounded-2xl mb-4" style={card}>
        <h2 className="text-white font-semibold mb-5">Course Breakdown</h2>
        <div className="space-y-4">
          {COURSES_PROGRESS.map((c, i) => (
            <div key={c.title}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-white/75 text-sm font-medium">{c.title}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-white/30">{c.timeSpent}</span>
                  {c.quizAvg > 0 && <span className="text-xs" style={{ color: c.accent }}>Quiz avg {c.quizAvg}%</span>}
                  <span className="text-xs text-white/40">{c.completedLessons}/{c.totalLessons} lessons</span>
                  <span className="text-sm font-bold w-10 text-right" style={{ color: c.accent }}>{c.progress}%</span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                  style={{ background: c.accent }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl" style={card}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Achievements</h2>
          <span className="text-xs text-white/35">{ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length} earned</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((a, i) => (
            <motion.div key={a.title}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.05 }}
              className="p-4 rounded-xl text-center"
              style={{
                background: a.earned ? `${a.accent}10` : 'rgba(255,255,255,0.02)',
                border: a.earned ? `1px solid ${a.accent}25` : '1px solid rgba(255,255,255,0.05)',
                opacity: a.earned ? 1 : 0.45,
              }}>
              <div className="text-2xl mb-2">{a.icon}</div>
              <p className="text-white/80 font-semibold text-xs mb-0.5">{a.title}</p>
              <p className="text-white/35 text-xs leading-tight">{a.desc}</p>
              {a.earned && <div className="mt-2 w-4 h-4 rounded-full flex items-center justify-center mx-auto" style={{ background: a.accent }}>
                <svg width="8" height="8" fill="white" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              </div>}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
