# Veyron Hungary AI Platform

Ez a projekt a Veyron Hungary számára készített egyedi AI platform, amely intelligens agenteket és automatizációs megoldásokat tartalmaz.

## Rendszerkövetelmények

- Node.js 18.x vagy újabb
- Python 3.8 vagy újabb
- npm vagy yarn

## Telepítés

1. Klónozd le a repository-t:
```bash
git clone https://github.com/yourusername/veyron-hungary.git
cd veyron-hungary
```

2. Telepítsd a webapp függőségeit:
```bash
cd soltai-webapp
npm install
```

3. Telepítsd a Veyron rendszer függőségeit:
```bash
cd ../veyron_agency
pip install -r requirements.txt
```

## Környezeti változók beállítása

1. Webapp (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

2. Veyron rendszer (.env):
```
OPENAI_API_KEY=your_openai_api_key
FLASK_SECRET_KEY=your_secret_key
```

## Futtatás

1. Webapp indítása:
```bash
cd soltai-webapp
npm run dev
```

2. Veyron rendszer indítása:
```bash
cd veyron_agency
python coordinator.py
```

## Bejelentkezés

- Felhasználónév: `veyron hungary`
- Jelszó: `veyron123`

## Rendszer felépítése

### Webapp
- Next.js alapú modern webalkalmazás
- Tailwind CSS styling
- TypeScript típusbiztonság
- API végpontok a `/api` mappában

### Veyron Agentek
1. CEO Agent
   - Koordinálja és felügyeli a többi agent működését
   - Központi döntéshozatal és feladatkiosztás

2. Content Agent
   - Tartalom generálás és kezelés
   - SEO optimalizálás

3. Media Agent
   - Média tartalmak kezelése
   - Képek és videók optimalizálása

## Fejlesztés

A projekt két fő részből áll:
1. Frontend webapp (Next.js)
2. Backend Veyron rendszer (Python/Flask)

### Új Agent Hozzáadása
1. Hozz létre egy új mappát az agent számára a `veyron_agency` mappában
2. Implementáld az agent logikáját
3. Regisztráld az agentet a `coordinator.py` fájlban

## Licenc
Minden jog fenntartva © 2024 Veyron Hungary 