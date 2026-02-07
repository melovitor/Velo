import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Mikael Barber',
        short_name: 'MikaelBarber',
        description: 'Agende seu corte com o melhor da região',
        theme_color: '#18181b', // Cor do fundo (Zinc 900)
        background_color: '#18181b',
        display: 'standalone', // Isso faz sumir a barra do navegador!
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true // Mantém o acesso via IP liberado
  }
})