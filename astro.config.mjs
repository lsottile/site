// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://lucianosottile.xyz',
  adapter: vercel({
    isr: {
      bypassToken: process.env.REVALIDATE_TOKEN,
      expiration: 60 * 60,
    },
    imageService: true,
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
