# Veyron Hungary Social Media Automation

Ez a projekt egy automatizált rendszert biztosít a Veyron Hungary ingatlaniroda számára, amely lehetővé teszi a közösségi média posztok generálását ingatlanokról az OpenAI segítségével és a képek feltöltését az ImgBB szolgáltatásba.

## Telepítés

1. Klónozza ezt a repót a saját számítógépére:

```bash
git clone https://github.com/felhasználónév/veyron-automation.git
cd veyron-automation
```

2. Telepítse a szükséges függőségeket:

```bash
pip install -r veyron_agency/requirements.txt
```

3. Hozzon létre egy `.env` fájlt a projekt gyökérkönyvtárában a következő tartalommal:

```
OPENAI_API_KEY=az_ön_openai_api_kulcsa
IMGBB_API_KEY=az_ön_imgbb_api_kulcsa
WEBHOOK_URL=az_ön_webhook_url-je
```

## Használat

A rendszer három fő komponensből áll:
- **ImageAgent**: Képek feltöltése ImgBB-re
- **ContentAgent**: Közösségi média posztok generálása OpenAI-val
- **SocialMediaAgent**: A képek és posztok kezelése, tárolása és webhook-ra küldése

### Futtatás önálló terminál alkalmazásként

```bash
python veyron_agency/agency.py
```

Ez elindít egy interaktív terminál alkalmazást, ahol a következő utasításokat adhatja:

1. Ingatlan adatok megadása (típus, helyszín, méret, szobák, ár, különleges jellemzők)
2. Képek elérési útjának megadása feltöltéshez
3. Poszt generálása (mindig professzionális hangnemben)

### Integráció a weboldallal

1. Másolja a `veyron_agency` mappát a Veyron Hungary weboldal projektjének gyökérkönyvtárába
2. Hozzon létre egy új API útvonalat a weboldal API rendszerében:

```
POST /api/veyron/social-media/generate
```

Ennek a következő paramétereket kell fogadnia:
- `property_type`: Az ingatlan típusa
- `location`: Az ingatlan helye
- `size`: Az ingatlan mérete
- `rooms`: Szobák száma és típusa
- `price`: Az ingatlan ára
- `special_features`: Az ingatlan különleges jellemzői (opcionális)
- `image_paths`: A feltöltendő képek elérési útjai

### Dashboard integrálás

A generált posztok a `veyron_agency/social_media_posts/all_posts.json` fájlban kerülnek tárolásra. A dashboard ezt a fájlt olvashatja be és jelenítheti meg a posztokat.

### Webhook integráció

A rendszer a generált posztokat és a képek URL-jeit elküldi a `.env` fájlban megadott webhook URL-re. Ez lehetővé teszi a külső rendszerekkel való integrációt, például a posztok automatikus közzétételét különböző platformokon.

A webhook a következő JSON formátumot használja:
```json
{
  "property_name": "Az ingatlan neve",
  "content": "A generált poszt szövege",
  "image_urls": ["url1", "url2", "url3"],
  "tone": "professional"
}
```

## Példa

1. Indítsa el a rendszert
2. Adja meg az ingatlan adatokat:
   - Típus: "villa"
   - Helyszín: "Budapest, II. kerület"
   - Méret: "350 m²"
   - Szobák: "5 szoba + 3 fürdőszoba"
   - Ár: "650 000 000 Ft"
   - Különleges jellemzők: "medence, kert, panoráma kilátás, okosotthon, biztonsági rendszer"
3. Adja meg a képek elérési útját

A rendszer feltölti a képeket az ImgBB-re, generál egy professzionális hangnemű posztot az OpenAI segítségével, majd tárolja ezeket a dashboardon való megjelenítéshez és elküldi a megadott webhook URL-re.

## Jövőbeli fejlesztések

- Poszt analitika és statisztikák nyomon követése
- Automatikus ütemezés és publikálás
- Egyéb tartalomtípusok generálása (pl. videók, történetek)

## Licenc

Ez a projekt [MIT licenc](LICENSE) alatt áll. 