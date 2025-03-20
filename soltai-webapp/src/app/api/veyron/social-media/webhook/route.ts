import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    // Kérés adatainak kiolvasása
    const body = await req.json();
    const {
      post_content,
      property_name,
      image_urls = []
    } = body;

    // Validáció - alapvető adatok megléte
    if (!post_content || !property_name) {
      return NextResponse.json(
        { error: "Hiányzó kötelező mezők" },
        { status: 400 }
      );
    }

    try {
      // Létrehozunk ideiglenes adatfájlt a paraméterek átadásához
      const webhookParamsPath = path.normalize(`${process.cwd()}/../temp_webhook_params.json`);
      const webhookParams = {
        post_content,
        property_name,
        image_urls
      };
      
      // Paraméterek mentése fájlba
      await fs.writeFile(webhookParamsPath, JSON.stringify(webhookParams), 'utf-8');
      
      // WebhookSender script meghívása
      const WebhookSenderPath = path.normalize(`${process.cwd()}/../veyron_agency/social_media_agent/tools/WebhookSender.py`);
      const webhookCommand = `python "${WebhookSenderPath}" "${webhookParamsPath}"`;
      
      const { stdout: webhookOutput } = await execPromise(webhookCommand);
      console.log("Webhook küldés eredménye:", webhookOutput);
      
      // Webhook válasz feldolgozása
      const webhookResult = JSON.parse(webhookOutput);
      
      // Sikeres válasz visszaküldése
      return NextResponse.json({
        success: true,
        message: "A poszt sikeresen elküldve a webhookra",
        webhook_result: webhookResult
      });
    } catch (error: any) {
      console.error("Webhook küldési hiba:", error);
      return NextResponse.json(
        { error: "Hiba történt a webhook küldése során", details: error.message },
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