import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    // Kérés adatainak kiolvasása
    const body = await req.json();
    const {
      property_type,
      location,
      size,
      rooms,
      price,
      special_features = "",
      property_name,
      image_urls = []
    } = body;

    // Validáció - alapvető adatok megléte
    if (!property_type || !location || !size || !rooms || !price || !property_name) {
      return NextResponse.json(
        { error: "Hiányzó kötelező mezők" },
        { status: 400 }
      );
    }

    // A hangnem mindig professzionális
    const tone = "professional";

    try {
      // Windows-kompatibilis Python futtatás
      const isWindows = process.platform === 'win32';
      
      // Windows-specifikus vagy általános parancs létrehozása
      let generatedPost = '';
      
      // Path normalizálása és helyes elválasztók használata - egy szinttel feljebb megyünk
      const OpenAIPostGeneratorPath = path.normalize(`${process.cwd()}/../veyron_agency/content_agent/tools/OpenAIPostGenerator.py`);
      
      try {
        // Python interpretert hívunk
        // Létrehozunk ideiglenes adatfájlt a paraméterek átadásához
        const postParamsPath = path.normalize(`${process.cwd()}/../temp_post_params.json`);
        const postParams = {
          property_type,
          location,
          size,
          rooms,
          price,
          special_features,
          tone
        };
        
        // Paraméterek mentése fájlba
        await fs.writeFile(postParamsPath, JSON.stringify(postParams), 'utf-8');
        
        // Python script meghívása fájl paraméterrel
        const generatePostCommand = `python "${OpenAIPostGeneratorPath}" "${postParamsPath}"`;
        console.log("Executing command:", generatePostCommand);
        
        const { stdout: postOutput } = await execPromise(generatePostCommand);
        const postResult = JSON.parse(postOutput);
        
        if (postResult.status === "success") {
          generatedPost = postResult.generated_post;
        } else {
          console.error("Poszt generálási hiba:", postResult);
          return NextResponse.json(
            { error: "Hiba történt a poszt generálása során", details: postResult },
            { status: 500 }
          );
        }
      } catch (e: any) {
        console.error("Hiba a generátor futtatása közben:", e);
        return NextResponse.json(
          { error: "Hiba történt a poszt generátora futtatása során", details: e.message },
          { status: 500 }
        );
      }
      
      // PostPublisher kód futtatása
      try {
        // Létrehozunk ideiglenes adatfájlt a paraméterek átadásához
        const publishParamsPath = path.normalize(`${process.cwd()}/../temp_publish_params.json`);
        const publishParams = {
          post_content: generatedPost,
          property_name,
          image_urls
        };
        
        // Paraméterek mentése fájlba
        await fs.writeFile(publishParamsPath, JSON.stringify(publishParams), 'utf-8');
        
        // Python script meghívása fájl paraméterrel
        const PostPublisherPath = path.normalize(`${process.cwd()}/../veyron_agency/social_media_agent/tools/PostPublisher.py`);
        const publishPostCommand = `python "${PostPublisherPath}" "${publishParamsPath}"`;
        console.log("Publishing post...");
        
        const { stdout: publishOutput } = await execPromise(publishPostCommand);
        const publishResult = JSON.parse(publishOutput);
        
        // Webhook küldés helyett visszatérünk a generált poszttal és minden adattal
        // Sikeres válasz
        return NextResponse.json({
          success: true,
          message: "A poszt sikeresen létrehozva",
          post: {
            content: generatedPost,
            property_name: property_name,
            created_at: new Date().toISOString(),
            status: "ready",
            image_urls: image_urls
          },
          publish_result: publishResult
        });
      } catch (pubError: any) {
        console.error("Hiba a poszt közzététele során:", pubError);
        return NextResponse.json(
          { error: "Hiba történt a poszt mentése során", details: pubError.message },
          { status: 500 }
        );
      }
    } catch (pyError: any) {
      console.error("Python futtatási hiba:", pyError);
      return NextResponse.json(
        { error: "Hiba történt a Python kód futtatása során", details: pyError.message },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Általános hiba történt:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba';
    return NextResponse.json(
      { error: "Belső szerverhiba", details: errorMessage },
      { status: 500 }
    );
  }
}

// GET végpont a korábban generált posztok lekérdezéséhez
export async function GET() {
  try {
    const postsFilePath = path.normalize(path.join(process.cwd(), '../veyron_agency/social_media_posts/all_posts.json'));
    
    // Ellenőrizzük, hogy létezik-e a fájl
    try {
      await fs.access(postsFilePath);
    } catch (e) {
      // Ha a fájl nem létezik, üres listát adunk vissza
      return NextResponse.json({ posts: [] });
    }
    
    // Fájl beolvasása
    const postsData = await fs.readFile(postsFilePath, 'utf-8');
    const posts = JSON.parse(postsData);
    
    return NextResponse.json({ posts });
  } catch (error: unknown) {
    console.error("Hiba történt a posztok lekérdezése során:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba';
    return NextResponse.json(
      { error: "Belső szerverhiba", details: errorMessage },
      { status: 500 }
    );
  }
} 