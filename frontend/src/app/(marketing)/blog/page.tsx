'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const POSTS = [
  {
    slug: 'getting-started-pandas',
    title: 'Getting started with Pandas: A practical guide for African datasets',
    excerpt: 'Learn how to clean, transform, and analyse real-world African business data using pandas — from M-Pesa transaction records to agricultural datasets.',
    author: 'Prof. Jane Wangari',
    date: 'April 2, 2026',
    category: 'Python',
    readTime: '8 min read',
    accent: '#00d4ff',
    featured: true,
  },
  {
    slug: 'sql-window-functions',
    title: 'SQL window functions you\'re not using (but should be)',
    excerpt: 'ROW_NUMBER, RANK, LAG, LEAD — window functions are one of the most underused tools in SQL. Here\'s a practical breakdown with real examples.',
    author: 'Brian Otieno',
    date: 'March 28, 2026',
    category: 'SQL',
    readTime: '6 min read',
    accent: '#f97316',
    featured: false,
  },
  {
    slug: 'ai-in-african-agriculture',
    title: 'How African startups are using ML to transform agriculture',
    excerpt: 'From crop disease detection to yield prediction, African agritech is leading the world in applied machine learning. We profile five companies doing it.',
    author: 'Dr. Amina Osei',
    date: 'March 21, 2026',
    category: 'AI & Industry',
    readTime: '10 min read',
    accent: '#10b981',
    featured: false,
  },
  {
    slug: 'mpesa-data-analysis',
    title: 'Analysing M-Pesa transaction data with Python',
    excerpt: 'A step-by-step tutorial on parsing M-Pesa transaction statements, aggregating spending patterns, and visualising insights with matplotlib.',
    author: 'Kevin Mwenda',
    date: 'March 14, 2026',
    category: 'Python',
    readTime: '12 min read',
    accent: '#a855f7',
    featured: false,
  },
  {
    slug: 'career-data-science-africa',
    title: 'Breaking into data science in Africa: A 2026 guide',
    excerpt: 'The skills you need, the companies hiring, and the salary expectations for data science roles across Kenya, Nigeria, South Africa, and Ghana.',
    author: 'Aisha Kamau',
    date: 'March 7, 2026',
    category: 'Career',
    readTime: '9 min read',
    accent: '#f59e0b',
    featured: false,
  },
  {
    slug: 'power-bi-vs-tableau',
    title: 'Power BI vs Tableau: Which should you learn first?',
    excerpt: 'An honest comparison for African learners — cost, job market demand, learning curve, and M365 integration. The answer might surprise you.',
    author: 'David Njoroge',
    date: 'February 28, 2026',
    category: 'BI Tools',
    readTime: '7 min read',
    accent: '#ec4899',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Python', 'SQL', 'AI & Industry', 'Career', 'BI Tools'];

const CAT_COLOR: Record<string, string> = {
  Python: '#00d4ff',
  SQL: '#f97316',
  'AI & Industry': '#10b981',
  Career: '#f59e0b',
  'BI Tools': '#ec4899',
};

export default function BlogPage() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? POSTS : POSTS.filter((p) => p.category === cat);
  const featured = POSTS.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || cat !== 'All');

  return (
    <>
      <section className="pt-40 pb-16 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Blog</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Insights for <span style={{ color: '#00d4ff' }}>African data pros</span>
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto">Tutorials, career advice, and industry analysis from the Datika team.</p>
        </motion.div>
      </section>

      <section className="py-12 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          {/* Featured post */}
          {cat === 'All' && featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-7 rounded-2xl cursor-pointer transition-all"
              style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.18)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>Featured</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${CAT_COLOR[featured.category] ?? '#fff'}15`, color: CAT_COLOR[featured.category] ?? '#fff' }}>{featured.category}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-3 leading-snug">{featured.title}</h2>
              <p className="text-white/45 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>
                    {featured.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-white/50 text-sm">{featured.author} · {featured.date}</span>
                </div>
                <span className="text-white/30 text-xs">{featured.readTime}</span>
              </div>
            </motion.div>
          )}

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={cat === c
                  ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {c}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <motion.div key={post.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl cursor-pointer transition-all flex flex-col"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${post.accent}30`; e.currentTarget.style.background = `${post.accent}05`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full self-start mb-3"
                  style={{ background: `${CAT_COLOR[post.category] ?? '#fff'}15`, color: CAT_COLOR[post.category] ?? '#fff' }}>
                  {post.category}
                </span>
                <h3 className="text-white font-semibold mb-2 leading-snug flex-1">{post.title}</h3>
                <p className="text-white/35 text-xs mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-white/30 text-xs">{post.author}</span>
                  <span className="text-white/25 text-xs">{post.readTime}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
