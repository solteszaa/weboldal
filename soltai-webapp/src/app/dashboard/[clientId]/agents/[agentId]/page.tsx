'use client';

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';

/**
 * Agent interfész - egy AI agent adatstruktúrája
 */
interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive';
  clientId: string;
  lastActive?: string;
  createdAt: string;
}

/**
 * Chat üzenet interfész - egy beszélgetésen belüli üzenet adatstruktúrája
 */
interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

/**
 * Beszélgetés interfész - egy teljes beszélgetés adatstruktúrája
 */
interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

/**
 * Agent részletes oldal komponens
 * Az adott kliens adott agent-jével való chat funkcionalitás
 */
export default function AgentDetailPage() {
  // Útvonal paraméterek és navigáció
  const { clientId, agentId } = useParams();
  const router = useRouter();
  
  // Állapotok
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  
  // Referencia a chat konténerhez a görgetéshez
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Görgetés a chat aljára új üzenet érkezésekor
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Agent adatok betöltése
  useEffect(() => {
    const fetchAgentDetails = async () => {
      setLoading(true);
      
      // Demó adatok
      if (clientId === 'demo' && typeof agentId === 'string' && agentId.startsWith('agent-')) {
        let demoAgent: Agent;
        
        if (agentId === 'agent-1') {
          demoAgent = {
            id: 'agent-1',
            name: 'Email Asszisztens',
            description: 'Automatikusan kategorizálja és válaszol az egyszerű emailekre.',
            type: 'Kommunikációs',
            status: 'active',
            clientId: 'demo',
            lastActive: '2023-03-13T10:30:00Z',
            createdAt: '2023-01-15T08:00:00Z',
          };
        } else if (agentId === 'agent-2') {
          demoAgent = {
            id: 'agent-2',
            name: 'Adatelemző',
            description: 'Kimutatásokat készít és trendeket elemez a cég adataiból.',
            type: 'Elemző',
            status: 'active',
            clientId: 'demo',
            lastActive: '2023-03-12T15:45:00Z',
            createdAt: '2023-01-20T10:15:00Z',
          };
        } else if (agentId === 'agent-3') {
          demoAgent = {
            id: 'agent-3',
            name: 'Ütemező Bot',
            description: 'Találkozókat szervez és emlékeztetőket küld a határidőkről.',
            type: 'Szervező',
            status: 'inactive',
            clientId: 'demo',
            createdAt: '2023-02-05T14:30:00Z',
          };
        } else {
          // Ismeretlen agent esetén visszairányítunk a dashboard-ra
          router.push(`/dashboard/${clientId}`);
          return;
        }
        
        setAgent(demoAgent);
        
        // Beszélgetési előzmények betöltése (demó)
        // Valós esetben ezek az adatok a szerverről jönnének
        const savedConversations = localStorage.getItem(`${clientId}-${agentId}-conversations`);
        let parsedConversations: Conversation[] = [];
        
        if (savedConversations) {
          try {
            parsedConversations = JSON.parse(savedConversations);
          } catch (e) {
            console.error('Hiba a beszélgetési előzmények betöltése közben:', e);
          }
        }
        
        // Ha nincs mentett beszélgetés, létrehozunk egy alapértelmezett demó beszélgetést
        if (parsedConversations.length === 0) {
          const demoConversation: Conversation = {
            id: 'conv-1',
            title: 'Első beszélgetés',
            createdAt: '2023-03-13T09:30:00Z',
            messages: [
              {
                role: 'user',
                content: 'Szia! Tudnál segíteni nekem?',
                timestamp: '2023-03-13T09:30:00Z',
              },
              {
                role: 'agent',
                content: `Üdvözlöm! Igen, miben segíthetek? Én vagyok a ${demoAgent.name}, és ${demoAgent.description.toLowerCase()}`,
                timestamp: '2023-03-13T09:30:05Z',
              },
              {
                role: 'user',
                content: 'Szeretnék információt kérni a szolgáltatásaitokról.',
                timestamp: '2023-03-13T09:31:00Z',
              },
              {
                role: 'agent',
                content: 'Természetesen! Milyen típusú szolgáltatás érdekelné? Részletes információt tudok nyújtani a kínálatunkról.',
                timestamp: '2023-03-13T09:31:10Z',
              },
            ],
          };
          
          parsedConversations = [demoConversation];
          
          // Mentjük a localStorage-ba
          localStorage.setItem(
            `${clientId}-${agentId}-conversations`, 
            JSON.stringify(parsedConversations)
          );
        }
        
        setConversations(parsedConversations);
        setActiveConversationId(parsedConversations[0]?.id || null);
        setChatMessages(parsedConversations[0]?.messages || []);
        
        setLoading(false);
        return;
      }
      
      // Valós alkalmazásban itt API hívás lenne
      try {
        // TODO: Agent adatok lekérése API-ból
        // const response = await fetch(`/api/agents/${agentId}?clientId=${clientId}`);
        // if (!response.ok) throw new Error('Nem sikerült betölteni az agent adatait');
        // const data = await response.json();
        // setAgent(data);
        
        // Demó adatok
        setAgent(null);
        setConversations([]);
        setChatMessages([]);
        setActiveConversationId(null);
      } catch (error) {
        console.error('Hiba az agent adatok betöltése közben:', error);
        router.push(`/dashboard/${clientId}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentDetails();
  }, [clientId, agentId, router]);

  /**
   * Üzenet küldése az agentnek
   */
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !agent) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    // Frissítjük a chat üzeneteket a felhasználó üzenetével
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setNewMessage('');
    setSending(true);
    
    try {
      // Valós alkalmazásban itt API hívás lenne
      // TODO: Üzenet küldése az agentnek API-n keresztül
      // const response = await fetch(`/api/agents/${agentId}/chat`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: newMessage, clientId }),
      // });
      
      // if (!response.ok) throw new Error('Nem sikerült elküldeni az üzenetet');
      // const data = await response.json();
      
      // Demó válasz
      await new Promise(resolve => setTimeout(resolve, 1000)); // Szimulált késleltetés
      
      // Agent specifikus válaszok generálása
      let responseContent = '';
      if (agent.id === 'agent-1') {
        responseContent = `Köszönöm az üzenetet! Feldolgoztam a kérést és kategorizáltam. Hamarosan válaszolok a részletekkel kapcsolatban.`;
      } else if (agent.id === 'agent-2') {
        responseContent = `Elemeztem a kérést. Az adatok alapján a következő trendeket azonosítottam: növekvő felhasználói aktivitás, csökkenő költségek, javuló konverziós ráta. Részletes jelentést készítek.`;
      } else if (agent.id === 'agent-3') {
        responseContent = `Ütemeztem a kért eseményt. Emlékeztetőt állítottam be a határidő előtt 24 órával. A résztvevőket értesítettem.`;
      } else {
        responseContent = `Köszönöm az üzenetet! Feldolgoztam a kérést és hamarosan válaszolok.`;
      }
      
      const agentMessage: ChatMessage = {
        role: 'agent',
        content: responseContent,
        timestamp: new Date().toISOString(),
      };
      
      // Frissítjük a chat üzeneteket az agent válaszával
      const finalMessages = [...updatedMessages, agentMessage];
      setChatMessages(finalMessages);
      
      // Frissítjük a beszélgetést a localStorage-ban
      if (activeConversationId) {
        const updatedConversations = conversations.map(conv => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: finalMessages,
              // Ha ez az első felhasználói üzenet, akkor a beszélgetés címét az üzenet első 20 karakteréből generáljuk
              title: conv.messages.length === 0 ? userMessage.content.slice(0, 20) + '...' : conv.title
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
        
        // Mentjük a localStorage-ba
        if (typeof window !== 'undefined' && clientId && agentId) {
          localStorage.setItem(
            `${clientId}-${agentId}-conversations`, 
            JSON.stringify(updatedConversations)
          );
        }
      }
    } catch (error) {
      console.error('Hiba az üzenet küldése közben:', error);
      // Hiba esetén hibaüzenetet jeleníthetünk meg
    } finally {
      setSending(false);
    }
  };

  /**
   * Új beszélgetés indítása
   */
  const startNewConversation = () => {
    // Generálunk egy egyedi azonosítót az új beszélgetésnek
    const newConversationId = `conv-${Date.now()}`;
    
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'Új beszélgetés',
      createdAt: new Date().toISOString(),
      messages: [],
    };
    
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setActiveConversationId(newConversationId);
    setChatMessages([]);
    
    // Mentjük a localStorage-ba
    if (typeof window !== 'undefined' && clientId && agentId) {
      localStorage.setItem(
        `${clientId}-${agentId}-conversations`, 
        JSON.stringify(updatedConversations)
      );
    }
    
    // Bezárjuk a beszélgetési előzményeket
    setShowConversationHistory(false);
  };

  /**
   * Váltás másik beszélgetésre
   */
  const switchConversation = (conversationId: string) => {
    // Megkeressük a kiválasztott beszélgetést
    const selectedConversation = conversations.find(conv => conv.id === conversationId);
    
    if (selectedConversation) {
      setActiveConversationId(conversationId);
      setChatMessages(selectedConversation.messages);
      
      // Bezárjuk a beszélgetési előzményeket
      setShowConversationHistory(false);
    }
  };

  // Betöltés közben
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Ha nem találtuk meg az agent-et
  if (!agent) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Agent nem található</h2>
        <p className="text-gray-400 mb-6">A keresett agent nem létezik vagy nem érhető el.</p>
        <Link
          href={`/dashboard/${clientId}`}
          className="px-4 py-2 bg-accent hover:bg-opacity-90 rounded-md transition-colors"
        >
          Vissza a Dashboard-ra
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      {/* Üveg hatású fejléc */}
      <header className="glass-header p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/${clientId}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="inline-block mr-2">←</span> Vissza
            </Link>
            <h1 className="text-2xl font-bold font-serif truncate">{agent.name}</h1>
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
        </div>
      </header>

      {/* Agent információk */}
      <div className="bg-dark-surface p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="text-gray-400">{agent.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Típus: {agent.type} | Létrehozva: {new Date(agent.createdAt).toLocaleDateString('hu')}
                {agent.lastActive && ` | Utoljára aktív: ${new Date(agent.lastActive).toLocaleString('hu')}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConversationHistory(!showConversationHistory)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-sm"
              >
                Előzmények {showConversationHistory ? '↑' : '↓'}
              </button>
              <button
                onClick={startNewConversation}
                className="px-3 py-1 bg-accent hover:bg-opacity-90 rounded-md transition-colors text-sm"
              >
                Új beszélgetés
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Beszélgetési előzmények (csak ha láthatók) */}
      {showConversationHistory && (
        <div className="bg-dark-surface border-t border-gray-800 p-4">
          <div className="container mx-auto">
            <h3 className="text-lg font-semibold mb-3">Beszélgetési előzmények</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => switchConversation(conv.id)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    activeConversationId === conv.id
                      ? 'bg-gray-700'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <h4 className="font-medium truncate">{conv.title}</h4>
                  <p className="text-xs text-gray-400">
                    {new Date(conv.createdAt).toLocaleString('hu')} • {conv.messages.length} üzenet
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat terület */}
      <main className="flex-grow container mx-auto p-4 mb-20">
        <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-300px)]">
          {/* Chat üzenetek */}
          <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p className="mb-2">Még nincs üzenet ebben a beszélgetésben.</p>
                <p>Kezdjen el beszélgetni az agenttel az alábbi mezőben.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-[70%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-accent text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString('hu')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Üzenet input */}
          <div className="p-4 border-t border-gray-800">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Írja be üzenetét..."
                disabled={sending}
                className="flex-grow p-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-4 py-2 bg-accent hover:bg-opacity-90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Küldés...' : 'Küldés'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Lábléc a copyright szöveggel */}
      <Footer />
    </div>
  );
} 