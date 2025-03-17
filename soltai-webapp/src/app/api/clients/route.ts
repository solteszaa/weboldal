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

// Veyron kliens adatok
const VEYRON_CLIENT: Client = {
  id: 'veyron',
  name: 'Veyron Hungary',
  email: 'info@veyron.hu',
  createdAt: '2024-03-17T00:00:00Z',
};

// Kliensek mappájának elérési útja
const CLIENTS_DIR = path.join(process.cwd(), 'clients');
const VEYRON_DIR = path.join(CLIENTS_DIR, 'veyron');

// Segédfüggvény a Veyron könyvtár létrehozásához, ha nem létezik
function ensureVeyronDirectory() {
  if (!fs.existsSync(VEYRON_DIR)) {
    fs.mkdirSync(VEYRON_DIR, { recursive: true });
    
    // Alkönyvtárak létrehozása
    const subDirs = ['agents', 'data', 'automations'];
    subDirs.forEach(dir => {
      fs.mkdirSync(path.join(VEYRON_DIR, dir), { recursive: true });
    });
    
    // Metaadatok mentése
    fs.writeFileSync(
      path.join(VEYRON_DIR, 'metadata.json'),
      JSON.stringify(VEYRON_CLIENT, null, 2)
    );
  }
}

// GET /api/clients
export async function GET() {
  try {
    ensureVeyronDirectory();
    return NextResponse.json([VEYRON_CLIENT]);
  } catch (error) {
    console.error('Hiba a kliens adatok lekérése közben:', error);
    return NextResponse.json({ error: 'Hiba a kliens adatok lekérése közben' }, { status: 500 });
  }
}

// POST /api/clients - ez a végpont most csak a Veyron adatok frissítésére szolgál
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
    
    ensureVeyronDirectory();
    
    // Frissített adatok
    const updatedClient = {
      ...VEYRON_CLIENT,
      name,
      email,
      updatedAt: new Date().toISOString(),
    };
    
    // Metaadatok mentése
    fs.writeFileSync(
      path.join(VEYRON_DIR, 'metadata.json'),
      JSON.stringify(updatedClient, null, 2)
    );
    
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Hiba a kliens adatok frissítése közben:', error);
    return NextResponse.json({ error: 'Hiba a kliens adatok frissítése közben' }, { status: 500 });
  }
} 