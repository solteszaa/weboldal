'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Demó bejelentkezés, valós alkalmazásban természetesen biztonságosabb auth rendszert használnánk
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'demo' && password === 'demo123') {
      router.push('/dashboard/demo');
    } else {
      setError('Hibás felhasználónév vagy jelszó');
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Mozgó reflektorfény effekt */}
      <div className="spotlight"></div>
      <div className="spotlight" style={{ left: '50%', animationDelay: '2s' }}></div>
      
      {/* Főtartalom konténer */}
      <div className="z-10 flex flex-col items-center justify-center gap-8 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-white tracking-wider">
          SOLTAI SOLUTIONS
        </h1>
        <p className="text-xl text-gray-300 max-w-md">
          Személyreszabott AI agentek és automatizációs megoldások az Ön vállalkozása számára
        </p>
        
        {/* Bejelentkezési form */}
        <div className="mt-8 w-full max-w-md">
          <div className="bg-dark-surface p-8 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Bejelentkezés</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Felhasználónév
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Jelszó
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-accent hover:bg-opacity-90 text-white font-medium rounded-md transition duration-200"
              >
                Bejelentkezés
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-400">
              <p>Demó hozzáféréshez: felhasználónév: <strong>demo</strong>, jelszó: <strong>demo123</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright szöveg az oldal alján */}
      <footer className="fixed bottom-0 w-full p-4 text-center">
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SoltAI Solutions. Minden jog fenntartva.
        </div>
      </footer>
    </main>
  );
} 