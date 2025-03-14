from agency_swarm.tools import BaseTool
from pydantic import Field
import os
import openai
from dotenv import load_dotenv

load_dotenv()  # környezeti változók betöltése

class LuxuryRealEstatePostGenerator(BaseTool):
    """
    Eszköz luxusingatlan hirdetési posztok generálására az OpenAI API segítségével.
    """
    
    property_details: str = Field(
        ..., description="Az ingatlan részletes leírása (helyszín, méret, szobák, különleges jellemzők, stb.)."
    )
    
    style: str = Field(
        default="professzionális", 
        description="A generálandó szöveg stílusa (pl. professzionális, elegáns, modern, exkluzív)."
    )
    
    language: str = Field(
        default="magyar", 
        description="A generálandó poszt nyelve."
    )
    
    def run(self):
        """
        Luxusingatlan hirdetési poszt generálása az OpenAI API segítségével.
        """
        openai_api_key = os.getenv("OPENAI_API_KEY")
        
        if not openai_api_key:
            return "Hiba: Az OPENAI_API_KEY környezeti változó nincs beállítva."
        
        try:
            client = openai.OpenAI(api_key=openai_api_key)
            
            # Prompt összeállítása
            prompt = f"""
            Generálj egy meggyőző és részletes hirdetési szöveget egy luxus ingatlanhoz az alábbi stílusban: {self.style}.
            
            Az ingatlan részletei:
            {self.property_details}
            
            A szövegnek ki kell emelnie az ingatlan legkülönlegesebb tulajdonságait, luxus jellegét és exkluzivitását.
            A szöveg legyen csábító, de maradjon tényszerű és informatív.
            Ne tartalmazzon túlzó kijelentéseket vagy félrevezető információkat.
            A szöveg hossza ne legyen több mint 300 szó.
            
            A szöveg nyelvezete: {self.language}
            """
            
            # API kérés küldése
            response = client.chat.completions.create(
                model="gpt-4",  # vagy más megfelelő modell
                messages=[
                    {"role": "system", "content": "Professzionális luxusingatlan-marketing specialista vagy."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            # A generált szöveg visszaadása
            generated_post = response.choices[0].message.content.strip()
            return generated_post
            
        except Exception as e:
            return f"Hiba történt a poszt generálása során: {str(e)}"

if __name__ == "__main__":
    # Teszt eset
    # Megjegyzés: Először állítsd be az OPENAI_API_KEY környezeti változót
    test_property_details = """
    Budapest II. kerület, Rózsadomb, 450 m², 5 szoba, 3 fürdőszoba, panorámás kilátás a Dunára és a városra.
    Márványborítású fürdőszobák, olasz dizájner bútorok, okos otthon rendszer, medence, jacuzzi, privát kert,
    borospince, háromállásos garázs, 24 órás biztonsági szolgálat, teljes körű wellness részleg szaunával.
    """
    
    tool = LuxuryRealEstatePostGenerator(
        property_details=test_property_details,
        style="elegáns",
        language="magyar"
    )
    
    print(tool.run()) 