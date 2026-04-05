import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Datika — AI-Powered Data Science Learning',
    template: '%s | Datika',
  },
  description:
    'Master data analysis and data science with AI-generated content, smart assessments, and personalized feedback.',
  keywords: ['data science', 'SQL', 'Python', 'machine learning', 'online learning', 'Kenya'],
  authors: [{ name: 'Datika' }],
  openGraph: {
    title: 'Datika — AI-Powered Data Science Learning',
    description: 'Learn data analysis with AI-powered courses and smart feedback.',
    type: 'website',
    locale: 'en_KE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
