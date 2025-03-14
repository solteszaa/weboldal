# SoltAI Solutions Weboldal

Ez a projekt a SoltAI Solutions weboldala, amely személyre szabott AI agenteket és automatizációs megoldásokat kínál ügyfelei számára.

## Projekt Struktúra

A projekt két fő részből áll:

1. **Webes Felület (Next.js)**: A `soltai-webapp` mappában található, amely a felhasználói felületet biztosítja.
2. **AI Agentek (Python)**: A `clients` mappában található, amely az ügyfelek számára létrehozott AI agenteket tartalmazza.

### Webes Felület Struktúra

```
soltai-webapp/
├── src/
│   ├── app/
│   │   ├── api/                  # API route-ok
│   │   │   ├── agents/           # AI agentek kezelése
│   │   │   └── clients/          # Ügyfelek kezelése
│   │   ├── dashboard/            # Dashboard oldalak
│   │   │   └── [clientId]/       # Ügyfél-specifikus dashboard
│   │   │       └── agents/       # Agent kezelő oldalak
│   │   ├── globals.css           # Globális stílusok
│   │   ├── layout.tsx            # Fő layout
│   │   └── page.tsx              # Főoldal (bejelentkezés)
│   ├── components/               # Újrafelhasználható komponensek
│   └── lib/                      # Segédfüggvények, utility-k
├── public/                       # Statikus fájlok
├── package.json                  # Függőségek
└── tailwind.config.js            # Tailwind CSS konfiguráció
```

### AI Agentek Struktúra

```
clients/
├── demo/                         # Demo ügyfél
│   ├── agents/                   # Az ügyfél agentjei
│   │   ├── agent-1/              # Email Asszisztens agent
│   │   │   ├── tools/            # Agent eszközei
│   │   │   ├── agent.py          # Agent implementáció
│   │   │   ├── instructions.md   # Agent utasítások
│   │   │   └── metadata.json     # Agent metaadatok
│   │   ├── agent-2/              # Adatelemző agent
│   │   └── agent-3/              # Ütemező Bot agent
│   ├── agency.py                 # Agency definíció
│   ├── agency_manifesto.md       # Agency közös utasítások
│   └── requirements.txt          # Python függőségek
└── [client-id]/                  # További ügyfelek
```

## Telepítés és Futtatás

### Webes Felület

1. Telepítsd a függőségeket:

```bash
cd soltai-webapp
npm install
```

2. Indítsd el a fejlesztői szervert:

```bash
npm run dev
```

3. Nyisd meg a böngészőben: [http://localhost:3000](http://localhost:3000)

### AI Agentek

1. Telepítsd a Python függőségeket:

```bash
cd clients/demo
pip install -r requirements.txt
```

2. Indítsd el az agency-t (opcionális, csak teszteléshez):

```bash
python agency.py
```

## Használat

### Bejelentkezés

A főoldalon található bejelentkezési űrlapon keresztül lehet belépni. A demó fiókhoz használd a következő adatokat:
- Felhasználónév: `demo`
- Jelszó: `demo123`

### Dashboard

Bejelentkezés után a dashboard oldalon láthatók az elérhető AI agentek. Innen lehet:
- Megtekinteni az agenteket
- Új agentet létrehozni
- Kezelni a meglévő agenteket

### Agent Kezelés

Az agent részletes oldalán lehet:
- Megtekinteni az agent részleteit
- Kommunikálni az agenttel
- Aktiválni/deaktiválni az agentet

## Deployment

### Webes Felület (Vercel)

A webes felület könnyen deployolható a Vercel platformra:

```bash
cd soltai-webapp
vercel
```

### AI Agentek (Render)

Az AI agentek futtatásához egy Python környezetre van szükség, például a Render szolgáltatásra:

1. Hozz létre egy új Web Service-t a Render-en
2. Állítsd be a forráskód helyét (GitHub repository)
3. Állítsd be a build parancsot: `pip install -r clients/demo/requirements.txt`
4. Állítsd be a start parancsot: `python clients/demo/agency.py`

## Architektúra

A rendszer a következő módon működik:

1. A felhasználó belép a webes felületen
2. A dashboard megjeleníti az elérhető AI agenteket
3. A felhasználó kommunikálhat az agentekkel a webes felületen keresztül
4. A webes felület API hívásokat küld a háttérben futó Python AI agenteknek
5. Az AI agentek feldolgozzák a kéréseket és visszaküldik a válaszokat

## Fejlesztés

### Új Agent Létrehozása

1. Hozz létre egy új mappát az ügyfél `agents` mappájában
2. Készítsd el az agent implementációját (`agent.py`)
3. Hozd létre az agent eszközeit a `tools` mappában
4. Írd meg az agent utasításait (`instructions.md`)
5. Frissítsd az agency fájlt (`agency.py`)

### Új Ügyfél Létrehozása

1. Hozz létre egy új mappát a `clients` mappában
2. Másold át a szükséges fájlokat a demo ügyfélből
3. Módosítsd a fájlokat az új ügyfél igényei szerint

## Licenc

Minden jog fenntartva © SoltAI Solutions 