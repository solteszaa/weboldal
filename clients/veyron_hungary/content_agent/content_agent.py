import sys
import os

# Adjuk hozzá a projekt gyökérkönyvtárát a Python útvonalhoz
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))))

try:
    from agency_swarm import Agent
except ImportError:
    print("Agency Swarm importálási hiba! Ellenőrizd, hogy telepítve van-e: pip install agency-swarm")
    raise

class ContentAgent(Agent):
    def __init__(self):
        super().__init__(
            name="ContentAgent",
            description="A tartalomkészítésért felelős ügynök, aki marketingszövegeket és posztokat ír.",
            instructions=os.path.join(current_dir, "instructions.md"),
            tools_folder=os.path.join(current_dir, "tools"),
            temperature=0.7,  # Magasabb kreativitás a tartalom generálásához
            max_prompt_tokens=25000,
        ) 