from agency_swarm import Agent

class ImageAgent(Agent):
    def __init__(self):
        super().__init__(
            name="ImageAgent",
            description="Képeket kezel és feltölti őket az ImgBB-re, majd visszaadja a képek URL-jeit.",
            instructions="./instructions.md",
            tools_folder="./tools",
            temperature=0.2,
            max_prompt_tokens=25000,
        ) 