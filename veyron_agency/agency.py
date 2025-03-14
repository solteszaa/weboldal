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

if __name__ == "__main__":
    agency.run_demo()  # Elindítja az ügynökséget a terminálban 