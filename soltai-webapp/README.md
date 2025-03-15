# SoltAI Webapp

Ez a projekt a SoltAI Solutions weboldala, amely Next.js-szel készült.

## Telepítés

A projekt telepítéséhez kövesd az alábbi lépéseket:

1. Klónozd le a repót:
```bash
git clone https://github.com/yourusername/soltai-webapp.git
cd soltai-webapp
```

2. Telepítsd a függőségeket:
```bash
npm install
```

3. Hozz létre egy `.env.local` fájlt a gyökérkönyvtárban a következő tartalommal:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# További környezeti változók...
```

## Fejlesztés

A fejlesztői szerver indításához futtasd:

```bash
npm run dev
```

Ezután nyisd meg a [http://localhost:3000](http://localhost:3000) címet a böngészőben.

## Build és Telepítés

A production build elkészítéséhez futtasd:

```bash
npm run build
```

A production szerver indításához futtasd:

```bash
npm run start
```

## Vercel Telepítés

A projekt könnyen telepíthető a Vercel platformra:

1. Hozz létre egy fiókot a [Vercel](https://vercel.com) oldalon
2. Kapcsold össze a GitHub repóval
3. Importáld a projektet
4. Állítsd be a környezeti változókat a Vercel felületén
5. Kattints a "Deploy" gombra

## Technológiák

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Struktúra

- `src/app`: Next.js App Router
- `src/app/api`: API végpontok
- `src/app/dashboard`: Dashboard oldalak
- `src/lib`: Segédfüggvények és osztályok 