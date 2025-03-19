from agency_swarm import Agent

class ContentAgent(Agent):
    def __init__(self):
        super().__init__(
            name="ContentAgent",
            description="Ingatlanokról szóló social media posztokat generál az OpenAI API segítségével.",
            instructions="./instructions.md",
            tools_folder="./tools",
            temperature=0.7,
            max_prompt_tokens=25000,
        ) 