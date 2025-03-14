from agency_swarm import Agent

class MediaAgent(Agent):
    def __init__(self):
        super().__init__(
            name="MediaAgent",
            description="A Veyron Hungary média kezelő ügynöke, aki a képfeltöltésért és a webhook adatküldésért felelős.",
            instructions="./instructions.md",
            tools_folder="./tools",
            temperature=0.3,  # Alacsonyabb érték a precíz technikai feladatokhoz
            max_prompt_tokens=25000,
        ) 