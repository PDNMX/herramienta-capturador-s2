/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'S2 - Sistema de Servidores Públicos',
    NEXT_PUBLIC_BACKEND_URL: 'http://localhost:8055',
  },
}

module.exports = nextConfig