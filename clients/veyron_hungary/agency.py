import sys
import os
import platform

# Python elérési útvonal állapotának ellenőrzése és kiírása
print(f"Python elérési útvonalak: {sys.path}")
print(f"Operációs rendszer: {platform.system()}")
print(f"Jelenlegi könyvtár: {os.getcwd()}")

# Adjuk hozzá a projekt gyökérkönyvtárát a Python útvonalhoz
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
print(f"Projekt gyökérkönyvtár: {project_root}")

# A gyökérkönyvtár hozzáadása a Python útvonalhoz
if project_root not in sys.path:
    sys.path.insert(0, project_root)
    print(f"Hozzáadva a Python útvonalhoz: {project_root}")

try:
    # Több importálási módszer kipróbálása
    try:
        from agency_swarm import Agency
        print("Agency_swarm sikeresen importálva a normál módszerrel")
    except ImportError as e1:
        print(f"Normál importálás sikertelen: {e1}")
        try:
            # Másik importálási próbálkozás
            import agency_swarm
            Agency = agency_swarm.Agency
            print("Agency_swarm sikeresen importálva az alternatív módszerrel")
        except ImportError as e2:
            print(f"Alternatív importálás is sikertelen: {e2}")
            raise ImportError(f"Agency_swarm nem található: {e1}, {e2}")
except ImportError:
    print("Agency Swarm importálási hiba! Ellenőrizd, hogy telepítve van-e: pip install agency-swarm")
    raise

# Abszolút importok használata a relatív helyett
sys.path.append(current_dir)
from ceo_agent.ceo_agent import CEOAgent
from content_agent.content_agent import ContentAgent
from media_agent.media_agent import MediaAgent

# Ügynökök létrehozása
ceo = CEOAgent()
content = ContentAgent()
media = MediaAgent()

# Ügynökség létrehozása a kommunikációs folyamatokkal
agency = Agency(
    [
        ceo,  # A CEO ügynök lesz a kezdőpont a felhasználói kommunikációra
        [ceo, content],  # A CEO tud kommunikálni a Content ügynökkel
        [ceo, media],  # A CEO tud kommunikálni a Media ügynökkel
        [content, media]  # A Content ügynök tud kommunikálni a Media ügynökkel
    ],
    shared_instructions=os.path.join(current_dir, "agency_manifesto.md"),  # Abszolút útvonal a közös utasításokhoz
    temperature=0.5,  # Alapértelmezett hőmérséklet az ügynökök számára
    max_prompt_tokens=25000  # Alapértelmezett token limit a beszélgetés történetében
)

# Web alkalmazás kommunikáció
def process_message(message, image_url=None):
    """
    Feldolgozza a felhasználói üzenetet és visszaadja az ügynökség válaszát.
    
    Args:
        message (str): A felhasználói üzenet
        image_url (str, optional): A feltöltött kép URL-je, ha van
        
    Returns:
        str: Az ügynökség válasza
    """
    # Ha van kép, akkor hozzáadjuk az üzenethez
    if image_url:
        message = f"{message}\n\nA következő képet töltöttem fel: {image_url}"
    
    # Üzenet küldése az ügynökségnek (a CEO ügynöknek)
    response = agency.chat(message)
    
    return response

# Hozzáadjuk a process_message metódust az agency objektumhoz
agency.process_message = process_message

if __name__ == "__main__":
    agency.run_demo()  # Elindítja az ügynökséget a terminálban 