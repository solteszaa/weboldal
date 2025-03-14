import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SoltAI Solutions',
  description: 'Személyreszabott AI agentek és automatizációk',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className={`${inter.className} bg-dark-bg text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
} 