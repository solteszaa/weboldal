from agency_swarm.tools import BaseTool
from pydantic import Field
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()  # környezeti változók betöltése

class WebhookSender(BaseTool):
    """
    Eszköz adatok küldésére egy webhook URL-re.
    Az adatokat JSON formátumban küldi el.
    """
    
    post_content: str = Field(
        ..., description="A poszthoz tartozó szöveges tartalom."
    )
    
    image_urls: list = Field(
        ..., description="A poszthoz tartozó képek URL-jeinek listája."
    )
    
    def run(self):
        """
        Elküldi a poszt tartalmát és a képek URL-jeit a beállított webhook-ra.
        """
        webhook_url = os.getenv("WEBHOOK_URL")
        
        if not webhook_url:
            return "Hiba: A WEBHOOK_URL környezeti változó nincs beállítva."
        
        try:
            # Az adatok előkészítése
            payload = {
                "post_content": self.post_content,
                "image_urls": self.image_urls,
                "timestamp": self._get_current_timestamp()
            }
            
            # Kérés küldése a webhookra
            headers = {
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                webhook_url,
                data=json.dumps(payload),
                headers=headers
            )
            
            # Válasz ellenőrzése
            if response.status_code >= 200 and response.status_code < 300:
                return f"Sikeres küldés! Státuszkód: {response.status_code}"
            else:
                return f"Hiba a küldés során: Státuszkód {response.status_code}, Válasz: {response.text}"
        
        except Exception as e:
            return f"Hiba történt: {str(e)}"
    
    def _get_current_timestamp(self):
        """
        Az aktuális időbélyeg lekérése.
        """
        from datetime import datetime
        return datetime.now().isoformat()

if __name__ == "__main__":
    # Teszt eset
    # Megjegyzés: Először állítsd be a WEBHOOK_URL környezeti változót
    test_post_content = "Ez egy teszt luxusingatlan hirdetés!"
    test_image_urls = ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    
    tool = WebhookSender(post_content=test_post_content, image_urls=test_image_urls)
    print(tool.run()) 