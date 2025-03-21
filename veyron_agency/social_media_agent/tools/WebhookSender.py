from agency_swarm.tools import BaseTool
from pydantic import Field
import os
from dotenv import load_dotenv
import requests
import json
import sys
import re

load_dotenv()  # Környezeti változók betöltése

webhook_url = os.getenv("WEBHOOK_URL")

class WebhookSender(BaseTool):
    """
    Ez az eszköz a kész ingatlan posztokat és a hozzájuk tartozó képek URL-jeit 
    elküldi egy megadott webhook URL-re további feldolgozásra.
    """
    
    post_content: str = Field(
        ..., description="A generált poszt tartalma, amit el szeretnénk küldeni"
    )
    
    property_name: str = Field(
        ..., description="Az ingatlan neve vagy azonosítója, segít a nyilvántartásban"
    )
    
    image_urls: list = Field(
        default=[], description="A poszthoz csatolandó képek URL-jeinek listája az ImgBB-ről"
    )
    
    hashtags: str = Field(
        default="", description="Előre kinyert hashtagek a posztból"
    )
    
    def run(self):
        """
        Elküldi a posztot és a képek URL-jeit a megadott webhook URL-re.
        A hashtegeket külön változóban küldi el.
        A képeket 9 különálló változóban küldi el (kep1-kep9).
        """
        if not webhook_url:
            return "Hiba: WEBHOOK_URL környezeti változó nincs beállítva."
        
        try:
            # Ha nincs előre megadva hashtag, akkor kinyerjük a posztból
            if not self.hashtags:
                hashtags = " ".join(re.findall(r'#\w+', self.post_content))
            else:
                hashtags = self.hashtags
            
            # Hashtagek eltávolítása a tartalomból
            content_without_hashtags = re.sub(r'#\w+\s*', '', self.post_content).strip()
            
            # Képek URL-jeinek beállítása kep1-kep9 változókba
            image_variables = {}
            for i in range(1, 10):  # 1-től 9-ig
                key = f"kep{i}"
                if i <= len(self.image_urls):
                    image_variables[key] = self.image_urls[i-1]
                else:
                    image_variables[key] = ""
            
            # Képek száma
            image_count = len(self.image_urls)
            
            # Hozzuk létre a webhook payload objektumot (hashtagek külön, képek külön változókban)
            webhook_data = {
                "property_name": self.property_name,
                "content": content_without_hashtags,
                "hashtags": hashtags,
                "image_count": image_count,  # Képek száma
                **image_variables  # kep1, kep2, ..., kep9 változók
            }
            
            # Küldjük el a webhook-ra
            response = requests.post(
                webhook_url, 
                json=webhook_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code >= 200 and response.status_code < 300:
                return {
                    "status": "success",
                    "message": f"A poszt sikeresen el lett küldve a webhook URL-re! Státuszkód: {response.status_code}",
                    "response": response.text
                }
            else:
                return {
                    "status": "error",
                    "message": f"Hiba a webhook küldése során! Státuszkód: {response.status_code}",
                    "response": response.text
                }
                
        except Exception as e:
            return f"Hiba: {str(e)}"

if __name__ == "__main__":
    # Teszt futtatása vagy parancssori argumentumok kezelése
    if len(sys.argv) > 1:
        try:
            # Paraméterek beolvasása fájlból
            params_file_path = sys.argv[1]
            with open(params_file_path, 'r', encoding='utf-8') as f:
                params = json.load(f)
            
            # Paraméterek kinyerése
            post_content = params.get('post_content', '')
            property_name = params.get('property_name', '')
            image_urls = params.get('image_urls', [])
            hashtags = params.get('hashtags', '')
            
            # Tool példányosítása
            sender = WebhookSender(
                post_content=post_content,
                property_name=property_name,
                image_urls=image_urls,
                hashtags=hashtags
            )
            result = sender.run()
            print(json.dumps(result) if isinstance(result, dict) else result)
        except Exception as e:
            print(json.dumps({
                "status": "error",
                "message": str(e)
            }))
    else:
        # Teszt futtatása
        sender = WebhookSender(
            post_content="Exkluzív villa a II. kerületben! Gyönyörű kilátás a városra. #luxusingatlan #Budapest",
            property_name="Rózsadomb Villa",
            image_urls=["https://i.ibb.co/example1.jpg", "https://i.ibb.co/example2.jpg"]
        )
        print(sender.run()) 