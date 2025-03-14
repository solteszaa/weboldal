from agency_swarm.tools import BaseTool
from pydantic import Field
import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()  # környezeti változók betöltése

class ImgBBUploader(BaseTool):
    """
    Eszköz képek feltöltésére az ImgBB szolgáltatásra.
    A feltöltött képekhez tartozó URL-eket ad vissza.
    """
    
    image_path: str = Field(
        ..., description="A feltöltendő kép elérési útja a helyi rendszeren."
    )
    
    image_name: str = Field(
        ..., description="A kép neve, amit az ImgBB-n meg fog kapni."
    )
    
    def run(self):
        """
        Feltölti a megadott képet az ImgBB-re és visszaadja a hozzá tartozó URL-eket.
        """
        imgbb_api_key = os.getenv("IMGBB_API_KEY")
        
        if not imgbb_api_key:
            return "Hiba: Az IMGBB_API_KEY környezeti változó nincs beállítva."
        
        # Ellenőrizzük, hogy a fájl létezik-e
        if not os.path.exists(self.image_path):
            return f"Hiba: A kép nem található a megadott elérési úton: {self.image_path}"
        
        try:
            # A kép Base64 kódolása
            with open(self.image_path, "rb") as file:
                image_data = base64.b64encode(file.read()).decode("utf-8")
            
            # ImgBB API endpoint
            url = "https://api.imgbb.com/1/upload"
            
            # Kérés küldése
            payload = {
                "key": imgbb_api_key,
                "image": image_data,
                "name": self.image_name
            }
            
            response = requests.post(url, payload)
            data = response.json()
            
            # Válasz ellenőrzése
            if response.status_code == 200 and data["success"]:
                result = {
                    "success": True,
                    "image_url": data["data"]["url"],
                    "thumbnail_url": data["data"]["thumb"]["url"],
                    "delete_url": data["data"]["delete_url"],
                    "page_url": data["data"]["url_viewer"]
                }
                return str(result)
            else:
                return f"Hiba a feltöltés során: {data.get('error', {}).get('message', 'Ismeretlen hiba')}"
        
        except Exception as e:
            return f"Hiba történt: {str(e)}"

if __name__ == "__main__":
    # Teszt eset
    # Megjegyzés: Először állítsd be az IMGBB_API_KEY környezeti változót
    test_image_path = "test_image.jpg"  # Ezt helyettesítsd egy valódi kép elérési útjával a teszteléshez
    
    # Csak akkor futtasd, ha a teszt kép létezik
    if os.path.exists(test_image_path):
        tool = ImgBBUploader(image_path=test_image_path, image_name="test_upload")
        print(tool.run())
    else:
        print(f"Teszt futtatásához helyezd el a {test_image_path} fájlt a megfelelő helyen.") 