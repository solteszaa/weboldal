from agency_swarm import Agent
import os
from dotenv import load_dotenv

load_dotenv()  # Környezeti változók betöltése

class EmailAssistant(Agent):
    def __init__(self):
        super().__init__(
            name="Email Asszisztens",
            description="Automatikusan kategorizálja és válaszol az egyszerű emailekre.",
            instructions="./instructions.md",  # Az agent utasításai
            tools_folder="./tools",  # Az agent eszközei
            temperature=0.5,
            max_prompt_tokens=25000,
        )

if __name__ == "__main__":
    # Teszt példa
    agent = EmailAssistant()
    response = agent.chat("Kérlek, kategorizáld és válaszolj erre az emailre: 'Sürgős: Holnapi megbeszélés időpontja'")
    print(response) 