from agency_swarm.tools import BaseTool
from pydantic import Field
import os
from dotenv import load_dotenv

load_dotenv()  # Környezeti változók betöltése

class EmailResponder(BaseTool):
    """
    Email válaszadó eszköz, amely automatikusan generál válaszokat az emailekre.
    Az eszköz különböző sablonokat használ a válaszok generálásához a kategória alapján.
    """
    email_subject: str = Field(
        ..., description="Az email tárgya, amire válaszolni kell."
    )
    email_body: str = Field(
        ..., description="Az email törzse, amire válaszolni kell."
    )
    sender_name: str = Field(
        ..., description="Az email küldőjének neve."
    )
    category: str = Field(
        ..., description="Az email kategóriája (Sürgős, Fontos, Általános, Hírlevél, Spam)."
    )

    def run(self):
        """
        Automatikus választ generál az emailre a kategória és tartalom alapján.
        Visszaadja a generált választ.
        """
        # Válasz sablonok kategóriánként
        templates = {
            "Sürgős": [
                f"Tisztelt {self.sender_name}!\n\nKöszönöm sürgős megkeresését a következő tárgyban: '{self.email_subject}'. Azonnal foglalkozom az üggyel és hamarosan visszajelzek a részletekkel kapcsolatban.\n\nÜdvözlettel,\nEmail Asszisztens AI",
                f"Kedves {self.sender_name}!\n\nMegkaptam sürgős üzenetét. Prioritásként kezelem a kérését és a lehető leghamarabb válaszolok. Kérem, legyen türelemmel.\n\nÜdvözlettel,\nEmail Asszisztens AI"
            ],
            "Fontos": [
                f"Tisztelt {self.sender_name}!\n\nKöszönöm fontos megkeresését a következő tárgyban: '{self.email_subject}'. Feldolgoztam az üzenetet és hamarosan részletes választ küldök.\n\nÜdvözlettel,\nEmail Asszisztens AI",
                f"Kedves {self.sender_name}!\n\nKöszönöm, hogy írt nekünk. Üzenetét fontosként kezeltem és továbbítottam a megfelelő osztálynak. Hamarosan válaszolunk a felvetett kérdésekre.\n\nÜdvözlettel,\nEmail Asszisztens AI"
            ],
            "Általános": [
                f"Tisztelt {self.sender_name}!\n\nKöszönjük megkeresését a következő tárgyban: '{self.email_subject}'. Üzenetét megkaptuk és feldolgozzuk. Hamarosan válaszolunk.\n\nÜdvözlettel,\nEmail Asszisztens AI",
                f"Kedves {self.sender_name}!\n\nKöszönjük, hogy írt nekünk. Megkaptuk üzenetét és dolgozunk a válaszon. Hamarosan jelentkezünk.\n\nÜdvözlettel,\nEmail Asszisztens AI"
            ],
            "Hírlevél": None,  # Hírlevelekre általában nem válaszolunk
            "Spam": None  # Spamre nem válaszolunk
        }
        
        # Ha nincs sablon a kategóriához, nincs válasz
        if self.category not in templates or templates[self.category] is None:
            return {
                "response": None,
                "action": "Nincs automatikus válasz generálva erre a kategóriára.",
                "status": "skipped"
            }
        
        # Válasz kiválasztása (egyszerű példa: az első sablon)
        import random
        response_template = random.choice(templates[self.category])
        
        # Egyszerű személyre szabás
        # Valós alkalmazásban itt NLP modellt használnánk a tartalom elemzésére
        response = response_template
        
        # Egyszerű kulcsszó felismerés a válasz személyre szabásához
        if "árajánlat" in self.email_body.lower():
            response += "\n\nP.S.: Árajánlattal kapcsolatos kérdésekben kollégáink hamarosan felveszik Önnel a kapcsolatot."
        elif "időpont" in self.email_body.lower() or "találkozó" in self.email_body.lower():
            response += "\n\nP.S.: Időpontegyeztetéssel kapcsolatban kérem, tekintse meg online naptárunkat a weboldalunkon."
        
        return {
            "response": response,
            "action": f"Automatikus válasz generálva a(z) {self.category} kategóriájú emailre.",
            "status": "completed"
        }

if __name__ == "__main__":
    # Teszt példa
    tool = EmailResponder(
        email_subject="Árajánlatkérés webfejlesztésre",
        email_body="Tisztelt Cím!\n\nSzeretnék árajánlatot kérni egy webshop fejlesztésére. Milyen feltételekkel tudnának vállalni egy ilyen projektet?\n\nÜdvözlettel,\nTeszt Elek",
        sender_name="Teszt Elek",
        category="Fontos"
    )
    result = tool.run()
    print(result) 