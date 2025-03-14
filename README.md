# Soltai Solutions AI Ügynök Platform

Ez a repository tartalmazza a Soltai Solutions AI ügynök platformot, amely lehetővé teszi több ügyfél számára dedikált AI ügynökségek kezelését egy központosított rendszeren keresztül. Az ügynökök az Agency Swarm keretrendszert használják.

## Projekt struktúra

```
soltai-ai-agents/
├── clients/                             # Minden ügyfél külön mappában
│   ├── veyron_hungary/                  # Veyron Hungary ügyfél
│   │   ├── agency.py                    # Ügynökség definíció
│   │   ├── agency_manifesto.md          # Közös utasítások
│   │   ├── ceo_agent/                   # CEO ügynök
│   │   ├── content_agent/               # Tartalomgyártó ügynök
│   │   └── media_agent/                 # Médiakezelő ügynök
│   └── masodik_ugyfel/                  # Második ügyfél
│       └── ...
│
├── web/                                 # Web alkalmazás
│   ├── app.py                           # Flask alkalmazás
│   ├── static/                          # Statikus fájlok
│   │   └── css/                         # CSS fájlok
│   │       └── style.css                # Fő stíluslap
│   └── templates/                       # HTML sablonok
│       ├── index.html                   # Főoldal
│       └── client.html                  # Ügyfél oldal
│
├── uploads/                             # Feltöltött fájlok
│   └── clients/                         # Ügyfél-specifikus feltöltések
│       └── veyron_hungary/              # Veyron Hungary feltöltései
│
├── requirements.txt                     # Fő függőségek
├── render.yaml                          # Render konfiguráció
└── .gitignore                           # Git kizárások
```

## Telepítés és futtatás

### Előfeltételek

- Python 3.9+
- pip

### Telepítési lépések

1. Klónozd a repository-t:

```bash
git clone https://github.com/felhasznaloneved/soltai-ai-agents.git
cd soltai-ai-agents
```

2. Hozz létre egy virtuális környezetet:

```bash
python -m venv venv
```

3. Aktiváld a virtuális környezetet:

Windows:
```bash
venv\Scripts\activate
```

Unix/MacOS:
```bash
source venv/bin/activate
```

4. Telepítsd a függőségeket:

```bash
pip install -r requirements.txt
```

5. Hozz létre egy `.env` fájlt a gyökérmappában:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
IMGBB_API_KEY=xxxxxxxxxxxxxxx
WEBHOOK_URL=https://webhook.example.com/endpoint
```

### Futtatás lokálisan

```bash
cd web
python app.py
```

Az alkalmazás ezután elérhető a [http://localhost:5000](http://localhost:5000) címen.

## Új ügyfél hozzáadása

Az új ügyfél hozzáadásához kövesd ezeket a lépéseket:

1. Hozz létre egy új mappát az ügyfél számára a `clients` mappában:

```bash
mkdir -p clients/uj_ugyfel
```

2. Hozd létre az agency.py, agency_manifesto.md fájlokat és az ügynök mappákat az Agency Swarm keretrendszer alapján.

3. Az új ügyfél automatikusan megjelenik a platformon, amint az agency.py fájl elkészül.

## Render.com telepítés

1. Kapcsold össze a GitHub repository-t a Render.com-mal.

2. Új Web Service létrehozásakor használd a `render.yaml` konfigurációs fájlt.

3. Add meg a szükséges környezeti változókat:
   - `OPENAI_API_KEY`
   - `IMGBB_API_KEY`
   - `WEBHOOK_URL`

4. Indítsd el a szolgáltatást.

## Használt technológiák

- Flask: Web keretrendszer
- Agency Swarm: AI ügynök keretrendszer
- Bootstrap: Frontend megjelenítés
- OpenAI: AI modellek
- ImgBB: Képtárolás
- Webhook: Külső integráció 