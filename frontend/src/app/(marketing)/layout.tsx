import MarketingNav from '@/components/ui/MarketingNav';
import MarketingFooter from '@/components/ui/MarketingFooter';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', background: 'linear-gradient(135deg, #070b16 0%, #0d1421 60%, #0f0d1a 100%)' }}
    >
      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <MarketingNav />
      <main className="relative">{children}</main>
      <MarketingFooter />
    </div>
  );
}
