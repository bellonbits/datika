'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DatikaLogo from './DatikaLogo';

const NAV_LINKS = [
  { label: 'Courses', href: '/courses' },
  { label: 'Technology', href: '/technology' },
  {
    label: 'About', href: '/about', dropdown: true,
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/about#story' },
      { label: 'Press', href: '/press' },
      { label: 'Partners', href: '/partners' },
    ],
  },
  {
    label: 'Community', href: '/community', dropdown: true,
    children: [
      { label: 'Forum', href: '/community' },
      { label: 'Blog', href: '/blog' },
      { label: 'Events', href: '/community#events' },
    ],
  },
  { label: 'Careers', href: '/careers' },
];

function FacebookIcon() {
  return (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(7,11,22,0.95)' : 'rgba(7,11,22,0.6)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <DatikaLogo size={36} showText textColor="white" />
        </Link>

        {/* Centre nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => {
            const isActive = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <div key={l.label} className="relative"
                onMouseEnter={() => l.dropdown && setOpenDropdown(l.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={l.href}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 select-none"
                  style={{
                    color: isActive ? '#00d4ff' : 'rgba(255,255,255,0.6)',
                    background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  {l.label}
                  {l.dropdown && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      className="transition-transform" style={{ transform: openDropdown === l.label ? 'rotate(180deg)' : 'none' }}>
                      <path d="M2 3.5l3 3 3-3" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown */}
                {l.dropdown && l.children && openDropdown === l.label && (
                  <div className="absolute top-full left-0 pt-2 min-w-[180px] z-50">
                    <div className="rounded-xl overflow-hidden py-1"
                      style={{ background: 'rgba(13,20,33,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                      {l.children.map((child) => (
                        <Link key={child.label} href={child.href}
                          className="block px-4 py-2.5 text-sm transition-colors"
                          style={{ color: 'rgba(255,255,255,0.55)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden lg:flex items-center gap-1 mr-1">
            {[{ icon: <FacebookIcon />, label: 'Facebook' }, { icon: <YoutubeIcon />, label: 'YouTube' }, { icon: <TwitterIcon />, label: 'Twitter' }].map(({ icon, label }) => (
              <button key={label} aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ color: 'rgba(255,255,255,0.55)', background: 'transparent', border: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'transparent'; }}>
                {icon}
              </button>
            ))}
          </div>

          <div className="hidden lg:block w-px h-5" style={{ background: 'rgba(255,255,255,0.12)' }} />

          <Link href="/login">
            <button className="hidden sm:flex h-9 px-4 rounded-xl text-sm font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.65)', background: 'transparent', border: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent'; }}>
              Sign in
            </button>
          </Link>
          <Link href="/register">
            <button className="h-9 px-5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 20px rgba(249,115,22,0.25)' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 28px rgba(249,115,22,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(249,115,22,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Get started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
