from agency_swarm.tools import BaseTool
from pydantic import Field
import os
from dotenv import load_dotenv

load_dotenv()  # Környezeti változók betöltése

class EmailClassifier(BaseTool):
    """
    Email osztályozó eszköz, amely elemzi és kategorizálja az emaileket.
    Az eszköz különböző kategóriákba sorolja az emaileket a tartalmuk alapján.
    """
    email_subject: str = Field(
        ..., description="Az email tárgya, amit elemezni kell."
    )
    email_body: str = Field(
        ..., description="Az email törzse, amit elemezni kell."
    )
    sender: str = Field(
        ..., description="Az email küldője."
    )

    def run(self):
        """
        Elemzi és kategorizálja az emailt a tárgya és tartalma alapján.
        Visszaadja a kategóriát és a javasolt műveletet.
        """
        # Egyszerű kategorizálási logika
        subject = self.email_subject.lower()
        body = self.email_body.lower()
        sender = self.sender.lower()
        
        # Kategóriák és kulcsszavak
        urgent_keywords = ["sürgős", "azonnal", "vészhelyzet", "határidő", "ma", "most"]
        important_keywords = ["fontos", "jelentés", "szerződés", "ajánlat", "megrendelés"]
        newsletter_keywords = ["hírlevél", "akció", "kedvezmény", "értesítés", "frissítés"]
        spam_keywords = ["nyeremény", "ingyenes", "nyertes", "gratulálunk", "klikk"]
        
        # Kategória meghatározása
        category = "Általános"  # Alapértelmezett kategória
        
        # Sürgős kategória ellenőrzése
        if any(keyword in subject for keyword in urgent_keywords) or \
           any(keyword in body.split()[:50] for keyword in urgent_keywords):
            category = "Sürgős"
        
        # Fontos kategória ellenőrzése
        elif any(keyword in subject for keyword in important_keywords) or \
             any(keyword in body.split()[:100] for keyword in important_keywords):
            category = "Fontos"
        
        # Hírlevél kategória ellenőrzése
        elif any(keyword in subject for keyword in newsletter_keywords) or \
             "unsubscribe" in body or "leiratkozás" in body:
            category = "Hírlevél"
        
        # Spam kategória ellenőrzése
        elif any(keyword in subject for keyword in spam_keywords) or \
             any(keyword in body.split()[:100] for keyword in spam_keywords) or \
             sender.endswith(("@spam.com", "@promo.net")):
            category = "Spam"
        
        # Javasolt művelet meghatározása
        action = ""
        if category == "Sürgős":
            action = "Azonnali figyelem szükséges. Értesítés küldése a felhasználónak."
        elif category == "Fontos":
            action = "Magas prioritással kezelendő. Előkészítés a felhasználó számára."
        elif category == "Általános":
            action = "Normál feldolgozás. Válasz generálása, ha szükséges."
        elif category == "Hírlevél":
            action = "Archiválás a megfelelő mappába. Nincs szükség azonnali válaszra."
        elif category == "Spam":
            action = "Spam mappába helyezés. Nincs szükség válaszra."
        
        return {
            "category": category,
            "action": action,
            "confidence": 0.85,  # Egyszerű konfidencia érték
            "analysis": f"Az email '{self.email_subject}' tárggyal a(z) {category} kategóriába lett sorolva. {action}"
        }

if __name__ == "__main__":
    # Teszt példa
    tool = EmailClassifier(
        email_subject="Sürgős: Holnapi megbeszélés időpontja",
        email_body="Kérem, erősítse meg részvételét a holnapi megbeszélésen. A találkozó 10:00-kor kezdődik.",
        sender="kolléga@vallalat.hu"
    )
    result = tool.run()
    print(result) 