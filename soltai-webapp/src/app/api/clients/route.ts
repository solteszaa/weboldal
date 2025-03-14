import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Kliens adatok típusa
export interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Demó adatok - ezt majd fájlba vagy adatbázisba kell helyezni
const DEMO_CLIENTS: Client[] = [
  {
    id: 'demo',
    name: 'Demo Felhasználó',
    email: 'demo@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  },
];

// Kliensek mappájának elérési útja
const CLIENTS_DIR = path.join(process.cwd(), 'clients');

// Segédfüggvény a kliensek könyvtárának létrehozásához, ha nem létezik
function ensureClientsDirectory() {
  if (!fs.existsSync(CLIENTS_DIR)) {
    fs.mkdirSync(CLIENTS_DIR, { recursive: true });
  }
}

// GET /api/clients
export async function GET() {
  try {
    ensureClientsDirectory();
    
    // Valós alkalmazásban itt adatbázisból olvasnánk ki az adatokat
    // Ebben a példában a kliensek mappáit olvassuk ki a fájlrendszerből
    const clients = [...DEMO_CLIENTS];
    
    // Olvassuk ki a kliensek könyvtárait (kivéve a demo)
    const directories = fs.readdirSync(CLIENTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== 'demo')
      .map(dirent => dirent.name);
    
    // Minden létező könyvtárhoz hozzáadunk egy klienst
    for (const dir of directories) {
      // Itt olvashatnánk ki a kliens adatait egy metadata.json fájlból
      clients.push({
        id: dir,
        name: `${dir} Ügyfél`,
        email: `${dir}@example.com`,
        createdAt: new Date().toISOString(),
      });
    }
    
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Hiba a kliensek lekérése közben:', error);
    return NextResponse.json({ error: 'Hiba a kliensek lekérése közben' }, { status: 500 });
  }
}

// POST /api/clients
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Hiányzó kötelező mezők (név, email)' },
        { status: 400 }
      );
    }
    
    // Generáljunk egy egyedi azonosítót a kliensnek (valós alkalmazásban DB ID lenne)
    const id = `client-${Date.now()}`;
    
    ensureClientsDirectory();
    
    // Új kliens könyvtár létrehozása
    const clientDir = path.join(CLIENTS_DIR, id);
    fs.mkdirSync(clientDir, { recursive: true });
    
    // Alkönyvtárak létrehozása a klienshez
    const subDirs = ['agents', 'data', 'automations'];
    subDirs.forEach(dir => {
      fs.mkdirSync(path.join(clientDir, dir), { recursive: true });
    });
    
    // Metaadatok mentése (valós alkalmazásban DB-be mentődne)
    const metadata = {
      id,
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(
      path.join(clientDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    return NextResponse.json(metadata, { status: 201 });
  } catch (error) {
    console.error('Hiba a kliens létrehozása közben:', error);
    return NextResponse.json({ error: 'Hiba a kliens létrehozása közben' }, { status: 500 });
  }
} 