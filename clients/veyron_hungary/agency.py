from agency_swarm import Agency

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
    shared_instructions="agency_manifesto.md",  # Közös utasítások minden ügynöknek
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