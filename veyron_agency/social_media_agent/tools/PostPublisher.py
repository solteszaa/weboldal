from agency_swarm.tools import BaseTool
from pydantic import Field
import os
from dotenv import load_dotenv
import json
import datetime
import sys

load_dotenv()  # Környezeti változók betöltése

class PostPublisher(BaseTool):
    """
    Ez az eszköz a generált ingatlan posztokat és a hozzájuk tartozó képek URL-jeit elmenti 
    egy strukturált formátumban a Veyron Hungary dashboardon való megjelenítéshez.
    A rendszer később képes lehet automatikus publikálásra a megadott platformokon.
    """
    
    post_content: str = Field(
        ..., description="A generált poszt tartalma, amit publikálni szeretnénk"
    )
    
    property_name: str = Field(
        ..., description="Az ingatlan neve vagy azonosítója, segít a nyilvántartásban"
    )
    
    image_urls: list = Field(
        default=[], description="A poszthoz csatolandó képek URL-jeinek listája az ImgBB-ről"
    )
    
    scheduled_time: str = Field(
        "", description="Opcionális: a közzététel tervezett időpontja (ISO formátumban, pl. '2023-12-31T15:30:00')"
    )
    
    def run(self):
        """
        Elmenti a posztot és a képeket egy JSON fájlba a dashboardon való megjelenítéshez.
        """
        try:
            # Mappa létrehozása, ha még nem létezik
            os.makedirs("veyron_agency/social_media_posts", exist_ok=True)
            
            # Aktuális idő megszerzése fájlnévhez
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"veyron_agency/social_media_posts/post_{self.property_name.replace(' ', '_')}_{timestamp}.json"
            
            # Hozzuk létre a post objektumot
            post_data = {
                "property_name": self.property_name,
                "content": self.post_content,
                "image_urls": self.image_urls,
                "tone": "professional",  # A hangnem mindig professzionális
                "created_at": datetime.datetime.now().isoformat(),
                "scheduled_time": self.scheduled_time if self.scheduled_time else None,
                "status": "pending" if self.scheduled_time else "ready",
            }
            
            # Mentsük el JSON formátumban
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(post_data, f, ensure_ascii=False, indent=4)
            
            # Létrehozzuk a dashboard számára egy összes posztot tartalmazó közös fájlt is
            posts_summary_file = "veyron_agency/social_media_posts/all_posts.json"
            
            all_posts = []
            # Ha a fájl már létezik, olvassuk be a tartalmát
            if os.path.exists(posts_summary_file):
                try:
                    with open(posts_summary_file, "r", encoding="utf-8") as f:
                        all_posts = json.load(f)
                except Exception:
                    all_posts = []
            
            # Adjuk hozzá az új posztot
            all_posts.append(post_data)
            
            # Írjuk vissza a fájlt
            with open(posts_summary_file, "w", encoding="utf-8") as f:
                json.dump(all_posts, f, ensure_ascii=False, indent=4)
            
            return {
                "status": "success",
                "message": f"A poszt sikeresen el lett mentve! Fájl: {filename}",
                "filename": filename,
                "post_data": post_data
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
            scheduled_time = params.get('scheduled_time', '')
            
            # Tool példányosítása
            publisher = PostPublisher(
                post_content=post_content,
                property_name=property_name,
                image_urls=image_urls,
                scheduled_time=scheduled_time
            )
            result = publisher.run()
            print(json.dumps(result) if isinstance(result, dict) else result)
        except Exception as e:
            print(json.dumps({
                "status": "error",
                "message": str(e)
            }))
    else:
        # Teszt futtatása
        publisher = PostPublisher(
            post_content="Exkluzív villa a II. kerületben! 🏡 Gyönyörű kilátás a városra. #luxusingatlan #Budapest",
            property_name="Rózsadomb Villa",
            image_urls=["https://i.ibb.co/example1.jpg", "https://i.ibb.co/example2.jpg"],
            scheduled_time="2023-12-31T15:30:00"
        )
        print(publisher.run()) 