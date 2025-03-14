import sys
import os
import platform

# Python elérési útvonal állapotának ellenőrzése
print(f"CEOAgent - Python elérési útvonalak: {sys.path}")
print(f"CEOAgent - Operációs rendszer: {platform.system()}")
print(f"CEOAgent - Jelenlegi könyvtár: {os.getcwd()}")

# Adjuk hozzá a projekt gyökérkönyvtárát a Python útvonalhoz
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
print(f"CEOAgent - Projekt gyökérkönyvtár: {project_root}")

# A gyökérkönyvtár hozzáadása a Python útvonalhoz
if project_root not in sys.path:
    sys.path.insert(0, project_root)
    print(f"CEOAgent - Hozzáadva a Python útvonalhoz: {project_root}")

try:
    # Több importálási módszer kipróbálása
    try:
        from agency_swarm import Agent
        print("CEOAgent - Agency_swarm Agent sikeresen importálva a normál módszerrel")
    except ImportError as e1:
        print(f"CEOAgent - Normál importálás sikertelen: {e1}")
        try:
            # Másik importálási próbálkozás
            import agency_swarm
            Agent = agency_swarm.Agent
            print("CEOAgent - Agency_swarm Agent sikeresen importálva az alternatív módszerrel")
        except ImportError as e2:
            print(f"CEOAgent - Alternatív importálás is sikertelen: {e2}")
            raise ImportError(f"CEOAgent - Agency_swarm.Agent nem található: {e1}, {e2}")
except ImportError:
    print("CEOAgent - Agency Swarm importálási hiba! Ellenőrizd, hogy telepítve van-e: pip install agency-swarm")
    raise

class CEOAgent(Agent):
    def __init__(self):
        super().__init__(
            name="CEOAgent",
            description="A Veyron Hungary vezető ügynöke, aki a kommunikációért és a feladatok kiosztásáért felelős.",
            instructions=os.path.join(current_dir, "instructions.md"),
            tools_folder=os.path.join(current_dir, "tools"),
            temperature=0.5,
            max_prompt_tokens=25000,
        ) 