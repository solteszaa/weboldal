/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Optimalizált build a Vercel és más platformokra
  env: {
    // Környezeti változók, amelyeket a kliens oldalon is elérhetővé szeretnénk tenni
    // Figyelem: Ezek nyilvánosan elérhetőek lesznek a böngészőben!
    // Ne tegyünk ide API kulcsokat vagy titkos adatokat
  },
  images: {
    domains: ['i.ibb.co'], // Engedélyezett kép domainek
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig; 