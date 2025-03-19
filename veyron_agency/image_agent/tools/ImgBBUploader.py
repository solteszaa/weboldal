from agency_swarm.tools import BaseTool
from pydantic import Field
import requests
import os
from dotenv import load_dotenv
import base64

load_dotenv()  # Környezeti változók betöltése

imgbb_api_key = os.getenv("IMGBB_API_KEY")

class ImgBBUploader(BaseTool):
    """
    Ez az eszköz képeket tölt fel az ImgBB szolgáltatásba és visszaadja a feltöltött kép URL-jét.
    Lehetővé teszi a felhasználók számára, hogy ingatlanokról készült képeket tároljanak online.
    """
    
    image_path: str = Field(
        ..., description="A feltöltendő kép teljes elérési útja a helyi fájlrendszeren."
    )
    
    expiration: int = Field(
        600, description="Az az idő másodpercekben, amennyi után a kép törlődik (0 = soha)."
    )
    
    def run(self):
        """
        Feltölti a képet az ImgBB-re és visszaadja az URL-t.
        """
        if not imgbb_api_key:
            return "Hiba: IMGBB_API_KEY környezeti változó nincs beállítva."
        
        try:
            with open(self.image_path, "rb") as file:
                image_data = file.read()
                base64_image = base64.b64encode(image_data).decode('utf-8')
            
            url = "https://api.imgbb.com/1/upload"
            payload = {
                "key": imgbb_api_key,
                "image": base64_image,
                "expiration": self.expiration
            }
            
            response = requests.post(url, payload)
            result = response.json()
            
            if response.status_code == 200 and result.get("success"):
                image_url = result["data"]["url"]
                display_url = result["data"]["display_url"]
                thumbnail_url = result["data"].get("thumb", {}).get("url", "")
                
                return {
                    "status": "success",
                    "image_url": image_url,
                    "display_url": display_url,
                    "thumbnail_url": thumbnail_url
                }
            else:
                error_message = result.get("error", {}).get("message", "Ismeretlen hiba")
                return f"Hiba a feltöltés során: {error_message}"
                
        except Exception as e:
            return f"Hiba: {str(e)}"

if __name__ == "__main__":
    # Teszt futtatása
    # Ehhez szükséges egy valós kép a megadott elérési úton
    test_image_path = "test_image.jpg"  # Cserélje le valós kép elérési útjára
    uploader = ImgBBUploader(image_path=test_image_path)
    print(uploader.run()) 