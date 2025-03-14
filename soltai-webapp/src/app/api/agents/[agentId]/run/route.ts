import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

// Kliensek mappájának elérési útja
const CLIENTS_DIR = path.join(process.cwd(), 'clients');

// POST /api/agents/[agentId]/run
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

    // Ellenőrizzük, hogy létezik-e az agent
    const clientDir = path.join(CLIENTS_DIR, clientId);
    const agentDir = path.join(clientDir, 'agents', agentId);
    
    if (!fs.existsSync(agentDir)) {
      return NextResponse.json(
        { error: 'A megadott agent nem található' },
        { status: 404 }
      );
    }

    // Ellenőrizzük, hogy létezik-e az agent.py fájl
    const agentFilePath = path.join(agentDir, 'agent.py');
    if (!fs.existsSync(agentFilePath)) {
      return NextResponse.json(
        { error: 'Az agent implementációja nem található' },
        { status: 404 }
      );
    }

    // Valós esetben itt futtatnánk a Python AI agentet
    // Ez egy példa implementáció, ami csak visszaadja a kapott üzenetet
    
    // Python script futtatása (valós alkalmazásban)
    // Megjegyzés: Ez a kód csak példa, valós alkalmazásban
    // biztonságosabb megoldást kell használni, például API-t
    // vagy izolált környezetet a Python kód futtatásához
    
    /*
    // Ez a kód valós környezetben futtatná a Python agentet
    // De itt csak kommentként szerepel, mert a demó környezetben nem futtatunk valós Python kódot
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [
        agentFilePath,
        '--message', message
      ]);
      
      let responseData = '';
      
      pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python hiba: ${data}`);
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return resolve(NextResponse.json(
            { error: `A Python script hibával tért vissza: ${code}` },
            { status: 500 }
          ));
        }
        
        return resolve(NextResponse.json({
          response: responseData,
          timestamp: new Date().toISOString()
        }));
      });
    });
    */
    
    // Frissítsük az agent utolsó aktivitási idejét
    const metadataPath = path.join(agentDir, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        metadata.lastActive = new Date().toISOString();
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      } catch (error) {
        console.error('Hiba az agent metaadatok frissítése közben:', error);
      }
    }
    
    // Demó válasz
    const response = `Agent válasza: "${message}" üzenetre:\n\nKöszönöm az üzenetet! Feldolgoztam a kérést és hamarosan válaszolok a részletekkel kapcsolatban.`;
    
    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Hiba az agent futtatása közben:', error);
    return NextResponse.json(
      { error: 'Hiba az agent futtatása közben' },
      { status: 500 }
    );
  }
} 