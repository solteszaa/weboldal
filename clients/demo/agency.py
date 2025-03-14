from agency_swarm import Agency
import os
import sys
from dotenv import load_dotenv

# Adjuk hozzá az agent mappákat a Python elérési útjához
sys.path.append(os.path.join(os.path.dirname(__file__), 'agents/agent-1'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'agents/agent-2'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'agents/agent-3'))

# Importáljuk az agenteket
from agent import EmailAssistant

load_dotenv()  # Környezeti változók betöltése

# Inicializáljuk az agenteket
email_assistant = EmailAssistant()

# Létrehozzuk az agency-t
agency = Agency(
    [
        email_assistant,  # Email Asszisztens lesz a belépési pont
    ],
    shared_instructions="./agency_manifesto.md",  # Közös utasítások minden agentnek
    temperature=0.5,
    max_prompt_tokens=25000
)

if __name__ == "__main__":
    # Teszt példa
    agency.run_demo()  # Indítja az agency-t a terminálban 