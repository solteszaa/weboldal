from agency_swarm import Agency
from veyron_agency.image_agent import ImageAgent
from veyron_agency.content_agent import ContentAgent
from veyron_agency.social_media_agent import SocialMediaAgent

def create_agency():
    """
    Létrehozza a Veyron Hungary Social Media Automation Agency-t
    """
    # Ügynökök példányosítása
    image_agent = ImageAgent()
    content_agent = ContentAgent()
    social_media_agent = SocialMediaAgent()
    
    # Agency létrehozása a megfelelő kommunikációs csatornákkal
    agency = Agency(
        [
            social_media_agent,  # A SocialMediaAgent lesz a belépési pont a felhasználói kommunikációhoz
            [social_media_agent, image_agent],  # SocialMediaAgent kommunikálhat az ImageAgent-tel
            [social_media_agent, content_agent],  # SocialMediaAgent kommunikálhat a ContentAgent-tel
            [content_agent, social_media_agent],  # ContentAgent visszakommunikálhat a SocialMediaAgent-nek
            [image_agent, social_media_agent],  # ImageAgent visszakommunikálhat a SocialMediaAgent-nek
        ],
        shared_instructions="./agency_manifesto.md",  # közös utasítások minden ügynök számára
        temperature=0.3,  # alapértelmezett hőmérséklet az összes ügynök számára
        max_prompt_tokens=25000,  # alapértelmezett maximális token a párbeszéd-előzményekben
    )
    
    return agency

# Ha közvetlenül futtatják ezt a fájlt, indítsa el az ügynökséget a terminálban
if __name__ == "__main__":
    agency = create_agency()
    agency.run_demo()  # Elindítja az ügynökséget a terminálban 