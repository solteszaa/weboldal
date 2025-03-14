from agency_swarm import Agent

class ContentAgent(Agent):
    def __init__(self):
        super().__init__(
            name="ContentAgent",
            description="A Veyron Hungary tartalom generáló ügynöke, aki luxusingatlanokról készít marketing posztokat.",
            instructions="./instructions.md",
            tools_folder="./tools",
            temperature=0.7,  # Magasabb kreativitás a tartalom generálásához
            max_prompt_tokens=25000,
        ) 