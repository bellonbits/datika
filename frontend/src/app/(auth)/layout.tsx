import DatikaLogo from '@/components/ui/DatikaLogo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', background: 'linear-gradient(135deg, #070b16 0%, #0d1421 50%, #0f0d1a 100%)' }}
    >
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-14"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative">
          <DatikaLogo size={38} showText textColor="white" />
        </div>

        {/* Centre copy */}
        <div className="relative">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            <span style={{ color: '#00d4ff' }}>Next Gen</span><br />
            Data Science<br />Education
          </h2>
          <p className="text-white/45 text-base leading-relaxed mb-10">
            AI-powered lessons, instant grading, and personalised feedback — designed for aspiring data professionals.
          </p>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4">
            {[['24+','Courses'],['1.2K','Learners'],['500+','AI Lessons']].map(([v,l]) => (
              <div key={l} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-xl font-extrabold mb-0.5" style={{ color: '#00d4ff' }}>{v}</div>
                <div className="text-white/40 text-xs">{l}</div>
              </div>
            ))}
          </div>

          {/* Decorative node graph */}
          <svg className="mt-10 opacity-30" width="100%" height="80" viewBox="0 0 300 80" fill="none">
            <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(0,212,255,0.4)" strokeWidth="1" strokeDasharray="6 4" />
            {[30,80,150,220,270].map((x,i) => (
              <circle key={i} cx={x} cy={40} r={i === 2 ? 6 : 4} fill="#00d4ff" opacity={i === 2 ? 1 : 0.5} />
            ))}
            <circle cx="150" cy="40" r="14" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.3" />
          </svg>
        </div>

        {/* Bottom */}
        <div className="relative flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-white/30 text-xs">AI Tutor available 24/7</span>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <DatikaLogo size={32} showText textColor="white" />
        </div>
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
