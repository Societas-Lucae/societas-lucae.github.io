import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const cookieBannerDefaults = {
  title: 'Cookies for audience measurement',
  text: 'We would like to use Google Analytics to understand how this site is used. Nothing is loaded before you accept, and you can change your choice at any time.',
  linkLabel: 'Privacy and cookies',
  acceptLabel: 'Accept',
  declineLabel: 'Decline',
  settingsLabel: 'Cookie settings',
};

/**
 * Image references are stored as project paths (e.g. `/src/assets/uploads/home/photo.jpg`)
 * so the admin dashboard (Sveltia CMS) can write them, and are resolved to optimised
 * images at build time by `src/lib/images.ts`.
 */
const uploadPath = z.string().regex(/^\/src\/assets\/uploads\/.+/, {
  error: 'Image paths must start with /src/assets/uploads/',
});
const optionalUploadPath = z.union([uploadPath, z.literal('')]).optional();

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const settingsLoader = (name: string) =>
  file(`./src/content/settings/${name}.json`, {
    parser: (text) => ({ [name]: JSON.parse(text) }),
  });

const site = defineCollection({
  loader: settingsLoader('site'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    shortDescription: z.string(),
    contactEmail: z.email(),
    joinFormUrl: z.url(),
    flyer: z.string().optional(),
    logo: uploadPath,
    logoMark: uploadPath,
    socialLinks: z.array(
      z.object({
        platform: z.enum([
          'instagram',
          'facebook',
          'linkedin',
          'youtube',
          'x',
          'whatsapp',
          'email',
          'website',
        ]),
        label: z.string(),
        url: z.string(),
      })
    ),
    footerNote: z.string(),
    analytics: z
      .object({
        googleAnalyticsId: z.string().optional(),
      })
      .optional(),
    cookieBanner: z
      .object({
        title: z.string(),
        text: z.string(),
        linkLabel: z.string(),
        acceptLabel: z.string(),
        declineLabel: z.string(),
        settingsLabel: z.string(),
      })
      .default(cookieBannerDefaults),
  }),
});

const seo = defineCollection({
  loader: settingsLoader('seo'),
  schema: z.object({
    defaultTitle: z.string(),
    titleTemplate: z.string(),
    defaultDescription: z.string(),
    keywords: z.array(z.string()).default([]),
    ogImage: optionalUploadPath,
    twitterHandle: z.string().optional(),
    googleSiteVerification: z.string().optional(),
    robots: z.object({ index: z.boolean().default(true), follow: z.boolean().default(true) }),
    organization: z
      .object({
        legalName: z.string(),
        foundingDate: z.string().optional(),
        parentOrganization: z.string().optional(),
        parentOrganizationUrl: z.string().optional(),
      })
      .optional(),
  }),
});

const navigation = defineCollection({
  loader: settingsLoader('navigation'),
  schema: z.object({
    header: z.array(link),
    headerCta: link.optional(),
    footer: z.array(link),
  }),
});

const home = defineCollection({
  loader: settingsLoader('home'),
  schema: z.object({
    hero: z.object({
      title: z.string(),
      quote: z.string().optional(),
      quoteAuthor: z.string().optional(),
      ctaLabel: z.string(),
      secondaryCtaLabel: z.string().optional(),
      image: uploadPath,
      imageAlt: z.string().default(''),
    }),
    countries: z.object({
      title: z.string(),
      items: z.array(z.object({ name: z.string(), code: z.string() })),
    }),
    about: z.object({
      tagline: z.string(),
      title: z.string(),
      body: z.string(),
      image: uploadPath,
      imageAlt: z.string().default(''),
      manifesto: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    }),
    values: z.object({
      title: z.string(),
      items: z.array(z.object({ title: z.string(), description: z.string(), image: uploadPath })),
    }),
    whatWeDo: z.object({
      tagline: z.string(),
      title: z.string(),
      items: z.array(
        z.object({ title: z.string(), icon: z.string().default('spark'), description: z.string() })
      ),
    }),
    events: z.object({ tagline: z.string(), title: z.string(), intro: z.string().optional() }),
    join: z.object({
      tagline: z.string(),
      title: z.string(),
      text: z.string(),
      expandedText: z.string(),
      ctaLabel: z.string(),
      finalCtaLabel: z.string(),
      contactLabel: z.string(),
    }),
    testimonials: z.object({ tagline: z.string(), title: z.string() }),
    help: z.object({
      tagline: z.string(),
      title: z.string(),
      image: uploadPath,
      imageAlt: z.string().default(''),
      items: z.array(
        z.object({ title: z.string(), icon: z.string().default('spark'), description: z.string() })
      ),
      contactLine: z.string().optional(),
    }),
  }),
});

const eventCategories = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/event-categories' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    upcomingNote: z.string().optional(),
    pastLabel: z.string().default('Past events'),
    order: z.number().default(99),
    icon: z.string().default('calendar'),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    online: z.boolean().default(false),
    speakers: z.array(z.object({ name: z.string(), role: z.string().optional() })).default([]),
    summary: z.string(),
    image: optionalUploadPath,
    gallery: z.array(uploadPath).default([]),
    links: z
      .array(z.object({ label: z.string(), url: z.string(), primary: z.boolean().optional() }))
      .default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    country: z.string().optional(),
    quote: z.string(),
    image: optionalUploadPath,
    published: z.boolean().default(true),
    order: z.number().default(99),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { site, seo, navigation, home, eventCategories, events, testimonials, pages };
