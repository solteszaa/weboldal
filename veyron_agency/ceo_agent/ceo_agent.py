from agency_swarm import Agent

class CEOAgent(Agent):
    def __init__(self):
        super().__init__(
            name="CEOAgent",
            description="A Veyron Hungary vezető ügynöke, aki a kommunikációért és a feladatok kiosztásáért felelős.",
            instructions="./instructions.md",
            tools_folder="./tools",
            temperature=0.5,
            max_prompt_tokens=25000,
        ) 