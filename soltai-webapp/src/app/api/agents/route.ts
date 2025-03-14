import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Agent adatok típusa
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive';
  clientId: string;
  lastActive?: string;
  createdAt: string;
}

// Kliensek mappájának elérési útja
const CLIENTS_DIR = path.join(process.cwd(), 'clients');

// GET /api/agents?clientId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Hiányzó clientId paraméter' },
        { status: 400 }
      );
    }

    // Demó kliens esetén visszaadjuk a demó adatokat
    if (clientId === 'demo') {
      return NextResponse.json([
        {
          id: 'agent-1',
          name: 'Email Asszisztens',
          description: 'Automatikusan kategorizálja és válaszol az egyszerű emailekre.',
          type: 'Kommunikációs',
          status: 'active',
          clientId: 'demo',
          lastActive: '2023-03-13T10:30:00Z',
          createdAt: '2023-01-15T08:00:00Z',
        },
        {
          id: 'agent-2',
          name: 'Adatelemző',
          description: 'Kimutatásokat készít és trendeket elemez a cég adataiból.',
          type: 'Elemző',
          status: 'active',
          clientId: 'demo',
          lastActive: '2023-03-12T15:45:00Z',
          createdAt: '2023-01-20T10:15:00Z',
        },
        {
          id: 'agent-3',
          name: 'Ütemező Bot',
          description: 'Találkozókat szervez és emlékeztetőket küld a határidőkről.',
          type: 'Szervező',
          status: 'inactive',
          clientId: 'demo',
          createdAt: '2023-02-05T14:30:00Z',
        },
      ]);
    }

    // Ellenőrizzük, hogy létezik-e a kliens mappa
    const clientDir = path.join(CLIENTS_DIR, clientId);
    if (!fs.existsSync(clientDir)) {
      return NextResponse.json(
        { error: 'A megadott kliens nem létezik' },
        { status: 404 }
      );
    }

    // Olvassuk ki az agenteket a kliens mappájából
    const agentsDir = path.join(clientDir, 'agents');
    if (!fs.existsSync(agentsDir)) {
      return NextResponse.json([]);
    }

    // Valós alkalmazásban itt adatbázisból olvasnánk ki az adatokat
    // Ebben a példában az agent mappákat olvassuk ki a fájlrendszerből
    const agentDirs = fs.readdirSync(agentsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const agents: Agent[] = [];

    // Minden agent mappából kiolvassuk a metaadatokat
    for (const dir of agentDirs) {
      const metadataPath = path.join(agentsDir, dir, 'metadata.json');
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          agents.push(metadata);
        } catch (error) {
          console.error(`Hiba az agent metaadatok olvasása közben (${dir}):`, error);
        }
      }
    }

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Hiba az agentek lekérése közben:', error);
    return NextResponse.json(
      { error: 'Hiba az agentek lekérése közben' },
      { status: 500 }
    );
  }
}

// POST /api/agents
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, type, clientId } = body;

    if (!name || !description || !type || !clientId) {
      return NextResponse.json(
        { error: 'Hiányzó kötelező mezők (név, leírás, típus, clientId)' },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy létezik-e a kliens mappa
    const clientDir = path.join(CLIENTS_DIR, clientId);
    if (!fs.existsSync(clientDir)) {
      return NextResponse.json(
        { error: 'A megadott kliens nem létezik' },
        { status: 404 }
      );
    }

    // Generáljunk egy egyedi azonosítót az agentnek
    const id = `agent-${Date.now()}`;
    
    // Új agent könyvtár létrehozása
    const agentsDir = path.join(clientDir, 'agents');
    if (!fs.existsSync(agentsDir)) {
      fs.mkdirSync(agentsDir, { recursive: true });
    }
    
    const agentDir = path.join(agentsDir, id);
    fs.mkdirSync(agentDir, { recursive: true });
    
    // Alkönyvtárak létrehozása az agenthez
    const subDirs = ['tools', 'data'];
    subDirs.forEach(dir => {
      fs.mkdirSync(path.join(agentDir, dir), { recursive: true });
    });
    
    // Metaadatok létrehozása
    const metadata: Agent = {
      id,
      name,
      description,
      type,
      status: 'inactive', // Kezdetben inaktív
      clientId,
      createdAt: new Date().toISOString(),
    };
    
    // Metaadatok mentése
    fs.writeFileSync(
      path.join(agentDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    // Létrehozzuk az alap fájlokat az agenthez
    fs.writeFileSync(
      path.join(agentDir, 'instructions.md'),
      `# ${name} Agent\n\n## Leírás\n\n${description}\n\n## Típus\n\n${type}\n\n## Utasítások\n\nAz agent utasításai ide kerülnek.`
    );
    
    return NextResponse.json(metadata, { status: 201 });
  } catch (error) {
    console.error('Hiba az agent létrehozása közben:', error);
    return NextResponse.json(
      { error: 'Hiba az agent létrehozása közben' },
      { status: 500 }
    );
  }
} 