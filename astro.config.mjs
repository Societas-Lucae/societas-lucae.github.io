// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Public URL of the deployed site. Netlify sets SITE_URL=https://societaslucae.org;
 * local builds and pull-request previews fall back to the production URL as well.
 */
const site = process.env.SITE_URL || 'https://societaslucae.org';

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
