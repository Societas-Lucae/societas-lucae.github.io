# Societas Lucae — website

Official website of [Societas Lucae](https://societaslucae.org), the international network of young Catholic
doctors and medical students, youth outreach of [FIAMC](https://www.fiamc.org/).

- **Production:** https://societaslucae.org (Netlify, built from `main` with the `SITE_URL` environment variable set to `https://societaslucae.org`)
- **Admin dashboard:** https://societaslucae.org/admin/ — see [docs/ADMIN.md](docs/ADMIN.md)
- **Work log:** every change is tracked in the [issues](../../issues) (labels: setup, design, content, feature, admin, seo, deploy, assets, responsive, docs, bug)

## Stack

| Layer      | Choice                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------- |
| Framework  | [Astro](https://astro.build) 7, static output, one-page site + event pages               |
| Styling    | Tailwind CSS v4, design tokens in `src/styles/global.css`                                |
| Fonts      | Plus Jakarta Sans (headings) and Inter (body), self-hosted via Fontsource                |
| Content    | Astro content collections: JSON singletons + Markdown events in `src/content/`           |
| Images     | Media library in `src/assets/uploads/`, optimised at build time by `astro:assets`        |
| Admin      | [Sveltia CMS](https://sveltiacms.app) at `/admin`, GitHub backend, config in `public/admin/config.yml` |
| Deployment | Netlify, built from `main` (deploy previews on pull requests)                            |

## Local development

Requirements: Node.js 22.12 or newer.

```bash
npm ci          # install dependencies
npm run dev     # http://localhost:4321
npm run build   # static build in dist/
npm run preview # serve dist/
npm run check   # astro check + prettier
```

## Project structure

```
public/            static files (favicons, admin dashboard, flyer PDF)
src/
  assets/uploads/  media library managed from the admin (brand/, home/, events/<event>/)
  components/      layout (header, footer, SEO), sections of the home page, events, UI primitives
  content/         editable content: settings/*.json, events/*.md, event-categories/*.json,
                   testimonials/*.json, pages/*.md
  content.config.ts  schemas (zod) of every collection
  layouts/         BaseLayout
  lib/             content accessors, image resolver, markdown helper
  pages/           index (one page), events/[id], privacy, 404, robots.txt
scripts/           copy-admin.mjs (copies the Sveltia bundle into public/admin at build time)
docs/ADMIN.md      guide for editors
```

Image references in the content files are project paths (`/src/assets/uploads/...`). They are resolved to optimised
images at build time by `src/lib/images.ts`; an unknown path fails the build, so a deleted picture cannot break
the live site silently.

## Deployment

Production is built by Netlify from `main`, with a deploy preview for every pull request. The `SITE_URL`
environment variable is set to `https://societaslucae.org` in Netlify so canonical URLs, the sitemap and social
sharing links use the production domain. Pull requests also run `.github/workflows/ci.yml` (check + build).

GitHub Pages is disabled on this repository (it used to host a test copy at societas-lucae.github.io).

## Content model

| Collection / file                  | Purpose                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| `settings/site.json`               | Name, contact, membership form, flyer, logo, social links, analytics |
| `settings/seo.json`                | Titles, description, keywords, sharing image, robots, organization |
| `settings/navigation.json`         | Header and footer links                                          |
| `settings/home.json`               | Every section of the home page                                   |
| `event-categories/*.json`          | The four categories of the Events section                        |
| `events/*.md`                      | One file per event (front matter + optional details)             |
| `testimonials/*.json`              | Quotes, with `published` flag and `order`                        |
| `pages/privacy.md`                 | Privacy page                                                     |

Multilingual: the site is English only for now. `astro.config.mjs` declares `i18n.locales = ['en']` and the
pages emit `hreflang` tags, so a second locale can be added later without restructuring.
