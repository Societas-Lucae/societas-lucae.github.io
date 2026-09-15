// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Public URL of the deployed site.
 * - GitHub Pages test site: https://societas-lucae.github.io (default)
 * - Production: set SITE_URL=https://societaslucae.org in the deploy workflow
 *   once the custom domain is attached to the repository.
 */
const site = process.env.SITE_URL ?? 'https://societas-lucae.github.io';

export default defineConfig({
  site,
  base: '/',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  i18n: {
    // English only for now; add locales here (and in the CMS config) later.
    defaultLocale: 'en',
    locales: ['en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
