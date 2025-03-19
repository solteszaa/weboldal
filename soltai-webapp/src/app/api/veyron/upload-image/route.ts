import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';
import axios from 'axios';

// ImgBB API kulcs a környezeti változókból
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export async function POST(request: NextRequest) {
  if (!IMGBB_API_KEY) {
    return NextResponse.json(
      { error: 'ImgBB API kulcs nincs konfigurálva a szerveren.' },
      { status: 500 }
    );
  }

  try {
    // Formdata kérés feldolgozása
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Nincs kép a kérésben.' },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy a fájl valóban kép
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'A feltöltött fájl nem kép.' },
        { status: 400 }
      );
    }

    // Fájl tartalmának kiolvasása
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Ideiglenes fájl létrehozása
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${uuidv4()}-${file.name}`);
    
    // Az ideiglenes fájl írása
    fs.writeFileSync(tempFilePath, buffer);
    
    // FormData létrehozása az ImgBB API-hoz
    const imgbbFormData = new FormData();
    imgbbFormData.append('key', IMGBB_API_KEY);
    imgbbFormData.append('image', fs.createReadStream(tempFilePath));
    
    // Kép feltöltése az ImgBB-re
    const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', imgbbFormData, {
      headers: {
        ...imgbbFormData.getHeaders(),
      }
    });
    
    // Ideiglenes fájl törlése
    fs.unlinkSync(tempFilePath);
    
    // Válasz a sikeres feltöltésről
    return NextResponse.json({
      success: true,
      url: imgbbResponse.data.data.url,
      display_url: imgbbResponse.data.data.display_url,
      thumbnail: imgbbResponse.data.data.thumb?.url || null,
    });
    
  } catch (error) {
    console.error('Hiba a kép feltöltése során:', error);
    return NextResponse.json(
      { error: 'Hiba történt a kép feltöltése során.' },
      { status: 500 }
    );
  }
}

// Nem engedjük a GET kéréseket
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 