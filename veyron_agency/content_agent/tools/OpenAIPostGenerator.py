from agency_swarm.tools import BaseTool
from pydantic import Field
import os
from dotenv import load_dotenv
import openai
import json
import sys

load_dotenv()  # Környezeti változók betöltése

openai_api_key = os.getenv("OPENAI_API_KEY")

class OpenAIPostGenerator(BaseTool):
    """
    Ez az eszköz az OpenAI API segítségével generál vonzó ingatlan posztokat a közösségi médiára.
    A bemeneti ingatlan adatokat felhasználva személyre szabott, figyelemfelkeltő tartalmat hoz létre.
    """
    
    property_type: str = Field(
        ..., description="Az ingatlan típusa (pl. lakás, ház, villa, nyaraló stb.)"
    )
    
    location: str = Field(
        ..., description="Az ingatlan helye (pl. város, kerület, utca vagy környék)"
    )
    
    size: str = Field(
        ..., description="Az ingatlan mérete négyzetméterben"
    )
    
    rooms: str = Field(
        ..., description="Szobák száma és típusa (pl. 3 szoba + nappali, 2 fürdőszoba)"
    )
    
    price: str = Field(
        ..., description="Az ingatlan ára (HUF-ban, EUR-ban vagy USD-ban)"
    )
    
    special_features: str = Field(
        "", description="Az ingatlan különleges jellemzői és előnyei, vesszővel elválasztva (opcionális)"
    )
    
    tone: str = Field(
        "professional", description="A poszt hangneme (mindig professzionális)"
    )
    
    def run(self):
        """
        Generál egy ingatlan posztot az OpenAI API segítségével.
        """
        if not openai_api_key:
            return "Hiba: OPENAI_API_KEY környezeti változó nincs beállítva."
        
        try:
            # Beállítjuk az API kulcsot
            client = openai.OpenAI(api_key=openai_api_key)
            
            prompt = f"""
            Készíts egy vonzó, figyelemfelkeltő ingatlan hirdetést a következő adatok alapján:
            
            - Ingatlan típusa: {self.property_type}
            - Helyszín: {self.location}
            - Méret: {self.size} négyzetméter
            - Szobák: {self.rooms}
            - Ár: {self.price}
            - Különleges jellemzők: {self.special_features}
            
            A poszt professzionális hangnemben legyen megfogalmazva.
            A poszt legyen tömör, érdekes és tartalmazzon minden fontos információt.
            Használj emoji-kat, ahol megfelelő.
            Adj a poszthoz hashtageket.
            A poszt legyen magyar nyelvű.
            Hangsúlyozd a luxus és exkluzív aspektusokat, mivel ez a Veyron Hungary prémium ingatlanközvetítője.
            """
            
            # API hívás
            response = client.chat.completions.create(
                model="gpt-4",  # vagy más elérhető modell
                messages=[
                    {"role": "system", "content": "Te egy professzionális ingatlanügynök vagy, aki kifejezetten prémium és luxus ingatlanokkal foglalkozik. Kiválóan érted a magyar ingatlanpiac sajátosságait."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            # Válasz feldolgozása
            generated_post = response.choices[0].message.content.strip()
            
            return {
                "status": "success",
                "generated_post": generated_post
            }
                
        except Exception as e:
            return f"Hiba: {str(e)}"

if __name__ == "__main__":
    # Teszt futtatása vagy parancssori argumentumok kezelése
    if len(sys.argv) > 1:
        # Parancssori argumentumok használata
        property_type = sys.argv[1]
        location = sys.argv[2]
        size = sys.argv[3]
        rooms = sys.argv[4]
        price = sys.argv[5]
        special_features = sys.argv[6] if len(sys.argv) > 6 else ""
        tone = sys.argv[7] if len(sys.argv) > 7 else "professional"
        
        generator = OpenAIPostGenerator(
            property_type=property_type,
            location=location,
            size=size,
            rooms=rooms,
            price=price,
            special_features=special_features,
            tone=tone
        )
        result = generator.run()
        print(json.dumps(result) if isinstance(result, dict) else result)
    else:
        # Teszt
        generator = OpenAIPostGenerator(
            property_type="villa",
            location="Budapest, II. kerület",
            size="350",
            rooms="5 szoba + 3 fürdőszoba",
            price="650 000 000 Ft",
            special_features="medence, kert, panoráma kilátás, okosotthon, biztonsági rendszer",
            tone="professional"
        )
        print(generator.run()) 