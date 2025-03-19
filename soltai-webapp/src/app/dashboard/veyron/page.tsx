'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import SocialMediaManager from '@/components/SocialMediaManager';

/**
 * Veyron specifikus irányítópult komponens
 * A Veyron Hungary ügyfél számára készített egyedi dashboard
 */
export default function VeyronDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showSocialMediaManager, setShowSocialMediaManager] = useState(false);

  useEffect(() => {
    // Veyron specifikus adatok betöltése
    const loadVeyronData = async () => {
      try {
        // Betöltés szimulálása
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
      } catch (error) {
        console.error('Hiba az adatok betöltése közben:', error);
        setLoading(false);
      }
    };

    loadVeyronData();
  }, []);

  const goBack = () => {
    setShowSocialMediaManager(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Üveg hatású fejléc */}
      <header className="glass-header shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-serif">Veyron poszt generátor</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </header>

      {/* Fő tartalom */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Veyron poszt generátor</h2>
        
        {showSocialMediaManager ? (
          <>
            <button 
              onClick={goBack} 
              className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center"
            >
              <span>← Vissza a Dashboardra</span>
            </button>
            <SocialMediaManager />
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-6 text-gray-300">Választható Automatizációk</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : (
                <>
                  {/* Ingatlan Poszt Generátor Kártya */}
                  <div 
                    className="bg-dark-surface p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:bg-gray-800 border border-gray-700 hover:border-accent"
                    onClick={() => setShowSocialMediaManager(true)}
                  >
                    <div className="mb-3 flex justify-center">
                      <div className="rounded-full bg-accent/20 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-center">Ingatlan Poszt Generátor</h2>
                    <p className="text-gray-400 text-center mb-4">
                      Automatikus ingatlan bemutató posztok generálása OpenAI segítségével
                    </p>
                    <ul className="text-gray-300 text-sm space-y-2 mb-4">
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Gyors és hatékony automatizálás
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Prémium minőségű tartalom
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Azonnal használható poszt szövegek
                      </li>
                    </ul>
                    <button
                      className="w-full py-2 bg-accent hover:bg-opacity-90 rounded-md transition-colors text-center"
                    >
                      Megnyitás
                    </button>
                  </div>
                  
                  {/* Hamarosan Kártya */}
                  <div className="bg-dark-surface p-6 rounded-lg shadow-xl border border-gray-700 relative opacity-60">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-gray-900 bg-opacity-75 px-4 py-2 rounded-lg transform rotate-12">
                        <span className="text-xl font-bold text-accent">Hamarosan!</span>
                      </div>
                    </div>
                    <div className="mb-3 flex justify-center">
                      <div className="rounded-full bg-gray-700/20 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-center text-gray-500">Új funkció készül</h2>
                    <p className="text-gray-500 text-center mb-4">
                      Hamarosan még több automatizáció érkezik
                    </p>
                    <div className="h-[100px]"></div>
                    <button
                      disabled
                      className="w-full py-2 bg-gray-700 cursor-not-allowed rounded-md transition-colors text-center opacity-70"
                    >
                      Hamarosan elérhető
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>

      {/* Lábléc a copyright szöveggel */}
      <Footer />
    </div>
  );
} 