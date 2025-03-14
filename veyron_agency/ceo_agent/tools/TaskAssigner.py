from agency_swarm.tools import BaseTool
from pydantic import Field

class TaskAssigner(BaseTool):
    """
    Eszköz feladatok kiosztására a különböző ügynökök között.
    Segít nyomon követni, hogy melyik feladat melyik ügynökhöz tartozik.
    """
    
    task_description: str = Field(
        ..., description="A kiosztandó feladat részletes leírása."
    )
    
    agent_name: str = Field(
        ..., description="Annak az ügynöknek a neve, akinek a feladatot ki kell osztani (ContentAgent vagy MediaAgent)."
    )
    
    priority: str = Field(
        default="normal",
        description="A feladat prioritása: 'low', 'normal', vagy 'high'."
    )
    
    def run(self):
        """
        Kioszt egy feladatot a megadott ügynöknek és visszaadja a megerősítést.
        """
        # Ellenőrizzük, hogy érvényes ügynöknevet adtak-e meg
        valid_agents = ["ContentAgent", "MediaAgent"]
        if self.agent_name not in valid_agents:
            return f"Hiba: Érvénytelen ügynöknév. Válassz a következők közül: {', '.join(valid_agents)}"
            
        # Ellenőrizzük a prioritást
        valid_priorities = ["low", "normal", "high"]
        if self.priority not in valid_priorities:
            return f"Hiba: Érvénytelen prioritás. Válassz a következők közül: {', '.join(valid_priorities)}"
        
        # Itt egy valódi implementációban az adatbázisba mentenénk a feladatot,
        # vagy más módon továbbítanánk az adott ügynöknek.
        # Most csak egy leírást adunk vissza.
        
        # A prioritás emojija
        priority_emoji = {
            "low": "🔽",
            "normal": "➡️",
            "high": "🔼"
        }
        
        return f"""
        Feladat sikeresen kiosztva!
        
        {priority_emoji[self.priority]} Prioritás: {self.priority}
        👤 Hozzárendelve: {self.agent_name}
        📋 Feladat: {self.task_description}
        """

if __name__ == "__main__":
    # Teszt eset
    tool = TaskAssigner(
        task_description="Generálj egy posztot a Balatonfüredi luxus villáról 5 szobával és privát kikötővel.",
        agent_name="ContentAgent",
        priority="high"
    )
    print(tool.run()) 