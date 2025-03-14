import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Kliensek mappájának elérési útja
const CLIENTS_DIR = path.join(process.cwd(), 'clients');

// POST /api/agents/[agentId]/chat
export async function POST(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params;
    const body = await request.json();
    const { message, clientId } = body;

    if (!message || !clientId) {
      return NextResponse.json(
        { error: 'Hiányzó kötelező mezők (message, clientId)' },
        { status: 400 }
      );
    }

    // Demó agent esetén visszaadjuk a demó választ
    if (agentId.startsWith('agent-') && clientId === 'demo') {
      // Egyszerű válaszok a demó agentektől
      let response = '';
      
      if (agentId === 'agent-1') {
        response = `Email Asszisztens válasza: "${message}" üzenetre:\n\nKöszönöm az üzenetet! Kategorizáltam és feldolgoztam a kérést. Hamarosan válaszolok a részletekkel kapcsolatban.`;
      } else if (agentId === 'agent-2') {
        response = `Adatelemző válasza: "${message}" üzenetre:\n\nElemeztem a kérést. Az adatok alapján a következő trendeket azonosítottam: növekvő felhasználói aktivitás, csökkenő költségek, javuló konverziós ráta. Részletes jelentést készítek.`;
      } else if (agentId === 'agent-3') {
        response = `Ütemező Bot válasza: "${message}" üzenetre:\n\nÜtemeztem a kért eseményt. Emlékeztetőt állítottam be a határidő előtt 24 órával. A résztvevőket értesítettem.`;
      } else {
        response = `Ismeretlen agent válasza: "${message}" üzenetre:\n\nKöszönöm az üzenetet! Feldolgoztam a kérést és hamarosan válaszolok.`;
      }

      // Frissítsük az agent utolsó aktivitási idejét
      return NextResponse.json({ response, timestamp: new Date().toISOString() });
    }

    // Valós esetben itt hívnánk meg a Python AI agentet
    // Ez egy példa implementáció, ami csak visszaadja a kapott üzenetet
    
    // Ellenőrizzük, hogy létezik-e az agent
    let agentFound = false;
    let agentName = 'Ismeretlen Agent';
    
    // Keressük meg az agent mappáját
    const clientDir = path.join(CLIENTS_DIR, clientId);
    if (fs.existsSync(clientDir)) {
      const agentsDir = path.join(clientDir, 'agents');
      if (fs.existsSync(agentsDir)) {
        const agentDir = path.join(agentsDir, agentId);
        if (fs.existsSync(agentDir)) {
          agentFound = true;
          
          // Olvassuk ki az agent nevét a metaadatokból
          const metadataPath = path.join(agentDir, 'metadata.json');
          if (fs.existsSync(metadataPath)) {
            try {
              const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
              agentName = metadata.name;
              
              // Frissítsük az agent utolsó aktivitási idejét
              metadata.lastActive = new Date().toISOString();
              fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            } catch (error) {
              console.error('Hiba az agent metaadatok olvasása közben:', error);
            }
          }
        }
      }
    }
    
    if (!agentFound) {
      return NextResponse.json(
        { error: 'A megadott agent nem található' },
        { status: 404 }
      );
    }
    
    // Itt lenne a valós AI agent hívás
    // Példa válasz:
    const response = `${agentName} válasza: "${message}" üzenetre:\n\nKöszönöm az üzenetet! Feldolgoztam a kérést és hamarosan válaszolok a részletekkel kapcsolatban.`;
    
    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Hiba az agenttel való kommunikáció közben:', error);
    return NextResponse.json(
      { error: 'Hiba az agenttel való kommunikáció közben' },
      { status: 500 }
    );
  }
} 