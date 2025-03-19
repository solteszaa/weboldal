import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Inter betűtípus betöltése a latin karakterkészlethez
const inter = Inter({ subsets: ['latin'] });

// Metadata az alkalmazáshoz
export const metadata: Metadata = {
  title: 'SoltAI Solutions',
  description: 'Személyreszabott AI agentek és automatizációk',
};

/**
 * Gyökér layout komponens
 * Az összes oldal közös keretét adja
 */
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