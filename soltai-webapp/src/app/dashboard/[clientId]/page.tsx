'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';

/**
 * AI Agent interfész definíció
 */
interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive';
  lastActive?: string;
}

// Demo adatok - valós alkalmazásban API-ból jönnének
const DEMO_AGENTS: AIAgent[] = [
  {
    id: 'agent-1',
    name: 'Email Asszisztens',
    description: 'Automatikusan kategorizálja és válaszol az egyszerű emailekre.',
    type: 'Kommunikációs',
    status: 'active',
    lastActive: '2023-03-13T10:30:00Z',
  },
  {
    id: 'agent-2',
    name: 'Adatelemző',
    description: 'Kimutatásokat készít és trendeket elemez a cég adataiból.',
    type: 'Elemző',
    status: 'active',
    lastActive: '2023-03-12T15:45:00Z',
  },
  {
    id: 'agent-3',
    name: 'Ütemező Bot',
    description: 'Találkozókat szervez és emlékeztetőket küld a határidőkről.',
    type: 'Szervező',
    status: 'inactive',
  },
];

/**
 * Kliens specifikus irányítópult komponens
 * Dinamikus útvonal alapján jeleníti meg az adott ügyfél agent-jeit
 */
export default function ClientDashboardPage() {
  const { clientId } = useParams();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Adott klienshez tartozó agentek betöltése
    const fetchAgents = async () => {
      try {
        // Szimulált API késleltetés
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Demo kliens esetén a demo adatokat adjuk vissza
        if (clientId === 'demo') {
          setAgents(DEMO_AGENTS);
        } else {
          // Valós esetben API hívás lenne itt
          // TODO: API hívás implementálása a klienshez tartozó agentekért
          setAgents([]);
        }
      } catch (error) {
        console.error('Hiba az agentek betöltése közben:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [clientId]);

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      {/* Üveg hatású fejléc */}
      <header className="glass-header p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-serif">SOLTAI SOLUTIONS</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Üdvözöljük, {clientId}</span>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
              Kijelentkezés
            </Link>
          </div>
        </div>
      </header>

      {/* Fő tartalom */}
      <main className="container mx-auto px-4 py-8 mb-16">
        <h2 className="text-3xl font-bold mb-2">Irányítópult</h2>
        <p className="text-gray-400 mb-8">AI Agentjei és automatizációi egy helyen</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            {/* Agenteket megjelenítő kártyák */}
            <h3 className="text-xl font-semibold mb-4">AI Agentek ({agents.length})</h3>
            
            {agents.length === 0 ? (
              <div className="bg-dark-surface rounded-lg p-8 text-center">
                <p className="text-gray-400">Még nincsenek AI agentjei.</p>
                <button className="mt-4 px-4 py-2 bg-accent hover:bg-opacity-90 rounded-md transition-colors">
                  + Új Agent hozzáadása
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-dark-surface rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-semibold">{agent.name}</h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            agent.status === 'active'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {agent.status === 'active' ? 'Aktív' : 'Inaktív'}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">{agent.description}</p>
                      <div className="text-sm text-gray-500 mb-4">
                        <p>Típus: {agent.type}</p>
                        {agent.lastActive && (
                          <p>Utoljára aktív: {new Date(agent.lastActive).toLocaleString('hu')}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/${clientId}/agents/${agent.id}`}
                          className="flex-1 px-3 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors"
                        >
                          Használat
                        </Link>
                        <button className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                          Statisztikák
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Lábléc a copyright szöveggel */}
      <Footer />
    </div>
  );
} 