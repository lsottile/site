// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  site: 'https://lucianosottile.xyz',
  adapter: vercel({
    imageService: true,
    isr: {
      expiration: 60 * 30,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
