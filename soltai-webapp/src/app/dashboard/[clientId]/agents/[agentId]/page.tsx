'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Agent interfész
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

// Chat üzenet interfész
interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

// Beszélgetés interfész
interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export default function AgentDetailPage() {
  const { clientId, agentId } = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showConversationHistory, setShowConversationHistory] = useState(false);

  useEffect(() => {
    // Agent adatok betöltése
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

  // Üzenet küldése az agentnek
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
      // const response = await fetch(`/api/agents/${agentId}/chat`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: newMessage, clientId }),
      // });
      
      // if (!response.ok) throw new Error('Nem sikerült elküldeni az üzenetet');
      // const data = await response.json();
      
      // Demó válasz
      await new Promise(resolve => setTimeout(resolve, 1000)); // Szimulált késleltetés
      
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
      alert('Nem sikerült elküldeni az üzenetet. Kérjük, próbálja újra később.');
    } finally {
      setSending(false);
    }
  };

  // Új beszélgetés kezdése
  const startNewConversation = () => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'Új beszélgetés',
      createdAt: new Date().toISOString(),
      messages: []
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
  };

  // Beszélgetés váltása
  const switchConversation = (conversationId: string) => {
    const selectedConversation = conversations.find(conv => conv.id === conversationId);
    if (selectedConversation) {
      setActiveConversationId(conversationId);
      setChatMessages(selectedConversation.messages);
      setShowConversationHistory(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Agent nem található</h1>
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
      {/* Header */}
      <header className="bg-dark-surface p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/${clientId}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              &larr; Vissza
            </Link>
            <h1 className="text-2xl font-bold font-serif">{agent.name}</h1>
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
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Ügyfél: {clientId}</span>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
              Kijelentkezés
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 mb-16 flex-1 flex flex-col md:flex-row gap-6">
        {/* Agent információk */}
        <div className="w-full md:w-1/3">
          <div className="bg-dark-surface rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Agent Információk</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Leírás</h3>
                <p className="text-white">{agent.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Típus</h3>
                <p className="text-white">{agent.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Létrehozva</h3>
                <p className="text-white">{new Date(agent.createdAt).toLocaleString('hu')}</p>
              </div>
              {agent.lastActive && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Utoljára aktív</h3>
                  <p className="text-white">{new Date(agent.lastActive).toLocaleString('hu')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Beszélgetési előzmények */}
          <div className="bg-dark-surface rounded-lg p-6 shadow-lg mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Beszélgetési előzmények</h2>
              <button
                onClick={() => setShowConversationHistory(!showConversationHistory)}
                className="text-sm text-gray-400 hover:text-white"
              >
                {showConversationHistory ? 'Elrejtés' : 'Mutatás'}
              </button>
            </div>
            
            {showConversationHistory && (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => switchConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      activeConversationId === conv.id
                        ? 'bg-gray-800 text-white'
                        : 'hover:bg-gray-800 text-gray-400'
                    }`}
                  >
                    <div className="font-medium truncate">{conv.title}</div>
                    <div className="text-xs opacity-70">
                      {new Date(conv.createdAt).toLocaleString('hu')}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <button
              onClick={startNewConversation}
              className="mt-4 w-full py-2 px-4 bg-accent hover:bg-opacity-90 text-white rounded-md transition-colors"
            >
              + Új beszélgetés
            </button>
          </div>
        </div>

        {/* Chat felület */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="bg-dark-surface rounded-lg p-6 shadow-lg flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Beszélgetés az Agent-tel</h2>
              {activeConversationId && (
                <div className="text-sm text-gray-400">
                  {conversations.find(c => c.id === activeConversationId)?.title || 'Beszélgetés'}
                </div>
              )}
            </div>
            
            {/* Chat üzenetek */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p>Még nincs üzenet. Kezdjen el beszélgetni az agent-tel!</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-accent text-white'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString('hu')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Üzenet küldő form */}
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Írjon üzenetet..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                disabled={sending}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent hover:bg-opacity-90 text-white rounded-md transition-colors disabled:opacity-50"
                disabled={sending || !newMessage.trim()}
              >
                {sending ? 'Küldés...' : 'Küldés'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-dark-surface p-4 w-full">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SoltAI Solutions. Minden jog fenntartva.
        </div>
      </footer>
    </div>
  );
} 