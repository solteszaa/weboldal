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
  lastActive?: string;
  createdAt: string;
}

// Veyron alapértelmezett agentek
const DEFAULT_VEYRON_AGENTS: Agent[] = [
  {
    id: 'ceo-agent',
    name: 'CEO Agent',
    description: 'Koordinálja és felügyeli a többi agent működését.',
    type: 'Vezető',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: '2024-03-17T00:00:00Z',
  },
  {
    id: 'content-agent',
    name: 'Content Agent',
    description: 'Tartalom generálás és kezelés.',
    type: 'Tartalom',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: '2024-03-17T00:00:00Z',
  },
  {
    id: 'media-agent',
    name: 'Media Agent',
    description: 'Média tartalmak kezelése és optimalizálása.',
    type: 'Média',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: '2024-03-17T00:00:00Z',
  }
];

// Veyron mappa elérési útja
const VEYRON_DIR = path.join(process.cwd(), 'clients', 'veyron');
const AGENTS_DIR = path.join(VEYRON_DIR, 'agents');

// Segédfüggvény a Veyron agents mappa létrehozásához
function ensureVeyronAgentsDirectory() {
  if (!fs.existsSync(AGENTS_DIR)) {
    fs.mkdirSync(AGENTS_DIR, { recursive: true });
    
    // Alapértelmezett agentek létrehozása
    DEFAULT_VEYRON_AGENTS.forEach(agent => {
      const agentDir = path.join(AGENTS_DIR, agent.id);
      fs.mkdirSync(agentDir, { recursive: true });
      
      // Alkönyvtárak létrehozása
      ['tools', 'data'].forEach(dir => {
        fs.mkdirSync(path.join(agentDir, dir), { recursive: true });
      });
      
      // Metaadatok mentése
      fs.writeFileSync(
        path.join(agentDir, 'metadata.json'),
        JSON.stringify(agent, null, 2)
      );
      
      // Instructions fájl létrehozása
      fs.writeFileSync(
        path.join(agentDir, 'instructions.md'),
        `# ${agent.name}\n\n## Leírás\n\n${agent.description}\n\n## Típus\n\n${agent.type}\n\n## Utasítások\n\nAz agent specifikus utasításai ide kerülnek.`
      );
    });
  }
}

// GET /api/agents
export async function GET() {
  try {
    ensureVeyronAgentsDirectory();
    
    // Olvassuk ki az agenteket
    const agents: Agent[] = [];
    const agentDirs = fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Minden agent mappából kiolvassuk a metaadatokat
    for (const dir of agentDirs) {
      const metadataPath = path.join(AGENTS_DIR, dir, 'metadata.json');
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
    return NextResponse.json({ error: 'Hiba az agentek lekérése közben' }, { status: 500 });
  }
}

// POST /api/agents - Új agent létrehozása vagy meglévő frissítése
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, type } = body;
    
    if (!name || !description || !type) {
      return NextResponse.json(
        { error: 'Hiányzó kötelező mezők (név, leírás, típus)' },
        { status: 400 }
      );
    }
    
    ensureVeyronAgentsDirectory();
    
    // Generáljunk egy egyedi azonosítót az új agentnek
    const id = `agent-${Date.now()}`;
    const agentDir = path.join(AGENTS_DIR, id);
    
    // Létrehozzuk az agent könyvtárat és alkönyvtárakat
    fs.mkdirSync(agentDir, { recursive: true });
    ['tools', 'data'].forEach(dir => {
      fs.mkdirSync(path.join(agentDir, dir), { recursive: true });
    });
    
    // Új agent metaadatok
    const newAgent: Agent = {
      id,
      name,
      description,
      type,
      status: 'inactive',
      createdAt: new Date().toISOString(),
    };
    
    // Metaadatok mentése
    fs.writeFileSync(
      path.join(agentDir, 'metadata.json'),
      JSON.stringify(newAgent, null, 2)
    );
    
    // Instructions fájl létrehozása
    fs.writeFileSync(
      path.join(agentDir, 'instructions.md'),
      `# ${name}\n\n## Leírás\n\n${description}\n\n## Típus\n\n${type}\n\n## Utasítások\n\nAz agent specifikus utasításai ide kerülnek.`
    );
    
    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error('Hiba az agent létrehozása közben:', error);
    return NextResponse.json({ error: 'Hiba az agent létrehozása közben' }, { status: 500 });
  }
} 