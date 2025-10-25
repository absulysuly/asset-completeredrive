import type { Metadata } from 'next';
import { ReactNode } from 'react';

import './globals.css';
import TopNavBar from '../components/TopNavBar';

export const metadata: Metadata = {
  title: 'Hamlet Unified Platform',
  description: 'Election campaign management MVP for Iraqi electoral data.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <TopNavBar />
        <main className="mx-auto max-w-6xl px-6 pb-16 pt-6">{children}</main>
      </body>
    </html>
  );
}
