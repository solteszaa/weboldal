'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VeyronDashboard() {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Itt fogjuk betölteni a Veyron specifikus adatokat
    const loadVeyronData = async () => {
      try {
        // TODO: Implement API call to fetch Veyron specific data
        setLoading(false);
      } catch (error) {
        console.error('Hiba az adatok betöltése közben:', error);
        setLoading(false);
      }
    };

    loadVeyronData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="bg-dark-surface shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Veyron Hungary Dashboard</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Veyron Specifikus Kártyák */}
            <div className="bg-dark-surface p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Veyron Agentek</h2>
              <p className="text-gray-400">
                Itt jelennek meg a Veyron Hungary számára készített egyedi AI agentek.
              </p>
              <button
                onClick={() => {/* TODO: Implement agent management */}}
                className="mt-4 px-4 py-2 bg-accent hover:bg-opacity-90 rounded-md transition-colors"
              >
                Agentek Kezelése
              </button>
            </div>

            <div className="bg-dark-surface p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Automatizációk</h2>
              <p className="text-gray-400">
                Egyedi automatizációk és munkafolyamatok a Veyron Hungary számára.
              </p>
              <button
                onClick={() => {/* TODO: Implement automation management */}}
                className="mt-4 px-4 py-2 bg-accent hover:bg-opacity-90 rounded-md transition-colors"
              >
                Automatizációk Kezelése
              </button>
            </div>

            <div className="bg-dark-surface p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Statisztikák</h2>
              <p className="text-gray-400">
                Teljesítmény mutatók és használati statisztikák.
              </p>
              <button
                onClick={() => {/* TODO: Implement statistics view */}}
                className="mt-4 px-4 py-2 bg-accent hover:bg-opacity-90 rounded-md transition-colors"
              >
                Statisztikák Megtekintése
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="container mx-auto px-4 py-6 mt-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} SoltAI Solutions - Veyron Hungary</p>
      </footer>
    </div>
  );
} 