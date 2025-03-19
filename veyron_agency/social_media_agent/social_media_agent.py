from agency_swarm import Agent

class SocialMediaAgent(Agent):
    def __init__(self):
        super().__init__(
            name="SocialMediaAgent",
            description="Kezeli és publikálja a generált ingatlan posztokat a különböző közösségi média platformokon.",
            instructions="./instructions.md",
            tools_folder="./tools",
            temperature=0.2,
            max_prompt_tokens=25000,
        ) 