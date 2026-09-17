# Editing the website — admin guide

The site has an admin dashboard at **https://societaslucae.org/admin/**.
It is built with [Sveltia CMS](https://sveltiacms.app/) and edits the files of this GitHub repository directly:
every change you save becomes a commit on the `main` branch and the site is rebuilt and published
automatically in about two minutes (production on Netlify, test site on GitHub Pages).

## 1. Signing in

You need a GitHub account with **write access** to the repository `Societas-Lucae/societas-lucae.github.io`
(ask an organisation owner to add you to the *Website editors* team or as a collaborator).

1. Open `/admin` and click **Sign in with token**.
2. Follow the link to GitHub to create a **fine-grained personal access token**:
   - *Repository access*: only `Societas-Lucae/societas-lucae.github.io`
   - *Permissions*: **Contents → Read and write** (Metadata is added automatically)
   - Expiration: up to one year; you will simply create a new one when it expires
3. Paste the token in the dialog. It is stored in your browser only.

> Optional: for a one-click "Sign in with GitHub" experience for several editors, deploy the free
> [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) Cloudflare Worker and add
> `base_url: https://<your-worker>.workers.dev` under `backend:` in `public/admin/config.yml`.

## 2. What you can edit

| Menu entry           | What it controls                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------- |
| **Home page**        | Every text and image of the one-page site, section by section (hero, countries, about, values, what we do, join, help…) |
| **Site settings**    | Name, contact e-mail, membership form link, flyer PDF, logo, social links, footer note, Google Analytics id |
| **SEO**              | Page title and description shown by Google and social networks, sharing image, keywords        |
| **Navigation**       | Links of the header and footer                                                                |
| **Events**           | One entry per event, with category, dates, location, speakers, flyer, gallery and links       |
| **Event categories** | The four groups of the Events section (online conferences, congresses, Lucae Lab, hands-on)   |
| **Testimonials**     | Quotes of the "In their own words" section. Each one has a *Shown on the site* switch: off hides it without deleting it, and the section disappears when none is shown |
| **Pages**            | The privacy page                                                                              |
| **Assets**           | The media library: browse, upload, rename and delete images                                   |

## 3. Adding an event

1. **Events → New event.**
2. Fill in the title, choose the **category**, the **start date** (and end date for multi-day events),
   the **location** (or tick *Online event*), a short **summary** and, if you have it, the **flyer** as
   cover image. Add photos to the **gallery** after the event.
3. Add a **link** (registration form, congress website…) and tick *Main button* for the one to highlight.
4. **Save**. The event appears automatically under *Next* while its last day is not over, then under the
   past events of its category.

Tips
- Use the **Draft** switch to prepare an event without publishing it.
- The **Details** field accepts formatted text (bold, links, lists).
- File names are generated from the start date and the title; you do not have to care about them.

## 4. Images

- Click any image field to open the **media library**: pick an existing picture or upload a new one.
- Uploaded pictures are converted to WebP and limited to 2000 px automatically. The site then generates
  the right sizes for phones and desktops at build time.
- Recommended: flyers in portrait format, photos of at least 1200 px on the long side.
- Keep the library tidy: one folder per event (`events/lucae-lab-2026`, …) is created automatically when
  you upload from an event.

## 5. Checking the result

After saving, open https://github.com/Societas-Lucae/societas-lucae.github.io/actions: the
*Deploy to GitHub Pages* workflow shows the build. When it is green, reload the site.
If a build fails (for example an image field pointing to a deleted file), the previous version stays online;
fix the entry and save again.
