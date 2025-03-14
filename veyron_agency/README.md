# Veyron Hungary Luxusingatlan Marketing AI Ügynökség

Ez a projekt egy specializált AI ügynökséget implementál, amely luxusingatlanokhoz kapcsolódó marketing tartalmak generálására, képkezelésre és webhookra való továbbításra fókuszál.

## Funkciók

- **Luxusingatlan posztok generálása** - Az OpenAI API segítségével elegáns és meggyőző marketing szövegek készítése
- **Képfeltöltés** - Ingatlan képek feltöltése az ImgBB szolgáltatásra
- **Webhook integráció** - Automatikus adattovábbítás a megadott webhookra
- **Együttműködő ügynökök** - A különböző feladatokat specializált AI ügynökök végzik

## Telepítés

1. Klónozd le a repository-t:
```
git clone <repository-url>
cd veyron_agency
```

2. Telepítsd a függőségeket:
```
pip install -r requirements.txt
```

3. Hozz létre egy `.env` fájlt a szükséges környezeti változókkal:
```
cp .env.example .env
```

4. Szerkeszd a `.env` fájlt a saját API kulcsaiddal és URL-jeiddel:
```
OPENAI_API_KEY=your_openai_api_key
IMGBB_API_KEY=your_imgbb_api_key
WEBHOOK_URL=your_webhook_url
```

## Használat

1. Indítsd el az ügynökséget:
```
python agency.py
```

2. Kommunikálj a vezető ügynökkel (CEOAgent) a terminál interfészen keresztül.

3. Add meg a luxusingatlan részleteit és képeit, majd az ügynökség automatikusan generálja a tartalmakat és kezeli a képeket.

## Ügynökök

### CEOAgent
A kommunikációért és a feladatok koordinálásáért felelős vezető ügynök.

### ContentAgent
A luxusingatlan posztok generálásáért felelős ügynök az OpenAI API segítségével.

### MediaAgent
A képfeltöltésért és a webhook integráció kezeléséért felelős ügynök.

## Környezeti változók

- `OPENAI_API_KEY`: Az OpenAI API kulcs a tartalom generáláshoz
- `IMGBB_API_KEY`: Az ImgBB API kulcs a képfeltöltéshez
- `WEBHOOK_URL`: A webhook URL, ahová a tartalmakat küldjük

## Licenc

Minden jog fenntartva - Veyron Hungary 